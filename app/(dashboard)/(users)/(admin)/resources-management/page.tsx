'use client';

import React, { useState, useEffect } from 'react';
import { Select } from '@headlessui/react';
import { cn } from '@/utils/utils';
import Button from '@/components/ui/button';
import Hamburger from '@/icons/sidebar/hamburger';
import ChevronRight from '@/icons/chevron-right';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import Tooltip from '@/components/ui/tooltip';
import Trash from '@/icons/trash';
import SearchIcon from '@/icons/search-icon'; import { pluralizeResourceTypeName } from '@/utils/resourceType'; import { 
  getAllResources, 
  deleteResource, 
  toggleResourceStatus,
  getExpiredResources,
  getUpdateRequestQueue,
  approveUpdateRequest,
  rejectUpdateRequest 
} from '@/app/api/admin/resources';

type ResourceView = 'active' | 'expired' | 'update-requests';
type SortDirection = 'asc' | 'desc';
type SortableField = 'Name' | 'Sponsor' | 'CreatedAt' | 'ApplicationDeadline' | 'StartDate' | 'EndDate' | 'CountryName' | 'ResourceTypeName';

interface Resource {
  Id: string;
  Name: string;
  Sponsor: string;
  ResourceTypeName: string;
  CountryName: string;
  CityName: string;
  ApplicationDeadline: string;
  StartDate?: string;
  EndDate?: string;
  CreatedAt: string;
  IsPaused: boolean;
  IsExpired: boolean;
  Description: string;
}

interface UpdateRequest {
  Id: string;
  ResourceId: string;
  ResourceName: string;
  RequestReason: string;
  RequestedBy: string;
  RequestedAt: string;
  Status: string;
}

