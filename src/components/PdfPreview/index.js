import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const url = 'https://img.dreamstep.top/community/136/37779553_1717313888777.pdf';

function PdfPreview() {
  const [ numPages, setNumPages ] = useState(null);
  const [ pageNumber, setPageNumber ] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{
          cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true
        }}
      >
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
