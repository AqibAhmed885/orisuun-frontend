import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getAllResources } from '@/app/api/marketing/resources';
import page from '@/app/(landing)/become-a-mentor/page';

/**
 * Simple preview-only API route that returns a modest set of resources for the PDF preview page.
 * Keeps any sensitive API handling on the server side.
 * Supports filtering by resourceTypeId, cityId, stateId (regionId), and countryId
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters from query string
    const resourceTypeId = searchParams.get('resourceTypeId');
    const cityId = searchParams.get('cityId');
    const stateId = searchParams.get('stateId'); // Map stateId to regionId
    const countryId = searchParams.get('countryId');
    const recent = searchParams.get('recent'); // Recently added resources
    const deadline = searchParams.get('deadline'); // Upcoming deadlines

    // Build params object for getAllResources
    const params: any = {
      includeExpired: deadline === 'true' ? false : true, // Exclude expired for deadline view
      page: 1,
      pageSize: 1000,
    };

    if (resourceTypeId) params.resourceTypeId = parseInt(resourceTypeId);
    if (cityId) params.cityId = parseInt(cityId);
    if (stateId) params.regionId = parseInt(stateId); // stateId maps to regionId
    if (countryId) params.countryId = parseInt(countryId);

    // fetch resources with filters; server-side call so secrets are safe
    let resources = await getAllResources(params);

    // Apply client-side filtering for recent and deadline views
    if (recent === 'true') {
      // Sort by creation date (newest first) and limit to 50
      resources = resources
        .sort((a: any, b: any) => {
          const dateA = new Date(a.CreatedDate || a.UpdatedDate || 0).getTime();
          const dateB = new Date(b.CreatedDate || b.UpdatedDate || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 50);
    }

    if (deadline === 'true') {
      // Filter out past deadlines and sort by deadline (earliest first)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      resources = resources
        .filter((res: any) => {
          if (!res.ApplicationDeadline) return true;
          const deadlineDate = new Date(res.ApplicationDeadline);
          deadlineDate.setHours(0, 0, 0, 0);
          return deadlineDate >= today;
        })
        .sort((a: any, b: any) => {
          const dateA = new Date(a.ApplicationDeadline || '9999-12-31').getTime();
          const dateB = new Date(b.ApplicationDeadline || '9999-12-31').getTime();
          return dateA - dateB;
        })
        .slice(0, 50);
    }

    return NextResponse.json({ ok: true, resources });
  } catch (err) {
    console.error('preview/resources route error', err);
    return NextResponse.json({ ok: false, resources: [], error: 'Failed to fetch resources' }, { status: 500 });
  }
}
