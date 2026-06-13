import * as XLSX from "xlsx";

/**
 * Converts an array of objects to an Excel (.xlsx) file Buffer.
 */
export function convertToExcelBuffer<T extends Record<string, any>>(
  data: T[],
  columns: { key: string; label: string }[],
  sheetName = "Sheet1"
): Buffer {
  // Map data to use labels as object keys so sheet headers are correctly named
  const formattedData = data.map((item) => {
    const row: Record<string, any> = {};
    columns.forEach((col) => {
      const value = item[col.key];
      if (value instanceof Date) {
        row[col.label] = value.toLocaleString("vi-VN");
      } else {
        row[col.label] = value === null || value === undefined ? "" : value;
      }
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Set column widths dynamically based on content length for better design premium feel
  const maxProps = columns.map(c => c.label.length);
  formattedData.forEach((row) => {
    columns.forEach((col, i) => {
      const cellVal = String(row[col.label] || "");
      if (cellVal.length > maxProps[i]) {
        maxProps[i] = cellVal.length;
      }
    });
  });
  
  worksheet["!cols"] = maxProps.map(w => ({ wch: Math.min(w + 3, 50) })); // Pad a little bit, cap at 50 chars width

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Write to binary buffer
  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buf;
}
