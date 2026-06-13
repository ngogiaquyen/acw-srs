/**
 * Converts an array of objects to a CSV string.
 * Prepends a UTF-8 BOM (\uFEFF) so Excel opens it with correct encoding (UTF-8).
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  columns: { key: string; label: string }[]
): string {
  const headerRow = columns
    .map((col) => `"${String(col.label).replace(/"/g, '""')}"`)
    .join(",");

  const dataRows = data.map((item) => {
    return columns
      .map((col) => {
        // Resolve nested keys if needed (e.g. "device.name"), but a simple key lookup is usually enough.
        const value = item[col.key];
        
        let strValue = "";
        if (value instanceof Date) {
          strValue = value.toLocaleString("vi-VN");
        } else if (value !== null && value !== undefined) {
          strValue = String(value);
        }
        
        return `"${strValue.replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  return "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
}
