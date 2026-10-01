import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { pluralizeResourceTypeName } from '@/utils/resourceType';

interface Resource {
  Name: string;
  Sponsor: string;
  CityName?: string;
  CountryName?: string;
  StateName?: string;
  Address?: string;
  ApplicationDeadline?: string;
  DeadlineType?: string;
  Description?: string;
  Eligibility?: string;
  ResourceTypeName: string;
  GrantDetails?: {
    GrantAmount: number;
    GrantCurrency?: string;
  };
  CompetitionDetails?: {
    PrizeAmount: number;
    PrizeCurrency?: string;
    CompetitionDate?: string;
  };
  AcceleratorDetails?: {
    InvestmentAmount: number;
    InvestmentCurrency?: string;
  };
  isBlackFocused?: boolean;
  IsLocationVirtual?: boolean;
  IsNationWide?: boolean;
  IsStateWide?: boolean;
  ResourceFrequency?: string;
  CreatedDate?: string;
  IsBlackFocused?: boolean | string;
}

interface GeneratePDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

/**
 * Generate PDF from HTML element using html2canvas and jsPDF
 * @param elementId - ID of the HTML element to convert to PDF
 * @param options - PDF generation options
 */
export async function generatePDFFromHTML(
  elementId: string,
  options: GeneratePDFOptions = {}
): Promise<jsPDF> {
  const { quality = 0.95, scale = 2 } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // Show loading state
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Reset display
    element.style.display = originalDisplay;

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Calculate image dimensions
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    const imgData = canvas.toDataURL('image/jpeg', quality);
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

export const generateResourcesPDF = async (
  resources: Resource[],
  title: string,
  startDate?: Date,
  endDate?: Date
): Promise<jsPDF> => {
  // Import ResourcesPDFTemplate dynamically
  const { ResourcesPDFTemplate } = await import('@/components/pdf/ResourcesPDFTemplate');
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');

  // Validate resources
  if (!resources || resources.length === 0) {
    throw new Error('No resources provided for PDF generation');
  }

  // Create a temporary container
  const container = document.createElement('div');
  container.id = 'pdf-temp-container';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '595px'; // A4 width in pixels
  container.style.overflow = 'visible';
  container.style.fontFamily = 'Neue Haas Grotesk Display Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
  document.body.appendChild(container);

  // Copy all stylesheets to ensure CSS is available for html2canvas
  const styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
  styleSheets.forEach((sheet) => {
    const clonedSheet = sheet.cloneNode(true);
    container.appendChild(clonedSheet);
  });

  try {
    // Render component into container
    const root = createRoot(container);
    // Ensure title uses pluralized resource type headings where applicable
    const normalizedTitle = pluralizeResourceTypeName(title);
    const component = React.createElement(ResourcesPDFTemplate, {
      resources,
      title: normalizedTitle,
      startDate,
      endDate,
    });

    // Render and wait for completion
    await new Promise<void>((resolve, reject) => {
      try {
        root.render(component);
        // Wait for render to complete, fonts to load, and images to render
        // Increased timeout to ensure all content is fully loaded
        setTimeout(resolve, 3000);
      } catch (error) {
        reject(error);
      }
    });

    // Get the rendered PDF content
    const pdfContent = document.getElementById('pdf-content');
    if (!pdfContent) {
      throw new Error('PDF content element not found. Make sure ResourcesPDFTemplate renders an element with id="pdf-content"');
    }

    // Find all page divs (each page is 842px height)
    const pages = pdfContent.querySelectorAll('[style*="height: 842px"]');

    if (pages.length === 0) {
      throw new Error('No pages found in PDF content. Check if ResourcesPDFTemplate is rendering pages correctly.');
    }

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [595, 842], // A4 size in pixels at 72 DPI
      compress: true,
    });

    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;

      // Capture the page as canvas with high quality
      const canvas = await html2canvas(page, {
        scale: 4, // Optimal scale for crisp SVG rendering
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Ensure all elements are visible in cloned document
          const clonedElement = clonedDoc.getElementById('pdf-content');
          if (clonedElement) {
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
          }
        },
      });

      // Convert canvas to image (using PNG for lossless quality with SVGs)
      const imgData = canvas.toDataURL('image/png');

      // Add new page if not the first page
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF (fit to page exactly)
      pdf.addImage(imgData, 'PNG', 0, 0, 595, 842, undefined, 'SLOW');
    }

    // Cleanup
    root.unmount();
    container.remove();

    return pdf;
  } catch (error) {
    // Cleanup on error
    if (container.parentNode) {
      container.remove();
    }
    console.error('Error generating resources PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const downloadResourcesPDF = async (
  resources: Resource[],
  filename: string,
  title: string,
  startDate?: Date,
  endDate?: Date
): Promise<void> => {
  try {
    const doc = await generateResourcesPDF(resources, title, startDate, endDate);
    doc.save(filename);
  } catch (error) {
    console.error('Error downloading resources PDF:', error);
    throw new Error('Failed to download PDF');
  }
};

/**
 * Download PDF directly from API endpoint
 * @param pdfFileName - Name to use for the PDF file
 * @param resourceTypeId - Resource type ID (1 = Competitions, 2 = Accelerators, etc.)
 * @param cityId - Optional city ID
 * @param countryId - Optional country ID
 * @param stateId - Optional state ID
 * @param isBlackFocused - Optional filter for Black-focused resources
 * @param isRecent - Optional flag for recently added resources
 * @param isDeadline - Optional flag for upcoming deadlines
 */
export const downloadResourcesPDFFromAPI = async (
  pdfFileName: string,
  resourceTypeId?: number,
  cityId?: string,
  countryId?: string,
  stateId?: string,
  isBlackFocused?: boolean,
  isRecent?: boolean,
  isDeadline?: boolean
): Promise<void> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('PdfFileName', pdfFileName);

    if (resourceTypeId) {
      params.append('resourceTypeId', resourceTypeId.toString());
    }
    if (cityId) {
      params.append('cityId', cityId);
    }
    if (countryId) {
      params.append('countryId', countryId);
    }
    if (stateId) {
      params.append('stateId', stateId);
    }
    if (isBlackFocused) {
      params.append('isBlackFocused', 'true');
    }
    if (isRecent) {
      params.append('recent', 'true');
    }
    if (isDeadline) {
      params.append('deadline', 'true');
    }

    // Debug: show final URL for easier troubleshooting
    const finalUrl = `https://api.orisuun.com/api/Resources/GetResourcePdf?${params.toString()}`;
    console.debug('[downloadResourcesPDFFromAPI] finalUrl=', finalUrl);

    // Make API request
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        accept: '*/*',
        XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`);
    }

    // Get the blob from response
    const blob = await response.blob();

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdfFileName}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error('Error downloading PDF from API:', error);
    throw new Error('Failed to download PDF from server');
  }
};
