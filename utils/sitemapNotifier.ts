/**
 * Client-side utilities for notifying search engines about content updates
 * Use these functions in your admin panel or after form submissions
 */

/**
 * Notify search engines about new or updated content
 * @param type - Type of content updated: 'event', 'resource', or 'all'
 */
export async function notifySearchEngines(type: 'event' | 'resource' | 'all' = 'all'): Promise<boolean> {
    try {
        const response = await fetch('/api/sitemap/ping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type }),
        });

        const result = await response.json();

        if (result.success) {
            return true;
        } else {
            console.error('❌ Failed to notify search engines:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Error notifying search engines:', error);
        return false;
    }
}

/**
 * Example: Call this after successfully submitting an event
 */
export async function onEventSubmitted() {
    await notifySearchEngines('event');
}

/**
 * Example: Call this after successfully submitting a resource
 */
export async function onResourceSubmitted() {
    await notifySearchEngines('resource');
}

/**
 * Example: Call this after bulk operations
 */
export async function onBulkUpdate() {
    await notifySearchEngines('all');
}
