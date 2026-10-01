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
import { opportunity, OpportunityPost } from '../../../../api/dashboard/opportunity';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';

type PostType = 'Business Development' | 'Co-founder' | 'Board Member';

const tabToIdMap: Record<PostType, number> = {
  'Business Development': 1,
  'Co-founder': 2,
  'Board Member': 1002
};

type SortDirection = 'asc' | 'desc';
type SortableField = 'MemberName' | 'PostTitle' | 'CreatedDateTime' | 'PostDuration' | 'BusinessIndustry' | 'NumberMatches' | 'StrategyName';

const OpportunityPosts: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<PostType>('Business Development');
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [opportunityPosts, setOpportunityPosts] = useState<OpportunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ field: SortableField | null; direction: SortDirection }>({
    field: null,
    direction: 'asc'
  });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const fetchOpportunityPosts = async (typeId: number) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const result = await opportunity.fetchOpportunityPosts(typeId, userData.Id);
      return result;
    } catch (error) {
      toast.error('Failed to fetch opportunity posts');
      return [];
    }
  };

  const loadAllOpportunities = async () => {
    setLoading(true);
    try {
      const [businessDevPosts, cofounderPosts, boardMemberPosts] = await Promise.all([
        fetchOpportunityPosts(1),
        fetchOpportunityPosts(2),
        fetchOpportunityPosts(1002)
      ]);

      const allPosts = [
        ...businessDevPosts.map((post: OpportunityPost) => ({
          ...post,
          MatchType: 1,
          IsPaused: post.IsPaused || false
        })),
        ...cofounderPosts.map((post: OpportunityPost) => ({
          ...post,
          MatchType: 2,
          IsPaused: post.IsPaused || false
        })),
        ...boardMemberPosts.map((post: OpportunityPost) => ({
          ...post,
          MatchType: 1002,
          IsPaused: post.IsPaused || false
        }))
      ];

      setOpportunityPosts(allPosts);
    } catch (error) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }; 

  const handleDelete = async (id: string) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this item? This action cannot be undone.",
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "swal-button--cancel",
            closeModal: true,
          },
          confirm: {
            text: "Confirm",
            value: true,
            visible: true,
            className: "swal-button--confirm",
            closeModal: false,
          }
        },
      });

      if (willDelete) {
        try {
          const res = await opportunity.deleteOpportunity(id, userData?.Id);

          if (res.status === 200) {
            toast.success("Opportunity deleted successfully");
            swal("Deleted!", "Your item has been deleted!", "success");
            loadAllOpportunities();
          } else {
            toast.error(res.data?.Message || 'Your opportunity was not deleted');
            swal("Failed!", "Your opportunity was not deleted.", "error");
          }
        } catch (error) {
          toast.error(error?.response?.data?.Message || 'Your opportunity was not deleted');
          swal("Failed!", "Your opportunity was not deleted", "error");
        }
      } else {
        swal("Cancelled", "Your item is safe.", "info");
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Your opportunity was not deleted');
      swal("Failed!", "Your opportunity was not deleted", "error");
    }
  };

  const handleToggleStatus = async (postId: string) => {
    try {
      const res = await opportunity.toggleOpportunityStatus(postId);

      if (res.status === 200) {
        setOpportunityPosts(opportunityPosts.map(post =>
          post.Id === postId
            ? { ...post, IsPaused: !post.IsPaused }
            : post
        ));
        toast.success('Opportunity status updated!');
      } else {
        toast.error('Failed to update opportunity status');
      }
    } catch (error) {
      toast.error('Failed to update opportunity status due to an error');
    }
  };

  const handleEdit = (post: OpportunityPost) => {
    let editRoute = '';
    switch (post.MatchType) {
      case 1:
        editRoute = `/business-development/update/${post.Id}`;
        break;
      case 2:
      case 1002:
        editRoute = `/cofounder-and-board-matcher/update/${post.Id}`;
        break;
      default:
        return;
    }
    window.location.href = editRoute;
  };

  const requestSort = (field: SortableField) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  const getSortIndicator = (field: SortableField) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const sortPosts = (posts: OpportunityPost[]) => {
    if (!sortConfig.field) return posts;

    return [...posts].sort((a, b) => {
      // Handle null/undefined values
      if (a[sortConfig.field!] == null) return 1;
      if (b[sortConfig.field!] == null) return -1;
      if (a[sortConfig.field!] == null && b[sortConfig.field!] == null) return 0;

      // Special handling for dates
      if (sortConfig.field === 'CreatedDateTime') {
        const dateA = new Date(a.CreatedDateTime).getTime();
        const dateB = new Date(b.CreatedDateTime).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Special handling for numbers
      if (sortConfig.field === 'NumberMatches' || sortConfig.field === 'PostDuration') {
        return sortConfig.direction === 'asc'
          ? (a[sortConfig.field] as number) - (b[sortConfig.field] as number)
          : (b[sortConfig.field] as number) - (a[sortConfig.field] as number);
      }

      // Default string comparison
      if (a[sortConfig.field!] < b[sortConfig.field!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.field!] > b[sortConfig.field!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  useEffect(() => {
    loadAllOpportunities();
  }, []);

  const filteredPosts = opportunityPosts.filter(post =>
    post.MatchType === tabToIdMap[selectedTab]
  );

  const sortedPosts = sortPosts(filteredPosts);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showDetails !== null && sortedPosts[showDetails]) {
    const post = sortedPosts[showDetails];
    return (
      <div className="px-4">
        <div className="md:hidden flex items-center justify-between py-4">
          <ChevronRight
            onClick={() => setShowDetails(null)}
            className="rotate-180 text-black-700 cursor-pointer"
          />
        </div>
        <div className="my-6">
          <h6 className="text-h6 font-semibold text-blue-500 mb-6">
            {selectedTab} Opportunity Details
          </h6>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">{post.PostTitle || 'No title provided'}</h3>

            {selectedTab !== 'Business Development' && (
              <>
                <p className="text-gray-600 mb-1"><strong>Business Name:</strong> {post.BusinessName || 'Not specified'}</p>
                <p className="text-gray-600 mb-4"><strong>Business Type:</strong> {post.BusinessType || 'Not specified'}</p>
              </>
            )}

            {selectedTab === 'Business Development' && (
              <>
                <p className="text-gray-600 mb-1"><strong>Industry:</strong> {post.BusinessIndustry || 'Not specified'}</p>
                <p className="text-gray-600 mb-4"><strong>Business Type:</strong> {post.BusinessType || 'Not specified'}</p>
              </>
            )}

            <div className="my-4 border-t border-gray-200 pt-4">
              <h4 className="font-semibold mb-2">Opportunity Details</h4>
              <p className="text-gray-800 mb-4">{post.RoleDescription || 'No description provided'}</p>
            </div>

            <p className="text-sm text-gray-500 mt-4">Posted on: {formatDate(post.CreatedDateTime)}</p>
            <p className="text-sm text-gray-500 mb-4">
              Status: {!post.IsPaused ? (
                <span className="text-green-500">Active</span>
              ) : (
                <span className="text-yellow-500">Paused</span>
              )}
            </p>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                onClick={() => handleToggleStatus(post.Id)}
                className={`px-4 py-2 ${post.IsPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                  } text-white`}
              >
                {post.IsPaused ? 'Resume' : 'Pause'}
              </Button>
              {!post.IsPaused && (
                <Button
                  onClick={() => handleEdit(post)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                >
                  Edit Post
                </Button>
              )}
              <Button
                onClick={() => handleDelete(post.Id)}
                className="text-danger px-4 py-2"
              >
                Delete Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 h-screen flex flex-col overflow-hidden">
      <div className="md:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 font-semibold text-blue-600">
          Opportunity Posts
        </p>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>

      <div className="flex-shrink-0 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="hidden md:flex items-center gap-6 text-h7">
            {(Object.keys(tabToIdMap) as PostType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  'cursor-pointer border-b-2',
                  selectedTab === tab
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'text-gray-500 border-transparent font-medium'
                )}
              >
                <p className="px-4 py-3">{tab}</p>
              </button>
            ))}
          </div>

          <Select
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value as PostType)}
            className={'text-blue-600 md:hidden flex-1 w-full focus-visible:outline-none'}
          >
            {(Object.keys(tabToIdMap) as PostType[]).map((tab) => (
              <option key={tab} value={tab} className="text-h9 font-semibold">
                {tab}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex-grow overflow-hidden pb-10">
        <div className="h-full flex flex-col">
          <p className="py-4 pe-3 mb-2 text-h6 text-blue-500 font-semibold">
            {selectedTab} Posts
          </p>
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className='flex border border-gray-200 rounded-lg p-10 justify-center text-center mt-[44px]'>
                Loading...
              </div>
            ) : sortedPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[70%] divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedTab !== 'Business Development' && (
                        <>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('MemberName')}
                          >
                            <div className="flex items-center">
                              Member Name
                              <span className="ml-1">{getSortIndicator('MemberName')}</span>
                            </div>
                          </th>
                          {selectedTab !== 'Co-founder' && (
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => requestSort('PostTitle')}
                            >
                              <div className="flex items-center">
                                Title
                                <span className="ml-1">{getSortIndicator('PostTitle')}</span>
                              </div>
                            </th>
                          )}
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('CreatedDateTime')}
                          >
                            <div className="flex items-center">
                              Creation Date
                              <span className="ml-1">{getSortIndicator('CreatedDateTime')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('PostDuration')}
                          >
                            <div className="flex items-center">
                              Duration
                              <span className="ml-1">{getSortIndicator('PostDuration')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('BusinessIndustry')}
                          >
                            <div className="flex items-center">
                              Industry
                              <span className="ml-1">{getSortIndicator('BusinessIndustry')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('NumberMatches')}
                          >
                            <div className="flex items-center">
                              No. of matches
                              <span className="ml-1">{getSortIndicator('NumberMatches')}</span>
                            </div>
                          </th>
                        </>
                      )}
                      {selectedTab === 'Co-founder' && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            Role Sought
                          </div>
                        </th>
                      )}
                      {selectedTab === 'Business Development' && (
                        <>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('MemberName')}
                          >
                            <div className="flex items-center">
                              Member Name
                              <span className="ml-1">{getSortIndicator('MemberName')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('PostTitle')}
                          >
                            <div className="flex items-center">
                              Title
                              <span className="ml-1">{getSortIndicator('PostTitle')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('CreatedDateTime')}
                          >
                            <div className="flex items-center">
                              Creation Date
                              <span className="ml-1">{getSortIndicator('CreatedDateTime')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            <div className="flex items-center">
                              Duration
                              <span className="ml-1">{getSortIndicator('PostDuration')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('StrategyName')}
                          >
                            <div className="flex items-center">
                              Strategy
                              <span className="ml-1">{getSortIndicator('StrategyName')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tactics
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('BusinessIndustry')}
                          >
                            <div className="flex items-center">
                              Industry
                              <span className="ml-1">{getSortIndicator('BusinessIndustry')}</span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => requestSort('NumberMatches')}
                          >
                            <div className="flex items-center">
                              No. of matches
                              <span className="ml-1">{getSortIndicator('NumberMatches')}</span>
                            </div>
                          </th>
                        </>
                      )}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPosts.map((post, index) => (
                      <tr
                        key={post.Id}
                        className="hover:bg-gray-50"
                      >
                        {selectedTab !== 'Business Development' && (
                          <>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => {
                                if (!post.MemberName) return;
                                if (isMobile) setShowDetails(index);
                                const url = `/profile/${add2040ToProfileDetailsId(Number(post.UserProfileId))}`;
                                window.open(url, '_blank');
                              }}
                            >
                              <div className="text-gray-600">{post.MemberName || 'Not specified'}</div>
                            </td>
                            {selectedTab !== 'Co-founder' && (
                              <td
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() => {
                                  if (!post.PostTitle) return;
                                  if (isMobile) setShowDetails(index);
                                  const url = `/cofounder-and-board-matcher/${add2040ToProfileDetailsId(Number(post.Id))}`;
                                  window.open(url, '_blank');
                                }}
                              >
                                <div className="text-gray-600">{post.PostTitle || 'Not specified'}</div>
                              </td>
                            )}
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div className="text-gray-600">{formatDate(post.CreatedDateTime) || 'Not specified'}</div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div className="text-gray-600">{post.PostDuration || 'Not specified'} Months</div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer max-w-30"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div>
                                {post.ChildIndustries && post.ChildIndustries.length > 0 ? (
                                  <ul className="text-sm text-gray-600">
                                    {post.ChildIndustries.map((industry, idx) => (
                                      <li key={idx}>{`${idx + 1}). ${industry.IndustryName}`}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div>No industry available</div>
                                )}
                              </div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div className="text-gray-600">{post.NumberMatches}</div>
                            </td>
                          </>
                        )}
                        {selectedTab === 'Co-founder' && (
                          <td
                            className="px-6 py-4 whitespace-nowrap cursor-pointer"
                            onClick={() => isMobile && setShowDetails(index)}
                          >
                            <div className="text-gray-600">{post.RoleSought}</div>
                          </td>
                        )}
                        {selectedTab === 'Business Development' && (
                          <>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => {
                                if (!post.MemberName) return;
                                if (isMobile) setShowDetails(index);
                                const url = `/profile/${add2040ToProfileDetailsId(Number(post.UserProfileId))}`;
                                window.open(url, '_blank');
                              }}
                            >
                              <div className="text-gray-600">{post.MemberName || 'Not specified'}</div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => {
                                if (!post.PostTitle) return;
                                if (isMobile) setShowDetails(index);
                                const url = `/business-development/${add2040ToProfileDetailsId(Number(post.Id))}`;
                                window.open(url, '_blank');
                              }}
                            >
                              <div className="text-gray-600">{post.PostTitle || 'Not specified'}</div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div className="text-gray-600">{formatDate(post.CreatedDateTime) || 'Not specified'}</div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div className="text-gray-600">{post.PostDuration || 'Not specified'}</div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div className="text-gray-600">{post.StrategyName || 'Not specified'}</div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer max-w-30"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div>
                                {post.Tactics && post.Tactics.length > 0 ? (
                                  <ul className="text-sm text-gray-600">
                                    {post.Tactics.map((tactic, idx) => (
                                      <li key={idx}>`{idx + 1}). {tactic}`</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div>No tactics available</div>
                                )}
                              </div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer max-w-30"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div>
                                {post.ChildIndustries && post.ChildIndustries.length > 0 ? (
                                  <ul className="text-sm text-gray-600">
                                    {post.ChildIndustries.map((industry, idx) => (
                                      <li key={idx}>`{idx + 1}). {industry.IndustryName}`</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div>No industry available</div>
                                )}
                              </div>
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap cursor-pointer"
                              onClick={() => isMobile && setShowDetails(index)}
                            >
                              <div className="text-gray-600">{post.NumberMatches}</div>
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!post.IsPaused ? (
                            <span className="text-green-500">Active</span>
                          ) : (
                            <span className="text-yellow-500">Paused</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {!post.IsPaused && (
                              <Tooltip content="Edit">
                                <button
                                  onClick={() => handleEdit(post)}
                                  className="text-blue-500 hover:text-blue-700 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    version="1.1"
                                    width="16"
                                    height="16"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 24 24"
                                  >
                                    <g>
                                      <path
                                        d="m14.46 3.26.88-.88c1.04-1.04 2.85-1.04 3.89 0l.71.71a2.732 2.732 0 0 1 0 3.88l-.88.88-4.6-4.6zM13.4 4.32l-9.11 9.11c-.29.29-.47.67-.5 1.08l-.27 2.93c-.03.37.1.73.36 1 .24.24.55.37.88.37h.11l2.93-.27c.41-.04.79-.22 1.08-.51l9.11-9.11-4.6-4.6zM22.75 22c0-.41-.34-.75-.75-.75H2c-.41 0-.75.34-.75.75s.34.75.75.75h20c.41 0 .75-.34.75-.75z"
                                        fill="#2357c6"
                                        opacity="1"
                                        data-original="#2357c6"
                                      ></path>
                                    </g>
                                  </svg>
                                </button>
                              </Tooltip>
                            )}
                            <Tooltip content={post.IsPaused ? 'Resume' : 'Pause'}>
                              <button
                                onClick={() => handleToggleStatus(post.Id)}
                                className={`p-1 rounded ${post.IsPaused ? 'text-green-500 hover:text-green-700' : 'text-yellow-500 hover:text-yellow-700'}`}
                              >
                                {post.IsPaused ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                  </svg>
                                )}
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete">
                              <button
                                onClick={() => handleDelete(post.Id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='flex border border-gray-200 rounded-lg p-10 justify-center text-center mt-[44px]'>
                No {selectedTab} posts found
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default OpportunityPosts;