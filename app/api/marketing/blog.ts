import axios from 'axios'; // Add this import if not already present
import { createBlogSlug } from '@/lib/blog-slug';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

const headers = {
  'XApiKey': `${process.env.NEXT_PUBLIC_API_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const getAllBlogs = async () => {
  try {
    const response = await axios.post(`${apiEndpoint}/Blog/GetBlogs`, {
      Status: 'Published', // Set to 'All' to get all blogs
      PageNumber: 1,
      PageSize: 100, // Increase PageSize to get more blogs, adjust as needed
    }, {
      headers
    });

    if (response.status === 200) {
      // Handle different response structures
      const blogs = response.data?.Result?.Blogs || response.data?.Blogs || response.data?.Result || response.data || [];
      // Ensure we always return an array
      return Array.isArray(blogs) ? blogs : [];
    }
    // Log non-200 responses for debugging
    console.warn('getAllBlogs: Non-200 response status:', response.status, response.data);
    return [];
  } catch (error) {
    // Log the full error for production debugging
    console.error('getAllBlogs: Error fetching blogs:', {
      message: error instanceof Error ? error.message : String(error),
      endpoint: `${apiEndpoint}/Blog/GetBlogs`,
      status: error instanceof axios.AxiosError ? error.response?.status : 'unknown',
      data: error instanceof axios.AxiosError ? error.response?.data : 'unknown',
    });
    // Return empty array instead of throwing so page doesn't crash
    return [];
  }
};

export const getBlogById = async (id: string) => {
  try {
    // pass id as query param (api expects blogId or id - adjust key if needed)
    const response = await axios.get(`${apiEndpoint}/Blog/GetBlogById`, {
      params: { blogId: id }, // use 'blogId' per the API examples you showed
      headers,
    });

    if (response.status === 200) {
      return response.data?.Result || response.data;
    }
    console.warn('getBlogById: Non-200 response status:', response.status, response.data);
    return null;
  } catch (error) {
    console.error('getBlogById: Error fetching blog:', {
      blogId: id,
      message: error instanceof Error ? error.message : String(error),
      endpoint: `${apiEndpoint}/Blog/GetBlogById`,
      status: error instanceof axios.AxiosError ? error.response?.status : 'unknown',
    });
    return null;
  }
};

// Fetch blog by slug (generated from title)
export const getBlogBySlug = async (slug: string) => {
  try {
    const normalizedSlug = createBlogSlug(slug || '');

    // Fetch all blogs and find by matching slug
    const response = await axios.post(`${apiEndpoint}/Blog/GetBlogs`, {
      Status: 'Published',
      PageNumber: 1,
      PageSize: 1000, // Get all to search by slug
    }, {
      headers
    });

    if (response.status === 200) {
      // Handle different response structures
      const blogs = response.data?.Result?.Blogs || response.data?.Blogs || response.data?.Result || [];
      const blogArray = Array.isArray(blogs) ? blogs : [];

      // Find blog where slug matches
      const blog = blogArray.find((b: any) => {
        const blogSlug = createBlogSlug(b.Title || '');
        return blogSlug === normalizedSlug;
      });

      if (blog) {
        // Fetch full blog details by ID
        return await getBlogById(blog.Id);
      }
      console.warn('getBlogBySlug: Blog not found for slug:', slug);
      return null;
    }
    console.warn('getBlogBySlug: Non-200 response status:', response.status);
    return null;
  } catch (error) {
    console.error('getBlogBySlug: Error fetching blog by slug:', {
      slug,
      message: error instanceof Error ? error.message : String(error),
      endpoint: `${apiEndpoint}/Blog/GetBlogs`,
      status: error instanceof axios.AxiosError ? error.response?.status : 'unknown',
      data: error instanceof axios.AxiosError ? error.response?.data : 'unknown',
    });
    return null;
  }
};
