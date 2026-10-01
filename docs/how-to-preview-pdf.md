# How to Preview PDF

## Option 1: Dedicated Preview Page (Easiest)

I've created a preview page at `/pdf-preview` that you can access directly:

### To View:
1. Start your dev server: `npm run dev`
2. Navigate to: **http://localhost:3000/pdf-preview**
3. You'll see a full-screen PDF preview with sample data

This page uses `PDFViewer` component from `@react-pdf/renderer` to show the PDF in the browser.

---

## Option 2: Inline Preview Modal (For Real Data)

I've created a `PDFPreviewModal` component that you can use in any page to preview actual resource data.

### Setup:

**1. Import the component:**
```tsx
import PDFPreviewModal from '@/components/PDFPreviewModal';
```

**2. Add state to your component:**
```tsx
const [showPreview, setShowPreview] = useState(false);
```

**3. Add the modal to your JSX:**
```tsx
<PDFPreviewModal
  isOpen={showPreview}
  onClose={() => setShowPreview(false)}
  resources={filteredResources}
  title="My Resources Export"
  startDate={startDate}
  endDate={endDate}
/>
```

**4. Add a Preview button:**
```tsx
<button
  onClick={() => setShowPreview(true)}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  Preview PDF
</button>
```

### Example in Recent Resources Tab:

```tsx
import PDFPreviewModal from '@/components/PDFPreviewModal';

export default function RecentResourceTab({ viewMode = "card" }) {
  // ... existing state
  const [showPreview, setShowPreview] = useState(false);

  // Add preview button next to download button
  return (
    <>
      {/* Existing code */}
      
      <button onClick={() => setShowPreview(true)}>
        Preview PDF
      </button>
      
      <button onClick={handleDownloadPDF}>
        Download PDF
      </button>

      {/* Add preview modal */}
      <PDFPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        resources={resources}
        title="Recently Added Resources"
      />
      
      {/* Existing modals */}
    </>
  );
}
```

---

## Option 3: Add Preview to Date Range Modal

You can add a "Preview" button alongside "Download PDF" in the `PDFDateRangeModal`:

### Modify PDFDateRangeModal:

```tsx
interface PDFDateRangeModalProps {
  // ... existing props
  onPreview?: (startDate: Date, endDate: Date) => void; // Add this
}

export default function PDFDateRangeModal({
  // ... existing props
  onPreview,
}: PDFDateRangeModalProps) {
  // ... existing code

  return (
    <div className="flex gap-3 mt-6">
      <button onClick={onClose}>Cancel</button>
      
      {/* Add Preview Button */}
      {onPreview && (
        <button
          onClick={() => onPreview(startDate, endDate)}
          className="flex-1 px-4 py-2 border-2 border-omblue-600 text-omblue-600 rounded-lg font-semibold hover:bg-omblue-50"
        >
          Preview PDF
        </button>
      )}
      
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}
```

### Then in your component:

```tsx
const [showPreview, setShowPreview] = useState(false);
const [previewDates, setPreviewDates] = useState({ start: new Date(), end: new Date() });

const handlePreview = (startDate: Date, endDate: Date) => {
  setPreviewDates({ start: startDate, end: endDate });
  setShowPreview(true);
  setShowDateModal(false); // Close date modal
};

<PDFDateRangeModal
  isOpen={showDateModal}
  onClose={() => setShowDateModal(false)}
  onDownload={handlePDFGeneration}
  onPreview={handlePreview} // Add this
  downloading={downloadingPDF}
/>

<PDFPreviewModal
  isOpen={showPreview}
  onClose={() => setShowPreview(false)}
  resources={filteredResources}
  title="Resources Export"
  startDate={previewDates.start}
  endDate={previewDates.end}
/>
```

---

## Option 4: Browser Developer Tools

You can also use the browser's built-in PDF viewer:

1. Click "Download PDF"
2. When the download completes, click on it in your browser's download bar
3. It will open in your browser's PDF viewer

---

## Quick Test Commands

```bash
# Start dev server
npm run dev

# Visit the preview page
open http://localhost:3000/pdf-preview
```

---

## Preview Features

The preview shows:
- ✅ Exact PDF layout and styling
- ✅ Page breaks and pagination
- ✅ All colors and fonts
- ✅ Background images/patterns
- ✅ Full-screen viewing
- ✅ Zoom in/out controls
- ✅ Page navigation

The preview is **identical** to the downloaded PDF, so what you see is what you get!

---

## Troubleshooting

### Preview is blank or loading forever
- Check browser console for errors
- Ensure `/pdf/pdf-bg.svg` and `/pdf/pdf-bg-content.svg` exist in the public folder
- Try refreshing the page

### Preview is slow
- Large datasets (100+ resources) may take a few seconds to render
- Consider showing a loading spinner

### Fonts look different
- `@react-pdf/renderer` uses standard fonts by default
- You can register custom fonts if needed (see react-pdf documentation)
