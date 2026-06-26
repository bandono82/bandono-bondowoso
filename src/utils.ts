export function exportToWord(
  title: string,
  htmlContent: string,
  options?: {
    paperSize?: "A4" | "F4";
    lineSpasi?: string;
    fontName?: string;
    isJustified?: boolean;
  }
) {
  const paperSize = options?.paperSize || "A4";
  const lineSpasi = options?.lineSpasi || "1.15";
  const fontName = options?.fontName || "Arial";
  const isJustified = options?.isJustified !== false;

  const sizeStyle = paperSize === "F4" ? "8.5in 13.0in" : "8.27in 11.69in"; // A4 is 8.27in 11.69in

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>${title}</title>
      <style>
        @page Section1 {
          size: ${sizeStyle};
          margin: 1.0in 1.0in 1.0in 1.0in;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: '${fontName}', sans-serif;
          font-size: 11.0pt;
          line-height: ${lineSpasi};
          text-align: ${isJustified ? "justify" : "left"};
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
        }
        table, th, td {
          border: 1px solid #333333;
        }
        th, td {
          padding: 8px;
          text-align: ${isJustified ? "justify" : "left"};
          vertical-align: top;
        }
        th {
          background-color: #f3f4f6;
          font-weight: bold;
        }
        .signature-table {
          border: none !important;
          margin-top: 40px;
        }
        .signature-table td {
          border: none !important;
          padding: 10px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${htmlContent}
      </div>
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff' + header], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