const ResourcesManagement: React.FC = () => {
  const [selectedView, setSelectedView] = useState<ResourceView>('active');
  const [resources, setResources] = useState<Resource[]>([]);
  const [expiredResources, setExpiredResources] = useState<Resource[]>([]);
  const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ field: SortableField | null; direction: SortDirection }>({
    field: null,
    direction: 'asc'
  });
  const [sortOption, setSortOption] = useState<string>('default');

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const loadData = async () => {
    setLoading(true);
    try {
      if (selectedView === 'active') {
        const data = await getAllResources({ includeExpired: true });
        setResources(data);
      } else if (selectedView === 'expired') {
        const data = await getExpiredResources();
        setExpiredResources(data);
      } else if (selectedView === 'update-requests') {
        const data = await getUpdateRequestQueue();
        setUpdateRequests(data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedView]);



  const handleDelete = async (id: string) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this resource? This action cannot be undone.",
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            closeModal: true,
          },
          confirm: {
            text: "Confirm",
            value: true,
            visible: true,
            closeModal: false,
          }
        },
      });

      if (willDelete) {
        const res = await deleteResource(id);
        if (res.status === 200) {
          toast.success("Resource deleted successfully");
          swal("Deleted!", "The resource has been deleted!", "success");
          loadData();
        } else {
          toast.error('Failed to delete resource');
          swal("Failed!", "The resource was not deleted.", "error");
        }
      }
    } catch (error) {
      toast.error('Failed to delete resource');
      swal("Failed!", "An error occurred", "error");
    }
  };

  const handleToggleStatus = async (resourceId: string, isPaused: boolean) => {
    try {
      const res = await toggleResourceStatus(resourceId, isPaused);
      if (res.status === 200) {
        toast.success(isPaused ? 'Resource resumed!' : 'Resource paused!');
        loadData();
      } else {
        toast.error('Failed to update resource status');
      }
    } catch (error) {
      toast.error('Failed to update resource status');
    }
  };

  const handleApproveUpdate = async (requestId: string) => {
    try {
      const res = await approveUpdateRequest(requestId);
      if (res.status === 200) {
        toast.success('Update request approved');
        loadData();
      } else {
        toast.error('Failed to approve request');
      }
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleRejectUpdate = async (requestId: string) => {
    try {
      const res = await rejectUpdateRequest(requestId);
      if (res.status === 200) {
        toast.success('Update request rejected');
        loadData();
      } else {
        toast.error('Failed to reject request');
      }
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const handleEdit = (resourceId: string) => {
    window.location.href = `/resources-management/edit/${resourceId}`;
  };

  const requestSort = (field: SortableField) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
    setSortOption('default');
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    switch (option) {
      case 'recently-added':
        setSortConfig({ field: 'CreatedAt', direction: 'desc' });
        break;
      case 'oldest-first':
        setSortConfig({ field: 'CreatedAt', direction: 'asc' });
        break;
      case 'deadline-soon':
        setSortConfig({ field: 'ApplicationDeadline', direction: 'asc' });
        break;
      case 'deadline-latest':
        setSortConfig({ field: 'ApplicationDeadline', direction: 'desc' });
        break;
      case 'start-date-asc':
        setSortConfig({ field: 'StartDate', direction: 'asc' });
        break;
      case 'start-date-desc':
        setSortConfig({ field: 'StartDate', direction: 'desc' });
        break;
      case 'end-date-asc':
        setSortConfig({ field: 'EndDate', direction: 'asc' });
        break;
      case 'end-date-desc':
        setSortConfig({ field: 'EndDate', direction: 'desc' });
        break;
      default:
        setSortConfig({ field: null, direction: 'asc' });
    }
  };

  const isResourceOutdated = (resource: Resource): boolean => {
    if (!resource.ApplicationDeadline && !resource.EndDate) return false;

    const now = new Date();
    const deadline = resource.ApplicationDeadline ? new Date(resource.ApplicationDeadline) : null;
    const endDate = resource.EndDate ? new Date(resource.EndDate) : null;

    // Consider outdated if deadline or end date has passed
    if (deadline && deadline < now) return true;
    if (endDate && endDate < now) return true;

    // Also check if deadline is within 7 days
    if (deadline) {
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline >= 0 && daysUntilDeadline <= 7) return true;
    }

    return false;
  };

  const getSortIndicator = (field: SortableField) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const sortResources = (items: Resource[]) => {
    if (!sortConfig.field) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.field!] == null) return 1;
      if (b[sortConfig.field!] == null) return -1;

      if (sortConfig.field === 'CreatedAt' || sortConfig.field === 'ApplicationDeadline' || sortConfig.field === 'StartDate' || sortConfig.field === 'EndDate') {
        const dateA = a[sortConfig.field] ? new Date(a[sortConfig.field]).getTime() : 0;
        const dateB = b[sortConfig.field] ? new Date(b[sortConfig.field]).getTime() : 0;
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (a[sortConfig.field!] < b[sortConfig.field!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.field!] > b[sortConfig.field!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueCountries = (): string[] => {
    const currentResources = selectedView === 'expired' ? expiredResources : resources;
    const countries = currentResources
      .map(r => r.CountryName)
      .filter((country, index, self) => country && self.indexOf(country) === index)
      .sort();
    return countries;
  };

  const getFilteredResources = () => {
    let filtered = selectedView === 'expired' ? expiredResources : resources;

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.Sponsor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.CountryName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(r => pluralizeResourceTypeName(r.ResourceTypeName) === filterType);
    }

    if (filterCountry !== 'all') {
      filtered = filtered.filter(r => r.CountryName === filterCountry);
    }

    return sortResources(filtered);
  };

  const filteredResources = getFilteredResources();

  return (
    <div className="px-4 md:px-6 h-screen flex flex-col overflow-hidden">
      <div className="md:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 font-semibold text-blue-600">
          Resources Management
        </p>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>

      <div className="flex-shrink-0 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="hidden md:flex items-center gap-6 text-h7">
            <button
              onClick={() => setSelectedView('active')}
              className={cn(
                'cursor-pointer border-b-2',
                selectedView === 'active'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'text-gray-500 border-transparent font-medium'
              )}
            >
              <p className="px-4 py-3">Active Resources</p>
            </button>
            <button
              onClick={() => setSelectedView('expired')}
              className={cn(
                'cursor-pointer border-b-2',
                selectedView === 'expired'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'text-gray-500 border-transparent font-medium'
              )}
            >
              <p className="px-4 py-3">Expired Queue</p>
            </button>
            <button
              onClick={() => setSelectedView('update-requests')}
              className={cn(
                'cursor-pointer border-b-2',
                selectedView === 'update-requests'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'text-gray-500 border-transparent font-medium'
              )}
            >
              <p className="px-4 py-3">Update Requests</p>
            </button>
          </div>

          <Select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value as ResourceView)}
            className={'text-blue-600 md:hidden flex-1 w-full focus-visible:outline-none'}
          >
            <option value="active">Active Resources</option>
            <option value="expired">Expired Queue</option>
            <option value="update-requests">Update Requests</option>
          </Select>
        </div>

        {selectedView !== 'update-requests' && (
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
            </div>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            >
              <option value="default">Sort by...</option>
              <option value="recently-added">Recently Added</option>
              <option value="oldest-first">Oldest First</option>
              <option value="deadline-soon">Deadline (Soonest First)</option>
              <option value="deadline-latest">Deadline (Latest First)</option>
              <option value="start-date-asc">Start Date (Earliest)</option>
              <option value="start-date-desc">Start Date (Latest)</option>
              <option value="end-date-asc">End Date (Earliest)</option>
              <option value="end-date-desc">End Date (Latest)</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Competitions">Competitions</option>
              <option value="Accelerators">Accelerators</option>
              <option value="Grants">Grants</option>
              <option value="Government Programs">Government Programs</option>
              <option value="School Programs">School Programs</option>
              <option value="NGO Programs">NGO Programs</option>
              <option value="Specialty Financing">Specialty Financing</option>
            </select>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              {getUniqueCountries().map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-hidden pb-10">
        <div className="h-full flex flex-col">
          <p className="py-4 pe-3 mb-2 text-h6 text-blue-500 font-semibold">
            {selectedView === 'active' && 'Active Resources'}
            {selectedView === 'expired' && 'Expired Resources Queue'}
            {selectedView === 'update-requests' && 'Update Requests Queue'}
          </p>
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className='flex border border-gray-200 rounded-lg p-10 justify-center text-center mt-[44px]'>
                Loading...
              </div>
            ) : selectedView === 'update-requests' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {updateRequests.length > 0 ? (
                      updateRequests.map((request) => (
                        <tr key={request.Id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{request.ResourceName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{request.RequestedBy}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{formatDate(request.RequestedAt)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-600 max-w-xs truncate">{request.RequestReason}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleApproveUpdate(request.Id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                              >
                                Approve & Edit
                              </Button>
                              <Button
                                onClick={() => handleRejectUpdate(request.Id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No update requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('Name')}
                      >
                        <div className="flex items-center">
                          Resource Name
                          <span className="ml-1">{getSortIndicator('Name')}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('Sponsor')}
                      >
                        <div className="flex items-center">
                          Sponsor
                          <span className="ml-1">{getSortIndicator('Sponsor')}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('ResourceTypeName')}
                      >
                        <div className="flex items-center">
                          Type
                          <span className="ml-1">{getSortIndicator('ResourceTypeName')}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('CountryName')}
                      >
                        <div className="flex items-center">
                          Country
                          <span className="ml-1">{getSortIndicator('CountryName')}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('ApplicationDeadline')}
                      >
                        <div className="flex items-center">
                          Deadline
                          <span className="ml-1">{getSortIndicator('ApplicationDeadline')}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('StartDate')}
                          >
                            <div className="flex items-center">
                              Start Date
                              <span className="ml-1">{getSortIndicator('StartDate')}</span>
                            </div>
                          </th>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('EndDate')}
                          >
                            <div className="flex items-center">
                              End Date
                              <span className="ml-1">{getSortIndicator('EndDate')}</span>
                            </div>
                          </th>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('CreatedAt')}
                      >
                        <div className="flex items-center">
                          Created
                          <span className="ml-1">{getSortIndicator('CreatedAt')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResources.map((resource) => {
                          const isOutdated = isResourceOutdated(resource);
                          return (
                            <tr key={resource.Id} className={cn("hover:bg-gray-50", isOutdated && "bg-red-50")}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">{resource.Name}</span>
                              {isOutdated && (
                                <Tooltip content="Resource needs attention: deadline approaching or passed">
                                  <span className="text-red-500 text-xs font-semibold px-2 py-0.5 bg-red-100 rounded">⚠ Update Needed</span>
                                </Tooltip>
                              )}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">{resource.Sponsor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">{pluralizeResourceTypeName(resource.ResourceTypeName)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">{resource.CountryName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">{formatDate(resource.ApplicationDeadline)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{formatDate(resource.StartDate || '')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{formatDate(resource.EndDate || '')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-600">{formatDate(resource.CreatedAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!resource.IsPaused ? (
                            <span className="text-green-500">Active</span>
                          ) : (
                            <span className="text-yellow-500">Paused</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {!resource.IsPaused && (
                              <Tooltip content="Edit">
                                <button
                                  onClick={() => handleEdit(resource.Id)}
                                  className="text-blue-500 hover:text-blue-700 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </button>
                              </Tooltip>
                            )}
                            <Tooltip content={resource.IsPaused ? 'Resume' : 'Pause'}>
                              <button
                                onClick={() => handleToggleStatus(resource.Id, resource.IsPaused)}
                                className={`p-1 rounded ${resource.IsPaused ? 'text-green-500 hover:text-green-700' : 'text-yellow-500 hover:text-yellow-700'}`}
                              >
                                {resource.IsPaused ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                  </svg>
                                )}
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete">
                              <button
                                onClick={() => handleDelete(resource.Id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='flex border border-gray-200 rounded-lg p-10 justify-center text-center mt-[44px]'>
                No resources found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesManagement;
