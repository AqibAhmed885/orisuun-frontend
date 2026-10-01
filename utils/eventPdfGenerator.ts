import { PDFGenerateOptions } from '../app/(marketing)/calendar/components/PDFTimeframeSelector';

/**
 * Generate PDF URL with filter parameters
 */
export const generateEventsPDFUrl = (options: PDFGenerateOptions): string => {
  const params = new URLSearchParams();

  // Add filter parameters
  if (options.city) {
    params.append('city', options.city);
  }
  if (options.eventType) {
    params.append('eventType', options.eventType);
  }
  if (options.country) {
    params.append('country', options.country);
  }

  // Add timeframe parameters
  if (options.timeframeType === 'all-future') {
    params.append('allFuture', 'true');
  } else if (options.timeframeType === 'date-range' && options.startDate && options.endDate) {
    params.append('startDate', options.startDate.toISOString());
    params.append('endDate', options.endDate.toISOString());
  } else if (options.timeframeType === 'selected-dates' && options.dates && options.dates.length > 0) {
    const datesString = options.dates.map(d => d.toISOString()).join(',');
    params.append('dates', datesString);
  }

  return `/event-pdf?${params.toString()}`;
};

/**
 * Download events PDF by opening in new window
 */
export const downloadEventsPDFWithFilters = async (options: PDFGenerateOptions): Promise<void> => {
  try {
    const url = generateEventsPDFUrl(options);
    
    // Open PDF page in new window
    const pdfWindow = window.open(url, '_blank');
    
    if (!pdfWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // Wait for PDF to load then trigger print dialog
    pdfWindow.onload = () => {
      setTimeout(() => {
        pdfWindow.print();
      }, 1000);
    };
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
};

/**
 * Legacy function for backward compatibility - single date PDF
 */
export const downloadEventsPdfLegacy = async (selectedDate: Date): Promise<Blob> => {
  const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

  const headers = {
    'XApiKey': apiKey,
    'Content-Type': 'application/json',
    'Accept': '*/*',
  };

  const response = await fetch(
    `${apiEndpoint}/event/GetEventPdf?date=${encodeURIComponent(selectedDate.toISOString())}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to download PDF');
  }

  return response.blob();
};

/**
 * Generate filename based on filters
 */
export const generatePDFFilename = (options: PDFGenerateOptions): string => {
  const parts: string[] = ['Events'];

  if (options.city) {
    parts.push(options.city.replace(/\s+/g, '-'));
  }
  if (options.eventType) {
    parts.push(options.eventType.replace(/\s+/g, '-'));
  }
  if (options.country) {
    parts.push(options.country.replace(/\s+/g, '-'));
  }

  if (options.timeframeType === 'all-future') {
    parts.push('All-Future');
  } else if (options.timeframeType === 'date-range' && options.startDate && options.endDate) {
    const start = options.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = options.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    parts.push(`${start.replace(/\s+/g, '-')}-to-${end.replace(/\s+/g, '-')}`);
  } else if (options.timeframeType === 'selected-dates' && options.dates) {
    if (options.dates.length === 1) {
      const dateStr = options.dates[0].toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      parts.push(dateStr.replace(/\s+/g, '-'));
    } else {
      parts.push(`${options.dates.length}-Dates`);
    }
  }

  return parts.join('_') + '.pdf';
};
