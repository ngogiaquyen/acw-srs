"""
Script chinh sua: dat ten file anh theo CAPTION that cua hinh trong Word (style '70').
Caption la doan NGAY SAU hinh, co style '70'.
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os
import re
import zipfile
import shutil
import unicodedata
from pathlib import Path
from xml.etree import ElementTree as ET

DOCX_PATH  = list(Path(r"E:\JOB\esp32\acw-srs\documents").glob("*.docx"))[0]
MD_PATH    = DOCX_PATH.with_suffix(".md")
TAI_NGUYEN = Path(r"E:\JOB\esp32\acw-srs\documents\template_khoa_luan_ictu\tai_nguyen")

W    = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
WPD  = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'
AMD  = 'http://schemas.openxmlformats.org/drawingml/2006/main'
VML  = 'urn:schemas-microsoft-com:vml'
RREL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

# Style ID cua Caption trong file nay
CAPTION_STYLES = {'70', 'Caption', 'caption'}


def slugify(text: str) -> str:
    if not text:
        return ""
    # Chuyen d-gach-ngang (d with stroke) -> d truoc khi decompose
    text = text.replace('đ', 'd').replace('Đ', 'D')
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    text = text.lower()
    text = re.sub(r'[^\w\s.-]', '-', text)
    text = re.sub(r'[\s]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')


def clean_caption(text: str) -> str:
    """Bo prefix 'Hinh X.X:' / 'Bang X.X:' khoi caption de lay phan mo ta thuan tuy."""
    # Khop: Hinh/Bang/Figure/Table + so (1.1 hoac 1 hoac 10) + dau ':' hoac '.'
    text = re.sub(
        r'^(H[iì]nh|B[aả]ng|Figure|Table)\s+[\d]+(?:[\.,][\d]+)*\s*[:\.]\s*',
        '',
        text,
        flags=re.IGNORECASE
    ).strip()
    # Bo dau cham o cuoi
    text = text.rstrip('.')
    return text


def get_para_style(p) -> str:
    pPr = p.find(f'{{{W}}}pPr')
    if pPr is None: return ''
    pS  = pPr.find(f'{{{W}}}pStyle')
    if pS  is None: return ''
    return pS.get(f'{{{W}}}val', '')


def get_para_text(p) -> str:
    parts = []
    for t in p.iter(f'{{{W}}}t'):
        if t.text: parts.append(t.text)
    return ''.join(parts).strip()


def get_para_rids(p) -> list:
    """Lay danh sach rId cua anh trong mot doan van."""
    rids = []
    for blip in p.iter(f'{{{AMD}}}blip'):
        rid = blip.get(f'{{{RREL}}}embed')
        if rid: rids.append(rid)
    for imgd in p.iter(f'{{{VML}}}imagedata'):
        rid = imgd.get(f'{{{RREL}}}id')
        if rid: rids.append(rid)
    return rids


def build_rid_caption_map(docx: Path) -> dict:
    """
    Duyet toan bo body theo thu tu, map rid -> caption text.
    Quy tac:
      - Khi gap doan co anh, ghi nho cac rId chua duoc gan caption.
      - Doan ngay sau (hoac cach 1 doan trong) co style '70' -> cap caption.
      - Neu co nhieu anh lien tiep, cap theo thu tu xuat hien.
    """
    with zipfile.ZipFile(docx, 'r') as z:
        doc_xml = z.read('word/document.xml')

    doc_tree = ET.fromstring(doc_xml)
    body = doc_tree.find(f'{{{W}}}body')
    children = list(body)

    # Buoc 1: Quet toan bo body, tao danh sach (index, type, data)
    # type: 'img' (co anh), 'cap' (caption), 'other'
    events = []
    for i, child in enumerate(children):
        loc = child.tag.split('}')[-1]
        if loc != 'p':
            events.append((i, 'other', child, []))
            continue
        rids = get_para_rids(child)
        style = get_para_style(child)
        text  = get_para_text(child)
        if rids:
            events.append((i, 'img', child, rids))
        elif style in CAPTION_STYLES and text:
            events.append((i, 'cap', child, text))
        else:
            events.append((i, 'other', child, []))

    # Buoc 2: Gap caption, tim anh chua duoc gan caption gan nhat truoc do
    pending_rids = []   # [(para_idx, [rids])]
    rid_to_caption = {}

    for idx, etype, elem, data in events:
        if etype == 'img':
            pending_rids.append((idx, data))
        elif etype == 'cap':
            caption_text = data
            # Tim anh chua duoc gan caption, uu tien anh gan nhat
            if pending_rids:
                para_idx, rids = pending_rids.pop(0)
                for rid in rids:
                    if rid not in rid_to_caption:
                        rid_to_caption[rid] = caption_text
        elif etype == 'other':
            # Cho phep khoang cach toi da 2 doan giua hinh va caption
            # Neu doan 'other' qua xa, xa pending cu
            text = get_para_text(elem) if elem.tag.split('}')[-1] == 'p' else ''
            if text and pending_rids:
                # Neu co noi dung khac xen vao nhieu (>3 doan), flush pending
                oldest_idx = pending_rids[0][0]
                if idx - oldest_idx > 4:
                    pending_rids.pop(0)

    return rid_to_caption


def extract_images(docx: Path, out_dir: Path, rid_to_caption: dict) -> dict:
    """
    Tach anh, dat ten theo caption.
    Fallback: dung docPr name neu khong co caption.
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    for f in out_dir.iterdir():
        if f.is_file():
            f.unlink()

    with zipfile.ZipFile(docx, 'r') as z:
        rel_xml   = z.read('word/_rels/document.xml.rels')
        rel_tree  = ET.fromstring(rel_xml)
        rid_to_media = {}
        for rel in rel_tree:
            if 'image' in rel.get('Type', ''):
                rid_to_media[rel.get('Id')] = rel.get('Target')

        doc_xml   = z.read('word/document.xml')
        doc_tree  = ET.fromstring(doc_xml)

        # Lay docPr name de fallback
        rid_to_wp_name = {}
        for inline in doc_tree.iter(f'{{{WPD}}}inline'):
            _collect(inline, rid_to_wp_name)
        for anchor in doc_tree.iter(f'{{{WPD}}}anchor'):
            _collect(anchor, rid_to_wp_name)

        used: dict[str, int] = {}
        rid_to_out = {}

        for rid, media_target in rid_to_media.items():
            zip_path = f'word/{media_target}'
            if zip_path not in z.namelist():
                zip_path = media_target
            if zip_path not in z.namelist():
                continue

            src_ext = Path(media_target).suffix.lower()

            # Chon ten: uu tien caption, sau do docPr name, sau do media filename
            if rid in rid_to_caption:
                raw_name  = clean_caption(rid_to_caption[rid])
                name_stem = raw_name
                name_ext  = src_ext
            else:
                wp_name = rid_to_wp_name.get(rid, '').strip()
                if wp_name and '.' in wp_name:
                    p2 = Path(wp_name)
                    name_stem = p2.stem
                    name_ext  = p2.suffix.lower() or src_ext
                elif wp_name:
                    name_stem = wp_name
                    name_ext  = src_ext
                else:
                    name_stem = Path(media_target).stem
                    name_ext  = src_ext

            slug = slugify(name_stem) if name_stem else 'hinh'
            if not slug:
                slug = 'hinh'

            base = slug
            cnt  = used.get(base, 0)
            if cnt > 0:
                slug = f'{base}-{cnt}'
            used[base] = cnt + 1

            out_name = f'{slug}{name_ext}'
            out_path = out_dir / out_name

            with z.open(zip_path) as src, open(out_path, 'wb') as dst:
                shutil.copyfileobj(src, dst)

            rid_to_out[rid] = out_name
            src_label = rid_to_caption.get(rid, rid_to_wp_name.get(rid, '(fallback)'))
            print(f'  OK  {out_name:70s}  <- {src_label[:60]!r}')

    return rid_to_out


