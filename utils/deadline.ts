/**
 * Deadline formatting utilities for different deadline types
 */

export type DeadlineType = 'Standard' | 'Rolling' | 'TBD' | 'MonthYear';

/**
 * Format a deadline date based on its type
 * @param dateString - The deadline date string or null
 * @param deadlineType - The type of deadline ('Standard', 'Rolling', 'TBD', 'MonthYear')
 * @returns Formatted deadline string
 */
export function formatDeadline(
  dateString: string | null | undefined,
  deadlineType?: string | null
): string {
  if (!dateString) return 'N/A';
  
  const type = deadlineType || 'Standard';
  
  switch (type) {
    case 'Rolling':
      return 'Ongoing/Rolling';
    
    case 'TBD':
      return 'TBD';
    
    case 'MonthYear':
      try {
        // Parse YYYY-MM format or full ISO date
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
      } catch {
        return dateString;
      }
    
    case 'Standard':
    default:
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateString;
      }
  }
}

/**
 * Get a badge color/style based on deadline type
 * @param deadlineType - The type of deadline
 * @returns CSS class names for styling
 */
export function getDeadlineTypeStyle(deadlineType?: string | null): string {
  switch (deadlineType) {
    case 'Rolling':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'TBD':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'MonthYear':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Standard':
    default:
      return 'bg-omblue-50 text-omblue-700 border-omblue-200';
  }
}

/**
 * Check if a deadline date is approaching (within 30 days)
 * @param dateString - The deadline date string
 * @param deadlineType - The type of deadline
 * @returns True if deadline is within 30 days
 */
export function isDeadlineApproaching(
  dateString: string | null | undefined,
  deadlineType?: string | null
): boolean {
  if (!dateString || deadlineType === 'Rolling' || deadlineType === 'TBD') {
    return false;
  }
  
  try {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  } catch {
    return false;
  }
}
