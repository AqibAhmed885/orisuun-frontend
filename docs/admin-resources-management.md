# Resources Management Admin Guide

## Overview
The Resources Management system allows superadmins to manage all resource entries (competitions, accelerators, grants, etc.) with full control over editing, pausing, deleting, and reviewing expired or update-requested resources.

## Access
Navigate to: `/resources-management` (Admin only)

## Main Features

### 1. Active Resources View
- **Purpose**: Manage all currently active resources
- **Features**:
  - Search by resource name, sponsor, or country
  - Filter by resource type (Competition, Accelerator, Grant, etc.)
  - Filter by country
  - Sort by name, sponsor, type, country, deadline, or creation date
  - Actions: Edit, Pause/Resume, Delete

### 2. Expired Resources Queue
- **Purpose**: Review and manage resources that have passed their deadline or are 1 year old
- **Automatic Expiry Rules**:
  - Resources are automatically moved here when:
    - Application deadline has passed
    - OR 1 year has elapsed since creation date
  - Expired resources are removed from public view
  
- **Admin Actions**:
  - Review expired resource details
  - Edit/update the resource with new information
  - Republish to make it public again
  - Permanently delete if no longer relevant

### 3. Update Requests Queue
- **Purpose**: Handle user-submitted requests for resource updates
- **How it works**:
  - Public users can click "Request Update" on any resource
  - They provide a reason (e.g., "Deadline changed", "Contact info outdated")
  - Resource is immediately removed from public view
  - Request appears in this queue with:
    - Resource name
    - User who requested
    - Date of request
    - Reason provided
    
- **Admin Actions**:
  - **Approve & Edit**: Opens edit form, allows updates, republishes resource
  - **Reject**: Dismisses request, resource remains hidden

## Workflow Examples

### Scenario 1: Expired Resource
```
1. Resource reaches deadline (or 1 year old)
2. System automatically moves to "Expired Queue"
3. Resource hidden from public
4. Admin reviews in "Expired Resources Queue" tab
5. Admin clicks "Edit" to update details
6. Admin updates deadline/information
7. Admin clicks "Republish"
8. Resource returns to active view
```

### Scenario 2: User Reports Outdated Info
```
1. Public user views resource modal
2. User clicks "Request Update" button
3. User enters reason: "Email bounced, contact is wrong"
4. Resource immediately hidden from public
5. Admin sees request in "Update Requests Queue" tab
6. Admin reviews reason
7. Admin clicks "Approve & Edit"
8. Admin updates contact information
9. Resource republished and visible again
```

### Scenario 3: Pause/Resume
```
1. Admin identifies resource needs temporary removal
2. Admin clicks "Pause" icon in actions column
3. Resource status changes to "Paused" (hidden from public)
4. Later, admin clicks "Resume"
5. Resource returns to active status
```

## Action Reference

| Action | Icon | Description |
|--------|------|-------------|
| Edit | ✏️ | Opens edit form for the resource |
| Pause | ⏸️ | Temporarily hides from public (reversible) |
| Resume | ▶️ | Makes paused resource public again |
| Delete | 🗑️ | Permanently removes resource (with confirmation) |
| Approve | ✅ | Accepts update request, allows editing |
| Reject | ❌ | Dismisses update request |

## Search & Filter Tips

- **Quick Search**: Type in search box to filter by name, sponsor, or country in real-time
- **Combined Filters**: Use type + country filters together for precise results
- **Sorting**: Click column headers to sort (click again to reverse)
- **Clear Filters**: Select "All Types" or "All Countries" to reset

## Best Practices

1. **Regular Queue Review**: Check "Expired Queue" and "Update Requests" daily
2. **Prompt Updates**: Respond to update requests within 24-48 hours
3. **Verify Before Republish**: Always review expired resources for accuracy before republishing
4. **Use Pause Wisely**: Use pause for temporary removals instead of deleting
5. **Document Deletions**: Note why resources are permanently deleted (for audit trail)

## API Endpoints Used

The admin interface connects to these backend endpoints:
- `GET /Resources/GetAllResources` - Fetch active resources
- `GET /Resources/GetExpiredResources` - Fetch expired queue
- `GET /Resources/GetUpdateRequestQueue` - Fetch update requests
- `PUT /Resources/ToggleResourceStatus/{id}` - Pause/resume
- `DELETE /Resources/DeleteResource/{id}` - Delete permanently
- `PUT /Resources/ApproveUpdateRequest/{id}` - Approve user request
- `PUT /Resources/RejectUpdateRequest/{id}` - Reject user request
- `PUT /Resources/RepublishResource/{id}` - Make expired resource active

## Notes

- All actions require superadmin authentication
- Deleted resources cannot be recovered
- Update requests automatically hide resources from public
- Expired resources are hidden but can be republished
- 1-year auto-expiry ensures database freshness