def _collect(drawing_elem, result: dict):
    docPr = drawing_elem.find(f'{{{WPD}}}docPr')
    wp_name = ''
    if docPr is not None:
        wp_name = (docPr.get('name') or docPr.get('descr') or docPr.get('title') or '')
    for blip in drawing_elem.iter(f'{{{AMD}}}blip'):
        rid = blip.get(f'{{{RREL}}}embed')
        if rid and (rid not in result or (wp_name and not result[rid])):
            result[rid] = wp_name


# ─────────────────────────────────────────────────────────────
# MARKDOWN CONVERSION (giong cu, chi thay rid_to_out)
# ─────────────────────────────────────────────────────────────

def run_md(r) -> str:
    rPr = r.find(f'{{{W}}}rPr')
    parts = []
    for el in r:
        loc = el.tag.split('}')[-1]
        if loc == 't': parts.append(el.text or '')
        elif loc == 'br': parts.append('  \n')
    text = ''.join(parts)
    if not text.strip(): return text
    if rPr is not None:
        bold   = rPr.find(f'{{{W}}}b')   is not None
        italic = rPr.find(f'{{{W}}}i')   is not None
        rSt    = rPr.find(f'{{{W}}}rStyle')
        is_code= (rSt is not None and
                  ('code' in rSt.get(f'{{{W}}}val','').lower() or
                   rSt.get(f'{{{W}}}val','') in ('VerbatimChar','SourceCode')))
        if is_code:          return f'`{text}`'
        if bold and italic:  return f'***{text}***'
        if bold:             return f'**{text}**'
        if italic:           return f'*{text}*'
    return text


def img_from_run(run, rid_to_out: dict) -> str:
    for ns in [f'{{{WPD}}}inline', f'{{{WPD}}}anchor']:
        d = run.find(f'.//{ns}')
        if d is not None:
            for blip in d.iter(f'{{{AMD}}}blip'):
                rid = blip.get(f'{{{RREL}}}embed')
                if rid and rid in rid_to_out:
                    fname = rid_to_out[rid]
                    docPr = d.find(f'.//{{{WPD}}}docPr')
                    alt = fname
                    if docPr is not None:
                        alt = docPr.get('descr','') or docPr.get('name','') or fname
                    return f'![{alt}](tai_nguyen/{fname})'
    imgd = run.find(f'.//{{{VML}}}imagedata')
    if imgd is not None:
        rid = imgd.get(f'{{{RREL}}}id')
        if rid and rid in rid_to_out:
            fname = rid_to_out[rid]
            return f'![{fname}](tai_nguyen/{fname})'
    return ''


