import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    in_chapter_3_old = False

    for i, line in enumerate(lines):
        # 1. Chương 1
        if line.strip() == 'CHƯƠNG 1. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ PHẦM MỀM':
            new_lines.append('CHƯƠNG 1. CƠ SỞ LÝ THUYẾT\n')
            new_lines.append('(Những công nghệ chính sử dụng trong đồ án)\n')
            continue

        # 2. Chương 2
        if line.strip() == 'CHƯƠNG 2. KHẢO SÁT,PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG ACW-SRS':
            new_lines.append('CHƯƠNG 2. KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG\n')
            continue

        # 3. 2.1.2. Giới thiệu hệ thống (at line 413 originally)
        if line.strip() == '2.1.2. Giới thiệu hệ thống' and i > 400 and i < 420:
            new_lines.append('2.1.2. Hiện trạng và sự cần thiết của hệ thống\n')
            continue

        # 4, 5, 6, 7. Fix 2.1 numbering issues
        if line.strip() == '2.1. Yêu cầu về hệ thống':
            new_lines.append('2.2. Yêu cầu về hệ thống\n')
            continue
        if line.strip() == '2.1.1. Yêu cầu chức năng của hệ thống':
            new_lines.append('2.2.1. Yêu cầu chức năng của hệ thống\n')
            continue
        if line.strip() == '2.1.2. Yêu cầu phi chức năng':
            new_lines.append('2.2.2. Yêu cầu phi chức năng\n')
            continue
        if line.strip() == '2.2. Phân tích hệ thống (Sơ đồ Use Case).':
            new_lines.append('2.3. Phân tích hệ thống (Sơ đồ Use Case).\n')
            continue

        # 8. 2.3 Phân tích chi tiết từng chức năng -> Chương 3
        if line.strip() == '2.3 Phân tích chi tiết từng chức năng':
            new_lines.append('CHƯƠNG 3. THIẾT KẾ HỆ THỐNG\n')
            new_lines.append('3.1. Thiết kế chi tiết từng chức năng\n')
            continue

        # 9. 2.3.x -> 3.1.x
        if re.match(r'^2\.3\.(\d+)', line):
            new_lines.append(re.sub(r'^2\.3\.(\d+)', r'3.1.\1', line))
            continue

        # 10. CHƯƠNG 3 -> CHƯƠNG 4
        if line.strip() == 'CHƯƠNG 3. TRIỂN KHAI VÀ ĐÁNH GIÁ KẾT QUẢ':
            new_lines.append('CHƯƠNG 4. TRIỂN KHAI\n')
            in_chapter_3_old = True
            continue

        # 11, 12, 13. Update numbering in the old Chapter 3 (which is now Chapter 4)
        if in_chapter_3_old:
            if re.match(r'^ 3\.(\d+)\.', line):
                new_lines.append(re.sub(r'^ 3\.(\d+)\.', r' 4.\1.', line))
                continue
            if re.match(r'^ 3\.(\d+)\.(\d+)\.', line):
                new_lines.append(re.sub(r'^ 3\.(\d+)\.(\d+)\.', r' 4.\1.\2.', line))
                continue
            if re.match(r'^3\.(\d+)\.', line):
                new_lines.append(re.sub(r'^3\.(\d+)\.', r'4.\1.', line))
                continue
            if re.match(r'^3\.(\d+)\.(\d+)\.', line):
                new_lines.append(re.sub(r'^3\.(\d+)\.(\d+)\.', r'4.\1.\2.', line))
                continue
            # Update image references
            if 'Hình 3.' in line:
                new_lines.append(line.replace('Hình 3.', 'Hình 4.'))
                continue

        new_lines.append(line)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Updated {filepath} successfully.")

if __name__ == '__main__':
    update_file(r'e:\JOB\esp32\acw-srs\documents\file_do_an.md')
