export const pluralizeResourceTypeName = (name?: string | null): string => {
  if (!name) return '';
  const trimmed = name.trim();

  const map: Record<string, string> = {
    'Accelerator': 'Accelerators',
    'Competition': 'Competitions',
    'Government Program': 'Government Programs',
    'Grant': 'Grants',
    'NGO Program': 'NGO Programs',
    // Keep Non-traditional or Specialty Financing as-is per spec
    'Non-traditional or Specialty Financing': 'Non-traditional or Specialty Financing',
    'School Program': 'School Programs',
    'School Programs': 'School Programs',
    // Also accept already-plural forms to return as-is
    'Accelerators': 'Accelerators',
    'Competitions': 'Competitions',
    'Government Programs': 'Government Programs',
    'Grants': 'Grants',
    'NGO Programs': 'NGO Programs',
  };

  // If we have a direct mapping, return it
  if (map[trimmed]) return map[trimmed];

  // If it already looks plural (ends with 's'), return as-is
  if (trimmed.endsWith('s')) return trimmed;

  // Otherwise, return the original name (fallback)
  return trimmed;
};
