// components/StructuredDataInjector.tsx
export default function StructuredDataInjector({ structuredData }: { structuredData: any }) {
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}