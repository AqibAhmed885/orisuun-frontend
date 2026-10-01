# PDF Generator Usage Guide

## Using @react-pdf/renderer (Recommended for React)

### Installation
```bash
npm i @react-pdf/renderer
```

### Import
```tsx
import { downloadResourcesPDF } from "@/utils/pdfGeneratorReact";
```

### Usage (Same as before - no changes needed!)
```tsx
const handlePDFGeneration = async (startDate: Date, endDate: Date) => {
  setDownloadingPDF(true);
  try {
    const filename = `Resources-${new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }).replace(/,/g, '').replace(/\s+/g, '-')}.pdf`;
    
    const title = 'Resources Export';
    
    await downloadResourcesPDF(filteredResources, filename, title, startDate, endDate);
    
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error('PDF download failed:', error);
    toast.error('Failed to download PDF. Please try again.');
  } finally {
    setDownloadingPDF(false);
  }
};
```

## Key Advantages of @react-pdf/renderer

1. **React Components**: Write PDF layout using React components
2. **Better Styling**: CSS-like styling with StyleSheet
3. **Automatic Pagination**: Smart page breaks
4. **Better Performance**: More efficient for complex documents
5. **Type Safety**: Full TypeScript support

## Features Implemented

### Cover Page (Dark Background #0A193A)
- Title in white
- Date range in light gray
- Total resource count
- Footer with generation date

### Resource Pages
- Clean white background
- Color-coded information:
  - Blue: Resource type
  - Green: Amount/funding
  - Orange: Deadline
  - Purple: Black-focused indicator
- Auto-pagination with proper wrapping
- Footer on each page

## Customization

### Change Colors
Edit `styles` object in `/utils/pdfGeneratorReact.tsx`:
```tsx
const styles = StyleSheet.create({
  coverPage: {
    backgroundColor: '#0A193A', // Your custom color
  },
  // ... other styles
});
```

### Add Background Pattern
```tsx
<Page size="A4" style={styles.coverPage}>
  <Image 
    src="/pdf/pdf-bg.svg" 
    style={styles.backgroundPattern}
  />
  {/* Rest of content */}
</Page>
```

### Modify Layout
The PDF is generated from React components, so you can easily:
- Add/remove sections
- Change typography
- Adjust spacing
- Add images/logos
- Create multi-column layouts

## Migration from jsPDF

To switch to react-pdf in your components, simply change the import:

**Old (jsPDF):**
```tsx
import { downloadResourcesPDF } from "@/utils/pdfGenerator";
```

**New (react-pdf):**
```tsx
import { downloadResourcesPDF } from "@/utils/pdfGeneratorReact";
```

The function signature is identical, so no other code changes needed!

## Preview PDF (Optional)

You can preview the PDF in browser before downloading:

```tsx
import { PDFViewer } from '@react-pdf/renderer';
import { ResourcesPDFDocument } from '@/utils/pdfGeneratorReact';

function PDFPreview() {
  return (
    <PDFViewer width="100%" height="600px">
      <ResourcesPDFDocument 
        resources={resources}
        title="My Resources"
        startDate={startDate}
        endDate={endDate}
      />
    </PDFViewer>
  );
}
```

## Server-Side Generation (Next.js API Route)

```tsx
// app/api/generate-pdf/route.ts
import { renderToStream } from '@react-pdf/renderer';
import { ResourcesPDFDocument } from '@/utils/pdfGeneratorReact';

export async function POST(request: Request) {
  const { resources, title, startDate, endDate } = await request.json();
  
  const stream = await renderToStream(
    <ResourcesPDFDocument 
      resources={resources}
      title={title}
      startDate={startDate}
      endDate={endDate}
    />
  );
  
  return new Response(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resources.pdf"',
    },
  });
}
```
