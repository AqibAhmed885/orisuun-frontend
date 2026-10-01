'use client';

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
// import { ResourcesPDFDocument } from '@/utils/pdfGeneratorReact';
import { X } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: any[];
  title: string;
  startDate?: Date;
  endDate?: Date;
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  resources,
  title,
  startDate,
  endDate,
}: PDFPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
      <div className="relative w-full h-full max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">PDF Preview</h2>
            <p className="text-gray-300 text-sm mt-1">
              Preview your document before downloading
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <PDFViewer width="100%" height="100%">
            {/* <ResourcesPDFDocument
              resources={resources}
              title={title}
              startDate={startDate}
              endDate={endDate}
            /> */}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
