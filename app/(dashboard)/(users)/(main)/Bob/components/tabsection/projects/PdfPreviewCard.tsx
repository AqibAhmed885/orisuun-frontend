'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ensurePdfJsPromiseCompat } from './pdfViewerCompat';
import { buildPdfProxyUrl } from './pdfUrlUtils';

type ReactPdfModule = typeof import('react-pdf');

const PdfPreviewCard = ({ pdfUrl }: { pdfUrl: string }) => {
  const [pdfModule, setPdfModule] = useState<ReactPdfModule | null>(null);
  const [viewerLoadError, setViewerLoadError] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const previewPdfUrl = buildPdfProxyUrl(pdfUrl);
  const [activePdfUrl, setActivePdfUrl] = useState(previewPdfUrl || pdfUrl);
  const [triedDirectFallback, setTriedDirectFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPdfViewer = async () => {
      try {
        ensurePdfJsPromiseCompat();
        const mod = await import('react-pdf');
        mod.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        if (!cancelled) {
          setPdfModule(mod);
          setViewerLoadError(false);
        }
      } catch (error) {
        console.error('Failed to load react-pdf module:', error);
        if (!cancelled) {
          setViewerLoadError(true);
        }
      }
    };

    loadPdfViewer();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setActivePdfUrl(previewPdfUrl || pdfUrl);
    setTriedDirectFallback(false);
    setPageNumber(1);
    setNumPages(0);
    setZoom(100);
    setErrorMessage(null);
  }, [pdfUrl, previewPdfUrl]);

  const onDocumentLoadSuccess = ({ numPages: loadedPages }: { numPages: number }) => {
    setNumPages(loadedPages);
    setPageNumber(1);
    setErrorMessage(null);
  };

  const handleDocumentError = (error: Error, source: 'load' | 'source') => {
    console.error(`PDF ${source} error:`, error);

    const canFallbackToDirect = Boolean(pdfUrl && previewPdfUrl && previewPdfUrl !== pdfUrl);
    if (canFallbackToDirect && !triedDirectFallback) {
      setTriedDirectFallback(true);
      setActivePdfUrl(pdfUrl);
      setErrorMessage(null);
      return;
    }

    setErrorMessage('Unable to load PDF preview.');
  };

  const onDocumentLoadError = (error: Error) => {
    handleDocumentError(error, 'load');
  };

  const onDocumentSourceError = (error: Error) => {
    handleDocumentError(error, 'source');
  };

  const goPrev = () => {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goNext = () => {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  };

  const hasDocument = numPages > 0;
  const pageWidth = Math.round(230 * (zoom / 100));
  const Document = pdfModule?.Document;
  const Page = pdfModule?.Page;

  const handlePageInput = (value: string) => {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= (numPages || 1)) {
      setPageNumber(parsed);
    }
  };

  const decreaseZoom = () => {
    setZoom((prev) => Math.max(50, prev - 10));
  };

  const increaseZoom = () => {
    setZoom((prev) => Math.min(200, prev + 10));
  };

  const printPdf = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-md bg-[#F2F4F7] ">
      <div className="overflow-hidden ">
        <div className="flex flex-wrap items-center max-w-[400px] mx-auto rounded-sm justify-between gap-3 shadow-sm shadow-[#D0D5DD] bg-[#F9FAFB] px-4 py-1 text-xs text-[#344054]">
          <span className="text-[7px] font-medium leading-none text-[#1F2937]">Memo</span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => handlePageInput(e.target.value)}
                className=" w-3 h-3 rounded-[2px] border border-[#D0D5DD] bg-[#F2F4F7] text-center text-[7px] font-semibold text-[#1F2937]"
              />
              <span className="text-[7px] font-semibold text-[#1F2937]">/</span>
              <span className="text-[7px] font-semibold text-[#1F2937]">{numPages || 1}</span>
            </div>

            <span className="h-2 w-px bg-[#D0D5DD]" />

            <button
              type="button"
              onClick={decreaseZoom}
              className="text-[12px] font-medium text-[#344054] disabled:text-[#98A2B3]"
              disabled={!hasDocument}
            >
              -
            </button>
            <div className="rounded-sm bg-[#E4E7EC] px-1.5  text-[7px] font-semibold text-[#344054]">{zoom}%</div>
            <button
              type="button"
              onClick={increaseZoom}
              className="text-[12px] font-medium text-[#344054] disabled:text-[#98A2B3]"
              disabled={!hasDocument}
            >
              +
            </button>

            <span className="h-2 w-px bg-[#D0D5DD]" />

            <button
              type="button"
              onClick={goPrev}
              className="rounded p-1 text-[#344054] hover:bg-[#E4E7EC] disabled:text-[#98A2B3]"
              disabled={!hasDocument || pageNumber <= 1}
              aria-label="Previous page"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.22276 1.52546C1.05393 1.52546 0.917062 1.66233 0.917062 1.83116V5.49955C0.917062 5.66838 1.05393 5.80524 1.22276 5.80524H6.11394C6.28278 5.80524 6.41964 5.66838 6.41964 5.49955V1.83116C6.41964 1.66233 6.28278 1.52546 6.11394 1.52546H1.22276ZM0.305664 1.83116C0.305664 1.32466 0.716262 0.914062 1.22276 0.914062H6.11394C6.62044 0.914062 7.03104 1.32466 7.03104 1.83116V5.49955C7.03104 6.00604 6.62044 6.41664 6.11394 6.41664H1.22276C0.716262 6.41664 0.305664 6.00604 0.305664 5.49955V1.83116Z" fill="#344054" />
                <path d="M2.87236 2.55452C2.71303 2.75481 2.85566 3.05052 3.1116 3.05052H4.22515C4.48108 3.05052 4.62371 2.75481 4.46439 2.55452L3.90761 1.85457C3.78522 1.70071 3.55152 1.70071 3.42913 1.85457L2.87236 2.55452Z" fill="#344054" />
                <path d="M4.46435 4.80111C4.62367 4.60082 4.48104 4.30511 4.2251 4.30511H3.11156C2.85562 4.30511 2.71299 4.60082 2.87232 4.80111L3.42909 5.50106C3.55148 5.65492 3.78518 5.65492 3.90757 5.50106L4.46435 4.80111Z" fill="#344054" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded p-1 text-[#344054] hover:bg-[#E4E7EC] disabled:text-[#98A2B3]"
              disabled={!hasDocument || pageNumber >= numPages}
              aria-label="Next page"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.97401 6.72725C3.7855 6.72725 3.60075 6.7081 3.41978 6.66978C3.23881 6.63147 3.06181 6.57675 2.88878 6.50562C2.78179 6.45977 2.72197 6.38334 2.70934 6.27635C2.6967 6.16935 2.73359 6.07255 2.82 5.98594C2.85566 5.95027 2.90152 5.92734 2.95756 5.91715C3.01361 5.90696 3.0671 5.9146 3.11805 5.94008C3.25052 6.00122 3.38941 6.04585 3.53472 6.07398C3.68003 6.1021 3.82646 6.11606 3.97401 6.11586C4.57012 6.11586 5.07585 5.90819 5.49119 5.49284C5.90654 5.0775 6.11411 4.57187 6.1139 3.97596C6.1139 3.37985 5.90623 2.87412 5.49089 2.45878C5.07555 2.04344 4.56992 1.83587 3.97401 1.83607H3.92816L4.19564 2.10356C4.25169 2.1596 4.27971 2.23093 4.27971 2.31755C4.27971 2.40416 4.25169 2.47549 4.19564 2.53154C4.1345 2.59268 4.06063 2.62325 3.97401 2.62325C3.8874 2.62325 3.81607 2.59268 3.76002 2.53154L2.9652 1.74436C2.93973 1.71379 2.91935 1.68068 2.90407 1.64501C2.88878 1.60935 2.88114 1.57113 2.88114 1.53037C2.88114 1.48961 2.88878 1.45008 2.90407 1.41176C2.91935 1.37345 2.93973 1.34166 2.9652 1.31638L3.76002 0.521567C3.81607 0.465522 3.8874 0.4375 3.97401 0.4375C4.06063 0.4375 4.1345 0.465522 4.19564 0.521567C4.25169 0.582707 4.27971 0.656584 4.27971 0.743199C4.27971 0.829814 4.25169 0.901143 4.19564 0.957188L3.92816 1.22467H3.97401C4.35613 1.22467 4.71411 1.29733 5.04793 1.44264C5.38175 1.58795 5.67217 1.7841 5.91917 2.03111C6.16618 2.27811 6.36233 2.56853 6.50764 2.90235C6.65295 3.23617 6.72551 3.59404 6.7253 3.97596C6.7253 4.74021 6.45781 5.38982 5.92284 5.9248C5.38787 6.45977 4.73826 6.72725 3.97401 6.72725ZM2.13982 5.68024C2.09906 5.68024 2.06085 5.67382 2.02518 5.66098C1.98952 5.64814 1.9564 5.62653 1.92583 5.59617L0.519614 4.18995C0.489044 4.15938 0.467441 4.12627 0.454806 4.0906C0.44217 4.05494 0.435751 4.01672 0.435547 3.97596C0.435547 3.9352 0.441967 3.89699 0.454806 3.86133C0.467645 3.82566 0.489248 3.79255 0.519614 3.76198L1.92583 2.35576C1.9564 2.32519 1.98952 2.30349 2.02518 2.29065C2.06085 2.27781 2.09906 2.27149 2.13982 2.27169C2.18058 2.27169 2.21879 2.27811 2.25446 2.29095C2.29012 2.30379 2.32324 2.32539 2.35381 2.35576L3.76002 3.76198C3.79059 3.79255 3.8123 3.82566 3.82514 3.86133C3.83798 3.89699 3.84429 3.9352 3.84409 3.97596C3.84409 4.01672 3.83777 4.05494 3.82514 4.0906C3.8125 4.12627 3.7908 4.15938 3.76002 4.18995L2.35381 5.59617C2.32324 5.62674 2.29012 5.64844 2.25446 5.66128C2.21879 5.67412 2.18058 5.68044 2.13982 5.68024ZM2.13982 4.93892L3.10277 3.97596L2.13982 3.01301L1.17687 3.97596L2.13982 4.93892Z" fill="#344054" />
              </svg>
            </button>

            <span className="h-2 w-px bg-[#D0D5DD]" />

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-1 text-[#344054] hover:bg-[#E4E7EC]"
              aria-label="Download PDF"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.07137 2.74826H4.58531V1.21976C4.58531 1.05163 4.44774 0.914062 4.27961 0.914062H3.05681C2.88868 0.914062 2.75112 1.05163 2.75112 1.21976V2.74826H2.26505C1.99298 2.74826 1.85542 3.07841 2.04801 3.271L3.45117 4.67416C3.57039 4.79338 3.76298 4.79338 3.8822 4.67416L5.28536 3.271C5.47795 3.07841 5.34344 2.74826 5.07137 2.74826ZM1.52832 5.80524C1.52832 5.97338 1.66588 6.11094 1.83402 6.11094H5.50241C5.67054 6.11094 5.8081 5.97338 5.8081 5.80524C5.8081 5.63711 5.67054 5.49955 5.50241 5.49955H1.83402C1.66588 5.49955 1.52832 5.63711 1.52832 5.80524Z" fill="#344054" />
              </svg>
            </a>
            <button
              type="button"
              onClick={printPdf}
              className="rounded p-1 text-[#344054] hover:bg-[#E4E7EC]"
              aria-label="Print PDF"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.80821 2.44256H1.52842C1.02096 2.44256 0.611328 2.85219 0.611328 3.35965V4.58245C0.611328 4.91872 0.886457 5.19385 1.22273 5.19385H1.83412V5.80524C1.83412 6.14151 2.10925 6.41664 2.44552 6.41664H4.89111C5.22738 6.41664 5.50251 6.14151 5.50251 5.80524V5.19385H6.11391C6.45018 5.19385 6.72531 4.91872 6.72531 4.58245V3.35965C6.72531 2.85219 6.31567 2.44256 5.80821 2.44256ZM4.58541 5.80524H2.75122C2.58309 5.80524 2.44552 5.66768 2.44552 5.49955V4.27675H4.89111V5.49955C4.89111 5.66768 4.75355 5.80524 4.58541 5.80524ZM5.80821 3.66535C5.64007 3.66535 5.50251 3.52779 5.50251 3.35965C5.50251 3.19152 5.64007 3.05395 5.80821 3.05395C5.97634 3.05395 6.11391 3.19152 6.11391 3.35965C6.11391 3.52779 5.97634 3.66535 5.80821 3.66535ZM5.19681 0.914062H2.13982C1.97169 0.914062 1.83412 1.05163 1.83412 1.21976V1.83116C1.83412 1.99929 1.97169 2.13686 2.13982 2.13686H5.19681C5.36495 2.13686 5.50251 1.99929 5.50251 1.83116V1.21976C5.50251 1.05163 5.36495 0.914062 5.19681 0.914062Z" fill="#344054" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="rounded p-1 text-[#EF4444] hover:bg-[#FEE2E2]"
              aria-label="Close"
            >
              <X className="h-[7px] w-[7px]" strokeWidth={2.8} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center ">
          {viewerLoadError ? (
            <div className="text-xs p-4 text-[#B42318]">
              Unable to initialize PDF viewer.{' '}
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Open PDF
              </a>
            </div>
          ) : errorMessage ? (
            <div className="text-xs p-4 text-[#B42318]">
              {errorMessage}{' '}
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Open PDF
              </a>
            </div>
          ) : !Document || !Page ? (
            <div className="text-xs text-[#475467]">Preparing PDF viewer...</div>
          ) : (
            <Document
              file={activePdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              onSourceError={onDocumentSourceError}
              loading={<div className="text-xs text-[#475467]">Loading PDF preview...</div>}
              error={<div className="text-xs text-[#B42318]">Unable to load PDF preview.</div>}
              noData={<div className="text-xs text-[#475467]">No PDF selected.</div>}
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div className="text-xs text-[#475467]">Rendering page...</div>}
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewCard;