def para_md(p, rid_to_out: dict) -> str:
    style  = get_para_style(p)
    pPr    = p.find(f'{{{W}}}pPr')
    numPr  = None
    if pPr is not None:
        nPr = pPr.find(f'{{{W}}}numPr')
        if nPr is not None:
            ilvl  = nPr.find(f'{{{W}}}ilvl')
            numId = nPr.find(f'{{{W}}}numId')
            if ilvl is not None and numId is not None:
                numPr = (numId.get(f'{{{W}}}val','0'),
                         int(ilvl.get(f'{{{W}}}val', 0)))

    parts = []
    for child in p:
        loc = child.tag.split('}')[-1]
        if loc == 'r':
            img = img_from_run(child, rid_to_out)
            parts.append(img if img else run_md(child))
        elif loc == 'hyperlink':
            link_text = ''.join(t.text or '' for r in child.iter(f'{{{W}}}r')
                                              for t in r.iter(f'{{{W}}}t'))
            parts.append(link_text)
        elif loc == 'ins':
            for r in child.iter(f'{{{W}}}r'):
                parts.append(run_md(r))

    text = ''.join(parts).strip()
    if not text: return ''

    HEADING = {'Heading1':'# ','Heading2':'## ','Heading3':'### ',
               'Heading4':'#### ','Heading5':'##### ',
               '1':'# ','2':'## ','3':'### ','4':'#### ','5':'##### '}
    if style in HEADING: return HEADING[style] + text
    m = re.match(r'Heading(\d)', style)
    if m: return '#'*int(m.group(1)) + ' ' + text
    if numPr:
        _, ilvl = numPr
        return '  '*ilvl + '- ' + text
    if style in CAPTION_STYLES: return f'*{text}*\n'
    if style in ('Code','VerbatimChar','SourceCode','PreformattedText'):
        return f'```\n{text}\n```'
    return text


def table_md(tbl) -> list:
    rows = tbl.findall(f'{{{W}}}tr')
    if not rows: return []
    data = []
    for row in rows:
        cells = row.findall(f'{{{W}}}tc')
        row_texts = []
        for cell in cells:
            parts = []
            for p in cell.findall(f'{{{W}}}p'):
                cell_parts = [run_md(r) for r in p.findall(f'{{{W}}}r')]
                parts.append(''.join(cell_parts).strip())
            row_texts.append(' '.join(filter(None, parts)).replace('|','\\|'))
        data.append(row_texts)
    if not data: return []
    max_col = max(len(r) for r in data)
    for r in data:
        while len(r) < max_col: r.append('')
    lines  = ['| ' + ' | '.join(data[0]) + ' |']
    lines += ['| ' + ' | '.join(['---']*max_col) + ' |']
    for row in data[1:]:
        lines.append('| ' + ' | '.join(row) + ' |')
    return lines


def docx_to_md(docx: Path, rid_to_out: dict) -> str:
    with zipfile.ZipFile(docx, 'r') as z:
        doc_xml = z.read('word/document.xml')
    doc_tree = ET.fromstring(doc_xml)
    body = doc_tree.find(f'{{{W}}}body')
    lines = []
    prev_blank = False
    for child in body:
        loc = child.tag.split('}')[-1]
        if loc == 'p':
            md = para_md(child, rid_to_out)
            if md == '':
                if not prev_blank: lines.append('')
                prev_blank = True
            else:
                lines.append(md)
                prev_blank = False
        elif loc == 'tbl':
            lines.append('')
            lines.extend(table_md(child))
            lines.append('')
            prev_blank = True
        elif loc == 'sdt':
            content = child.find(f'.//{{{W}}}sdtContent')
            if content:
                for p in content.iter(f'{{{W}}}p'):
                    md = para_md(p, rid_to_out)
                    lines.append(md if md else '')
    return '\n'.join(lines)


# ─────────────────────────────────────────────────────────────
def main():
    print(f'DOCX: {DOCX_PATH.name}')
    print()

    print('[0/3] Xay dung ban do caption...')
    rid_caption = build_rid_caption_map(DOCX_PATH)
    print(f'      -> Tim thay {len(rid_caption)} caption cho anh.')
    for rid, cap in rid_caption.items():
        print(f'         {rid}: {cap[:80]!r}')
    print()

    print('[1/3] Tach anh voi ten theo caption...')
    rid_out = extract_images(DOCX_PATH, TAI_NGUYEN, rid_caption)
    print(f'      -> {len(rid_out)} anh da luu vao tai_nguyen/')
    print()

    print('[2/3] Chuyen noi dung sang Markdown...')
    md = docx_to_md(DOCX_PATH, rid_out)
    MD_PATH.write_text(md, encoding='utf-8')
    print(f'      -> Da luu: {MD_PATH.name}')
    print()
    print('XONG!')

if __name__ == '__main__':
    main()
