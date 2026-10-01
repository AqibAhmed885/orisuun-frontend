import React, { useEffect, useState } from 'react'; // Add useState
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import RichTextEditor from './rich-text-editor';
import { Delete, Move, X } from 'react-feather';
import Image from 'next/image';
import Input from '@/components/ui/input';
import { uploadImageToAzure } from '@/server-actions/community'; // <-- add import

interface CreateBlogProps {
  handleCreateBlog: (payload: any) => void;
  setIsCreatingBlog: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean; // Add
  selectedBlog: BlogFormValues | null; // Add
}

type BlogContent = {
  id?: string; // for react-hook-form field array
  Id?: string; // API Id for existing content (when updating)
  ContentType: string;
  Content: string;
  FileUrl: string;
  ContentFileName: string;
  FileSize: number;
  SortOrder: number;
};

type SocialLink = {
  id?: string;
  platform: string;
  url: string;
};

type BlogFormValues = {
  Id?: string;
  title: string;
  shortDescription: string;
  authorName: string;
  authorTitle: string;
  bio: string;
  image: string;
  video: string;
  banner: string;
  category: string;
  socialLinks: SocialLink[];
  contents: BlogContent[];
  tags: string;
  isPopular: boolean; // <-- add
};

const CreateBlog: React.FC<CreateBlogProps> = ({ handleCreateBlog, setIsCreatingBlog, isEditing, selectedBlog }) => {
  const methods = useForm<BlogFormValues>({
    defaultValues: isEditing && selectedBlog ? {
      title: (selectedBlog as any)?.Title || (selectedBlog as any)?.title || '',
      shortDescription: (selectedBlog as any)?.BlogDescription || (selectedBlog as any)?.shortDescription || '',
      authorName: (selectedBlog as any)?.AuthorName || (selectedBlog as any)?.authorName || '',
      authorTitle: (selectedBlog as any)?.AuthorTitle || (selectedBlog as any)?.authorTitle || '',
      bio: (selectedBlog as any)?.AuthorBio || (selectedBlog as any)?.bio || '',
      image: (selectedBlog as any)?.AuthorPicture || (selectedBlog as any)?.image || '',
      video: (selectedBlog as any)?.Video || (selectedBlog as any)?.video || '',
      banner: (selectedBlog as any)?.BlogBannerImage || (selectedBlog as any)?.banner || '',
      category: (selectedBlog as any)?.BlogCategory || (selectedBlog as any)?.category || '',
      socialLinks: (selectedBlog as any)?.socialLinks || [],
      contents: (selectedBlog as any)?.BlogContents || [],
      isPopular: (selectedBlog as any)?.IsPopular || false, // <-- add
    } : {
      title: '',
      shortDescription: '',
      authorName: '',
      authorTitle: '',
      bio: '',
      image: '',
      video: '',
      banner: '',
      category: '',
        socialLinks: [],
      contents: [],
        isPopular: false, // <-- add
    },
  });
  const { handleSubmit, register, setValue, watch, control } = methods;
  const { fields: contents, append: appendContent, remove: removeContent, update: updateContent, move: moveContent } = useFieldArray<BlogFormValues, 'contents'>({
    control,
    name: 'contents',
  });
  const { fields: socialLinks, append: appendSocial, remove: removeSocial } = useFieldArray<BlogFormValues, 'socialLinks'>({
    control,
    name: 'socialLinks',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // dropdown for adding new section type
  const [addOpen, setAddOpen] = useState(false);
  const sectionTypes = [
    { value: 'text', label: 'Content (rich text)' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'file', label: 'File/Attachment' },
  ];

  // platforms for social links
  const socialPlatforms = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'threads', label: 'Threads' },
    { value: 'orisuun', label: 'Orisuun' },
    { value: 'bluesky', label: 'Bluesky' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'other', label: 'Other' },
  ];

  // icon map for platforms
  const platformIcons: Record<string, JSX.Element> = {
    linkedin: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4zM8.5 8h3.8v2.2h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.6 4.7 6v8.6h-4V15.5c0-2.1-.04-4.8-3-4.8-3 0-3.4 2.3-3.4 4.6V24h-4z" /></svg>,
    instagram: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.4A3.6 3.6 0 1015.6 12 3.6 3.6 0 0012 8.4zM18.5 6.2a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1z" /></svg>,
    threads: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM7 9h10v2H7z" /></svg>,
    orisuun: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM4 12a8 8 0 0113.65-5.29L12 12l5.65 5.29A8 8 0 014 12z" /></svg>,
    bluesky: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>,
    twitter: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>,
    facebook: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
    other: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM4 12a8 8 0 0113.65-5.29L12 12l5.65 5.29A8 8 0 014 12z" /></svg>,
  };

  // set values when editing
  useEffect(() => {
    if (isEditing && selectedBlog) {
      setValue('title', (selectedBlog as any)?.Title || '');
      setValue('shortDescription', (selectedBlog as any)?.BlogDescription || '');
      setValue('authorName', (selectedBlog as any)?.AuthorName || '');
      setValue('authorTitle', (selectedBlog as any)?.AuthorTitle || '');
      setValue('bio', (selectedBlog as any)?.AuthorBio || '');
      setValue('image', (selectedBlog as any)?.AuthorPicture || '');
      setValue('video', (selectedBlog as any)?.video || '');
      setValue('banner', (selectedBlog as any)?.BlogBannerImage || '');
      setValue('category', (selectedBlog as any)?.BlogCategory || '');
      setValue('tags', (selectedBlog as any)?.Tags || '');
      setValue('isPopular', (selectedBlog as any)?.IsPopular || false); // <-- add
      // for socialLinks, parse the JSON string and convert object to array
      try {
        const socialLinksStr = (selectedBlog as any)?.SocialLinks || '{}';
        const socialLinksObj = JSON.parse(socialLinksStr);
        // Convert object to array format: {platform: url} -> [{platform: 'platform', url: 'url'}]
        const socialLinksArray = Object.entries(socialLinksObj).map(([platform, url]) => ({
          platform,
          url: url as string
        }));
        setValue('socialLinks', socialLinksArray);
      } catch (error) {
        console.error('Error parsing social links:', error);
        setValue('socialLinks', []);
      }
      // for contents
      setValue('contents', (selectedBlog as any)?.BlogContents || []);
      const profileImg = (selectedBlog as any)?.AuthorPicture || (selectedBlog as any)?.image;
      if (profileImg) {
        setImagePreview(profileImg);
        setValue('image', profileImg);
      }
      if ((selectedBlog as any)?.video) setVideoPreview((selectedBlog as any).video);
      if ((selectedBlog as any)?.BlogBannerImage) setBannerPreview((selectedBlog as any).BlogBannerImage);
    }
  }, [isEditing, selectedBlog, setValue]);

  // watch banner field
  const bannerField = watch('banner');
  useEffect(() => {
    if (bannerField) setBannerPreview(bannerField);
  }, [bannerField]);

  // handle banner image upload
  const handleBannerFile = async (file: File) => {
    try {
      const uploadResult = await uploadImageToAzure(file);
      if (uploadResult.success) {
        setBannerPreview(uploadResult.url || '');
        setValue('banner', uploadResult.url || '');
      } else {
        console.error('Upload failed:', uploadResult.error);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  // handle author image upload
  const handleImageFile = async (file: File) => {
    try {
      const uploadResult = await uploadImageToAzure(file);
      if (uploadResult.success) {
        setImagePreview(uploadResult.url || '');
        setValue('image', uploadResult.url || '');
      } else {
        console.error('Upload failed:', uploadResult.error);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  // handle video upload (if needed, but for now keep as is or upload if video)
  const handleVideoFile = async (file: File) => {
  // For video, you can upload similarly if the API supports it
  // For now, keep the existing base64 logic or upload
    const objectUrl = URL.createObjectURL(file);
    setVideoPreview(objectUrl);
    // If you want to upload video to Azure, use uploadImageToAzure (it works for any file)
    try {
      const uploadResult = await uploadImageToAzure(file);
      if (uploadResult.success) {
        setValue('video', uploadResult.url || '');
      }
    } catch (error) {
      console.error('Video upload error:', error);
    }
  };

  // handle content file upload
  const handleContentFile = async (file: File, index: number) => {
    try {
      const uploadResult = await uploadImageToAzure(file);
      if (uploadResult.success) {
        const ct = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file';
        updateContent(index, {
          ContentType: ct,
          Content: '',
          FileUrl: uploadResult.url || '',
          ContentFileName: file.name,
          FileSize: file.size,
          SortOrder: index,
        });
        // Set preview if image/video
        if (ct === 'image' || ct === 'video') {
          setValue(`contents.${index}.FileUrl`, uploadResult.url || '');
        }
      } else {
        console.error('Upload failed:', uploadResult.error);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const onSubmit = (data: any) => {

    const normalizedContents = (data.contents || []).map((c: any, idx: number) => ({
      ...(c.Id && { Id: c.Id }), // Include Id if it exists (for updates)
      ContentType: c.ContentType || 'text',
      Content: c.Content || '',
      FileUrl: c.FileUrl || '',
      ContentFileName: c.ContentFileName || '',
      FileSize: c.FileSize || 0,
      SortOrder: idx + 1, // Start from 1
    }));

    const socialLinksObj = {};
    const socialLinksData = data.socialLinks || [];
    
    // Handle both array and object formats
    if (Array.isArray(socialLinksData)) {
      socialLinksData.forEach((sl: any) => {
        if (sl.url) socialLinksObj[sl.platform] = sl.url;
      });
    } else if (typeof socialLinksData === 'object') {
      // If it's already an object, use it directly
      Object.assign(socialLinksObj, socialLinksData);
    }

    const payload = {
      ...(isEditing && selectedBlog?.Id && { Id: selectedBlog.Id }), // Include blog Id when editing
      Title: data.title || '',
      BlogDescription: data.shortDescription || '',
      AuthorName: data.authorName || '',
      AuthorPicture: data.image || '',
      AuthorBio: data.bio || '',
      SocialLinks: JSON.stringify(socialLinksObj),
      AuthorTitle: data.authorTitle || '',
      BlogBannerImage: data.banner || '',
      BlogCategory: data.category || '',
      Tags: data.tags || '',
      IsPopular: !!data.isPopular, // <-- add
      BlogContents: normalizedContents,
    };


    handleCreateBlog(payload);
    setIsCreatingBlog(false);
  };

  return (
    <FormProvider {...methods}>
      <div className=''>
        <h1 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Blog' : 'Create New Blog'}</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700">Author Name</label>
                <input
                  type="text"
                  {...register('authorName')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author Title</label>
                <input
                  type="text"
                  {...register('authorTitle')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Bio</label>
              <textarea
                rows={2}
                {...register('bio')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author Image</label>
                <div className="flex items-center gap-3 mt-2">
                  <div className="relative w-24 h-24 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setValue('image', '');
                        }}
                        className="absolute top-2 right-2 text-red-500"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                      className="block"
                    />
                    
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Social Links</h3>
                <div className="space-y-2">
                  {socialLinks.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <select
                        {...register(`socialLinks.${idx}.platform` as const)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        {socialPlatforms.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                      <input
                        type="url"
                        {...register(`socialLinks.${idx}.url` as const)}
                        placeholder="https://..."
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <button type="button" onClick={() => removeSocial(idx)} className="text-red-600"><Delete size={14} /></button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendSocial({ platform: 'linkedin', url: '' })}
                    className="text-sm text-blue-600"
                  >
                    + Add Social Link
                  </button>
                </div>

                {/* preview icons only when link provided */}
                <div className="flex items-center gap-3 mt-3">
                  {socialLinks.map((sl, idx) => (
                    sl.url ? (
                      <a key={idx} href={sl.url} target="_blank" rel="noreferrer" aria-label={sl.platform} className="text-gray-700">
                        {platformIcons[sl.platform] || platformIcons.other}
                      </a>
                    ) : null
                  ))}
                </div>
              </div>
              
            </div>

            {/* Blog Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Blog Banner Image</label>
              <div className="flex items-center gap-3 mt-2">
                <div className="relative w-40 h-24 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                  {bannerPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bannerPreview} alt="banner preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No banner</span>
                  )}
                  {bannerPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview(null);
                        setValue('banner', '');
                      }}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleBannerFile(file);
                    }}
                    className="block"
                  />
                </div>
              </div>
            </div>

            {/* Blog Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Blog Category</label>
              <input
                type="text"
                {...register('category')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter blog category"
              />
            </div>

            {/* IsPopular Checkbox */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('isPopular')}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Popular Blog</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="A short description or excerpt for the blog..."
                onChange={(e) => setValue('shortDescription', e.target.value)}
                {...register('shortDescription')}
              />
            </div>

            {/* Blog Sections (dynamic) */}
            <div className="bg-gray-50 border rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Blog Sections</h3>
                <div className="relative">
                  <button type="button" className="px-3 py-1 bg-white border rounded" onClick={() => setAddOpen(v => !v)}>
                    + Add section
                  </button>
                  {addOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-40">
                      {sectionTypes.map(st => (
                        <button
                          key={st.value}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          onClick={() => {
                            setAddOpen(false);
                            appendContent({
                              ContentType: st.value,
                              Content: '',
                              FileUrl: '',
                              ContentFileName: '',
                              FileSize: 0,
                              SortOrder: contents.length,
                            });
                          }}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {contents.map((item, idx) => (
                  <div key={item.id} className="border rounded p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">#{idx + 1}</span>
                        <select
                          {...register(`contents.${idx}.ContentType` as const)}
                          className="text-sm border rounded px-2 py-1"
                          value={item.ContentType}
                          onChange={(e) => updateContent(idx, { ...item, ContentType: e.target.value })}
                        >
                          <option value="text">Content (rich text)</option>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="file">File/Attachment</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => idx > 0 && moveContent(idx, idx - 1)} className="text-gray-600" title="Move up"><Move size={14} /></button>
                        <button type="button" onClick={() => idx < contents.length - 1 && moveContent(idx, idx + 1)} className="text-gray-600" title="Move down"><Move size={14} style={{ transform: 'rotate(180deg)' }} /></button>
                        <button type="button" onClick={() => removeContent(idx)} className="text-red-600 flex items-center gap-1"><Delete size={14} /> Remove</button>
                      </div>
                    </div>

                    {/* Render input based on type */}
                    {item.ContentType === 'text' && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Content</label>
                        <RichTextEditor
                          className="mt-1 w-full"
                          fieldName={`contents.${idx}.Content`}
                        />
                      </div>
                    )}

                    {(item.ContentType === 'image' || item.ContentType === 'video' || item.ContentType === 'file') && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Upload {item.ContentType}</label>
                        <input
                          type="file"
                          accept={
                            item.ContentType === 'image' ? 'image/*' :
                            item.ContentType === 'video' ? 'video/*' :
                            '*/*'
                          }
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleContentFile(file, idx);
                          }}
                        />
                        {contents[idx]?.FileUrl ? (
                          <div className="mt-2">
                            {item.ContentType === 'image' && <Image src={contents[idx].FileUrl} className="max-w-xs rounded" width={400} height={300} alt="preview" />}
                            {item.ContentType === 'video' && <video controls src={contents[idx].FileUrl} className="max-w-xs rounded bg-black" />}
                            {item.ContentType === 'file' && (
                              <div className="text-sm text-gray-700">
                                {contents[idx].ContentFileName || 'Uploaded file'} • {contents[idx].FileSize ? `${contents[idx].FileSize} bytes` : ''}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {item.ContentType === 'any' && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Content</label>
                        <input {...register(`contents.${idx}.Content` as const)} className="w-full border rounded p-2" />
                      </div>
                    )}

                  </div>
                ))}
                {contents.length === 0 && 
                  <div className="text-sm text-gray-500">No sections added yet. Click &quot;Add section&quot; to start.</div>
                }
              </div>
            </div>
            {/* end Blog Sections */}

    

            

            <div className="flex gap-4 mt-4">
              <button type="submit" className="bg-omblue-600 text-white px-4 py-2 rounded">{isEditing ? 'Save' : 'Create'}</button>
              <button type="button" onClick={() => setIsCreatingBlog(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default CreateBlog;