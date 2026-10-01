# Resources PDF Generation

This directory contains the components and utilities for generating PDF documents from resources data.

## Components

### ResourcesPDFTemplate.tsx

A React component that renders resources in a paginated PDF-friendly layout.

**Features:**
- Title page with branding
- Header page with date range
- Dynamic pagination (6 resources per page)
- Rotated date footer on all resource pages
- Consistent styling across all pages

**Props:**
```typescript
interface ResourcesPDFTemplateProps {
  resources: Resource[];
  title: string;
  startDate?: Date;
  endDate?: Date;
}
```

## Usage

### From the Resources Page

The PDF download functionality is integrated into the resources page through the `ResourceGridSection` component:

1. Click the download button
2. Select date range in the modal
3. PDF is generated and downloaded automatically

### Programmatic Usage

```typescript
import { downloadResourcesPDF } from '@/utils/pdfGenerator';

// Generate and download PDF
await downloadResourcesPDF(
  resources,          // Array of resources
  'My Resources.pdf', // Filename
  'My Resources',     // PDF title
  startDate,          // Optional: filter start date
  endDate             // Optional: filter end date
);
```

## How It Works

1. **Rendering**: The `ResourcesPDFTemplate` component is rendered into a temporary off-screen container
2. **Page Detection**: All page divs (842px height) are detected
3. **Canvas Conversion**: Each page is converted to a canvas using `html2canvas`
4. **PDF Generation**: Canvas images are added to a jsPDF document
5. **Download**: The PDF is saved with the specified filename

## Technical Details

### Page Dimensions
- Width: 595px (A4 width at 72 DPI)
- Height: 842px (A4 height at 72 DPI)
- Format: A4 portrait

### Quality Settings
- Canvas scale: 2x (for high DPI displays)
- Image format: JPEG at 95% quality
- Compression: Enabled

### Timing
- Render wait time: 3 seconds (allows fonts and images to load)
- Process time: ~1-2 seconds per page

## Troubleshooting

### PDF is blank or missing content
- Ensure all resources have required fields (Name, Sponsor, ResourceTypeName)
- Check browser console for errors
- Increase render wait time in `pdfGenerator.ts` if needed

### Fonts don't render correctly
- Make sure fonts are loaded before PDF generation
- The component waits 3 seconds to allow font loading
- Check that font files are accessible via CORS

### Rotated footer is cut off
- Verify the page height is exactly 842px
- Check that the footer positioning uses `absolute inset-x-6 bottom-32`
- Ensure no overflow: hidden on parent elements

### Images don't appear
- Enable CORS for image sources
- Set `useCORS: true` in html2canvas options
- Use `allowTaint: true` if necessary (note: may have security implications)

### PDF generation is slow
- Reduce canvas scale from 2 to 1.5 for faster generation
- Reduce JPEG quality from 0.95 to 0.85
- Consider pagination (show first N resources only)

## File Structure

```
components/pdf/
├── ResourcesPDFTemplate.tsx  # Main PDF template component
└── README.md                 # This file

utils/
└── pdfGenerator.ts           # PDF generation utilities

app/(marketing)/resources/components/
├── PDFDateRangeModal.tsx     # Date range selection modal
└── ResourceGridSection.tsx   # Resources grid with PDF download
```

## Dependencies

- `html2canvas` (^1.4.1): HTML to canvas conversion
- `jspdf` (^3.0.4): PDF generation
- `react-feather`: Icons

## Known Limitations

1. Large resource lists (>100 items) may take 30+ seconds to generate
2. Some CSS features may not render perfectly in canvas (gradients, filters)
3. Background images must be CORS-enabled
4. Generated PDF file size increases with number of pages (~200KB per page)

## Future Improvements

- [ ] Add progress indicator for multi-page PDFs
- [ ] Implement streaming/chunked PDF generation for large datasets
- [ ] Add PDF preview before download
- [ ] Support custom page sizes and orientations
- [ ] Add watermarks or headers/footers
- [ ] Optimize file size with better compression
