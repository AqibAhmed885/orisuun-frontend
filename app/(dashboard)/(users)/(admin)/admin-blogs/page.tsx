'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/utils';
import CreateBlog from './components/create';
import axios from 'axios'; // Add this import if not already present
import Image from 'next/image';
import { toast } from 'react-toastify';



const AdminBlogs = () => {
  const [selectedView, setSelectedView] = useState<'all' | 'published' | 'drafts'>('all');
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null); // Adjust type as needed
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]); // Add state for blogs from API

  // Filter blogs based on selected view

  // Add function to fetch blog by ID
  const fetchBlogById = async (blogId: string) => {
    try {
      const response = await axios.get('https://api.orisuun.com/api/Blog/GetBlogById', {
        params: { blogId },
        headers: {
          'accept': '*/*',
          'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
        },
      });
      if (response.status === 200) {
        return response.data.Result || response.data; // Adjust based on API response
      }
    } catch (error: any) {
      console.error('Error fetching blog by ID:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to fetch blog details');
      return null;
    }
  };

  // Add edit handler
  const handleEditBlog = async (blog: any) => {
    // Fix: Use uppercase Id to match API response
    const blogId = blog.Id || blog.id;
    
    if (!blogId) {
      toast.error('Blog ID is missing');
      console.error('Blog object:', blog);
      return;
    }
    
    const fullBlog = await fetchBlogById(blogId);
    if (fullBlog) {
      setSelectedBlog(fullBlog);
      setIsEditing(true);
      setIsCreatingBlog(true);
    } else {
      // Error already shown in fetchBlogById
      console.error('Failed to fetch blog details for ID:', blogId);
    }
  };

  // Update handleCreateBlog to handle both create and edit
  const handleCreateBlog = async (payload: any) => {
    if (isEditing && selectedBlog) {
      // Update existing blog using UpdateBlog API
      try {
        // To avoid EF tracking conflicts, do not send BlogContent Ids (API will match by sort/order or replace)
        const sanitizedContents = (payload.BlogContents || []).map((content: any, index: number) => ({
          // deliberately omit Id to prevent duplicate tracked entity conflicts
          ContentType: content.ContentType,
          Content: content.Content,
          FileUrl: content.FileUrl,
          ContentFileName: content.ContentFileName,
          FileSize: content.FileSize,
          SortOrder: content.SortOrder || index + 1,
        }));

        const updatePayload = {
          Id: selectedBlog.Id,
          ...payload,
          BlogContents: sanitizedContents,
        };

        const response = await axios.put('https://api.orisuun.com/api/Blog/UpdateBlog', updatePayload, {
          headers: {
            'accept': '*/*',
            'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          // Update local state with the updated blog
          const index = blogs.findIndex(b => b.Id === selectedBlog.Id);
          if (index !== -1) {
            const updatedBlogs = [...blogs];
            updatedBlogs[index] = { ...selectedBlog, ...payload, UpdatedAt: new Date().toISOString() };
            setBlogs(updatedBlogs);
            setSelectedBlog(updatedBlogs[index]);
          }
          toast.success('Blog updated successfully');
        } else {
          console.error('Failed to update blog:', response.statusText);
          toast.error('Failed to update blog');
        }
      } catch (error: any) {
        console.error('Error updating blog:', error);
        console.error('Error response:', error?.response?.data);
        toast.error(error?.response?.data?.message || 'Error updating blog');
      }
    } else {
      // Create new blog via axios
      try {
        const response = await axios.post('https://api.orisuun.com/api/Blog/AddBlog', payload, {
          headers: {
            'accept': '*/*',
            'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const result = response.data;
          // Add to blogs list
          const newBlog = { Id: result.Id || blogs.length + 1, ...payload, BlogStatus: 'Published', CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() };
          setBlogs([...blogs, newBlog]);
          setSelectedBlog(newBlog);
          toast.success('Blog created successfully');
        } else {
          console.error('Failed to add blog:', response.statusText);
          toast.error('Failed to create blog');
        }
      } catch (error) {
        console.error('Error adding blog:', error);
        toast.error('Error creating blog');
      }
    }
    setIsCreatingBlog(false);
    setIsEditing(false);
  };


  // Add useEffect to fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.post('https://api.orisuun.com/api/Blog/GetBlogs', {
          Status: 'Published', // Change to 'All' or null if needed for all blogs
          PageNumber: 1,
          PageSize: 10,
        }, {
          headers: {
            'accept': '*/*',
            'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setBlogs(response.data.Result.Blogs || response.data); // Adjust based on API response structure
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const response = await axios.delete('https://api.orisuun.com/api/Blog/DeleteBlog', {
        params: { blogId },
        headers: {
          'accept': '*/*',
          'XApiKey': 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
        },
      });
      if (response.status === 200) {
        // Remove from blogs list
        setBlogs(blogs.filter(b => b.Id !== blogId));
        // Clear selected blog if it was the deleted one
        if (selectedBlog?.Id === blogId) {
          setSelectedBlog(null);
        }
        toast.success('Blog deleted successfully');
      } else {
        console.error('Failed to delete blog');
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog');
    }
  };

  return (
    <div className="w-full flex flex-row h-[calc(100vh-40px)] gap-6 px-6 pt-6 relative overflow-hidden max-w-full">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white rounded-2xl shadow-sm flex flex-col min-w-0 flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Admin Blogs</h2>
            <button
              onClick={() => {
                setIsCreatingBlog(true);
                setSelectedBlog(null);
              }}
              className="bg-omblue-600 text-white px-4 py-2 rounded-lg hover:bg-omblue-700"
            >
              Create Blog
            </button>
          </div>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mt-4">
            <button
              onClick={() => setSelectedView('all')}
              className={cn(
                'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                selectedView === 'all'
                  ? 'bg-white text-omblue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              All Blogs
            </button>
            {/* <button
              onClick={() => setSelectedView('published')}
              className={cn(
                'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                selectedView === 'published'
                  ? 'bg-white text-omblue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Published
            </button>
            <button
              onClick={() => setSelectedView('drafts')}
              className={cn(
                'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                selectedView === 'drafts'
                  ? 'bg-white text-omblue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Drafts
            </button> */}
          </div>
        </div>
        {/* Sidebar content: blogs list */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Blogs List</h3>
          <div className="space-y-2">
            {blogs.map((blog) => (
              <div
                key={blog.Id}
                className={cn(
                  'p-3 rounded-lg cursor-pointer transition-colors',
                  selectedBlog?.Id === blog.Id ? 'bg-omblue-50 border border-omblue-200' : 'bg-gray-50 hover:bg-gray-100'
                )}
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="font-medium text-sm text-gray-900 truncate">{blog.Title}</div>
                <div className="text-xs text-gray-500 mt-1">By {blog.AuthorName}</div>
                <div className="text-xs text-gray-400 mt-1">{blog.BlogStatus}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm min-w-0 overflow-y-auto overflow-hidden flex-shrink">
        <div className="p-6">
          {isCreatingBlog ? (
            <CreateBlog
              handleCreateBlog={handleCreateBlog}
              setIsCreatingBlog={setIsCreatingBlog}
              isEditing={isEditing}
              selectedBlog={selectedBlog}
            />
          ) : selectedBlog ? (
            <div className='overflow-y-auto '>
              {/* Header with title and buttons */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-semibold">{selectedBlog.Title}</h1>
                  <p className="text-sm text-gray-500 mt-1">By {selectedBlog.AuthorName}</p>
                  {selectedBlog.AuthorTitle && (
                    <p className="text-sm text-gray-400">{selectedBlog.AuthorTitle}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 text-omblue-600 hover:bg-omblue-50 rounded"
                    onClick={() => handleEditBlog(selectedBlog!)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleDeleteBlog(selectedBlog!.Id)}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Author Info */}
              {selectedBlog.AuthorPicture && (
                <div className="flex items-center gap-4 mb-4">
                  <Image src={selectedBlog.AuthorPicture} width={64} height={64} alt={selectedBlog.AuthorName} className="w-16 h-16 rounded-full" />
                  <div>
                    <p className="font-medium">{selectedBlog.AuthorName}</p>
                    {selectedBlog.AuthorBio && <p className="text-sm text-gray-600">{selectedBlog.AuthorBio}</p>}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {selectedBlog.SocialLinks && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Social Links</h3>
                  <div className="flex gap-3">
                    {Object.entries(JSON.parse(selectedBlog.SocialLinks || '{}')).map(([platform, url]) => (
                      url && (
                        <a key={platform} href={url as string} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {platform}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Contents */}
              <div className="space-y-6">
                {selectedBlog.BlogContents && selectedBlog.BlogContents.length > 0 ? (
                  selectedBlog.BlogContents
                    .sort((a, b) => a.SortOrder - b.SortOrder)
                    .map((content, index) => (
                      <div key={content.Id || index}>
                        {content.ContentType === 'text' || content.ContentType === 'paragraph' ? (
                          <div className='blog-content' dangerouslySetInnerHTML={{ __html: content.Content }} />
                        ) : content.ContentType === 'bullets' ? (
                          <ul className="list-disc list-inside space-y-1">
                            {content.Content.split('|').map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : content.ContentType === 'image' ? (
                          <Image src={content.FileUrl} alt={content.ContentFileName} width={500} height={300} className="max-w-full h-auto rounded" />
                        ) : content.ContentType === 'video' ? (
                          <video controls src={content.FileUrl} className="max-w-full h-auto rounded" />
                        ) : content.ContentType === 'pdf' ? (
                          <a href={content.FileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            View PDF: {content.ContentFileName}
                          </a>
                        ) : content.ContentType === 'file' ? (
                          <a href={content.FileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            Download: {content.ContentFileName}
                          </a>
                        ) : (
                          <div>{content.Content}</div>
                        )}
                      </div>
                    ))
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: selectedBlog.BlogDescription }} />
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-sm text-gray-500">
                <p>Status: {selectedBlog.BlogStatus}</p>
                <p>Tags: {selectedBlog.Tags}</p>
                <p>Created: {new Date(selectedBlog.CreatedAt).toLocaleString()}</p>
                <p>Updated: {new Date(selectedBlog.UpdatedAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>Select a blog from the sidebar to view details or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;