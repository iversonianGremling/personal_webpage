import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../types';
import DOMPurify from 'dompurify';
import { apiUrl } from '../assets/env-var';
import MetadataSearch from './MetadataSearch';

const CreateRecommendation: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    image: '',
    type: 'recommendation',
    visibility: 'public',
    author: '',
    country: '',
    year: '',
    themes: '',
    quality: 'q0',
  });


  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [contentType, setContentType] = useState<'Text' | 'HTML'>('Text');
  const qualitySymbols = ['Ω','∀','א','∞','⧜','✓'];
  const qualityText = ['Masterpiece', 'Indispensable', 'Medium defining', 'Cult classic', 'Worth experiencing', 'Check it out eventually'];
  const qualityTags = ['q5', 'q4', 'q3', 'q2', 'q1', 'q0'];
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setErrorMessage('');

    try {
    // Validate file before upload
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(apiUrl + '/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include', // For cookies/auth
        // Let browser set Content-Type automatically
        headers: {
          Accept: 'application/json',
        // Add CSRF token if needed:
        // 'X-CSRF-TOKEN': getCsrfTokenFromCookie()
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Upload failed (HTTP ${response.status})`);
      }

      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'Upload failed';
      setErrorMessage(message);
      throw error; // Re-throw for calling code
    } finally {
      setIsUploading(false);
    }
  };

  const addImage = () => {
    if (!editor) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      try {
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed (JPEG, PNG, GIF)');
        }

        const url = await handleImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to insert image',
        );
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Always include recommendation tag (even if user deletes it)
    const postTags = formData.tags.split(',')
      .map((tag) => tag.trim())
      .filter(tag => tag.length > 0);

    // Ensure recommendation tag is included
    if (!postTags.includes('recommendation')) {
      postTags.push('recommendation');
    }

    // Add prefixed author, country, and year tags
    postTags.push(`author:${formData.author}`, `country:${formData.country}`, `year:${formData.year}`);

    // Add themes without prefix
    postTags.push(...formData.themes.split(',').map((theme) => theme.trim()).filter(theme => theme.length > 0));

    // Add quality tag (q5, q4, etc.)
    postTags.push(formData.quality);

    const post: Partial<Post> = {
      title: formData.title,
      content: formData.content,
      tags: postTags,
      image: formData.image,
      type: 'recommendation', // Always recommendation
      visibility: formData.visibility === 'public' ? 'public' : 'private',
    };

    try {
      const response = await fetch(apiUrl + '/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to create post: ${response.statusText}`,
        );
      }

      navigate('/');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create post',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSelect = async (mediaData: {
    title: string;
    author: string;
    country: string;
    year: string;
    themes: string;
    image?: string;
  }) => {
    // First, update the form data with the media metadata
    setFormData(prev => ({
      ...prev,
      title: mediaData.title,
      author: mediaData.author,
      country: mediaData.country,
      year: mediaData.year,
      themes: mediaData.themes,
    }));
    
    // If there's an image URL, handle it
    if (mediaData.image) {
      try {
        setIsUploading(true);
        setErrorMessage(null);
        
        // Fetch the image as a blob
        const imageResponse = await fetch(mediaData.image);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
        }
        
        // Convert the response to a blob
        const imageBlob = await imageResponse.blob();
        
        // Create a File object from the blob
        const fileName = `${mediaData.title.replace(/\s+/g, '-')}.jpg`;
        const imageFile = new File([imageBlob], fileName, {
          type: imageBlob.type || 'image/jpeg'
        });
        
        // Upload the image using the existing upload function
        const uploadedImageUrl = await handleImageUpload(imageFile);
        
        // Update the form data with the image URL
        setFormData(prev => ({
          ...prev,
          image: uploadedImageUrl
        }));
        
        // Add the image to the content based on the active editor mode
        if (contentType === 'HTML') {
          // For HTML mode, directly append image HTML to content
          const imageHtml = `<figure class="image-container">
    <img src="${uploadedImageUrl}" alt="${mediaData.title}" class="recommendation-image" />
    <figcaption>${mediaData.title} (${mediaData.year})</figcaption>
  </figure>`;
          
          setFormData(prev => ({
            ...prev,
            content: prev.content ? prev.content + imageHtml : imageHtml
          }));
        } else if (editor) {
          // For text mode with TipTap editor
          editor.chain().focus().setImage({ 
            src: uploadedImageUrl, 
            alt: mediaData.title 
          }).run();
        }
        
        console.log('Media selected and image added:', mediaData.title);
      } catch (error) {
        console.error('Error processing image:', error);
        setErrorMessage(
          error instanceof Error 
            ? `Error processing image: ${error.message}` 
            : 'Failed to process the image'
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  const createMarkup = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex justify-center items-center p-4">
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-700 p-4 rounded-lg flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Uploading image...</span>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png, image/gif"
        onChange={handleFileChange}
      />

      <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Recommendation</h2>

        {errorMessage && (
          <p className="mb-4 text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className='flex flex-row gap-2'>
              <button type='button' className={`${contentType === 'Text' ? 'bg-slate-600' : 'bg-slate-700'} bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600`} onClick={() => setContentType('Text')} > Text </button>
              <button type='button' className={`${contentType === 'HTML' ? 'bg-slate-600' : 'bg-slate-700'} bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600`} onClick={() => setContentType('HTML')}> HTML </button>
            </div>
            {contentType === 'Text' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Content</label>
                <div className="bg-gray-600 rounded-lg p-4 min-h-[300px]">
                  {editor && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded ${
                          editor.isActive('bold') ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                      >
                      Bold
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleItalic().run()
                        }
                        className={`p-2 rounded ${
                          editor.isActive('italic')
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                        }`}
                      >
                      Italic
                      </button>
                      <button
                        type="button"
                        onClick={addImage}
                        className="p-2 rounded bg-gray-500"
                      >
                      Image
                      </button>
                    </div>
                  )}
                  <EditorContent
                    editor={editor}
                    className="prose prose-invert max-w-none min-w-36 focus:outline-none text-white text-editor-preview"
                    style={{ minHeight: '20rem', padding: '10px' }}
                  />
                </div>
              </div>

            ) : (
              <div className='mb-4'>
                <label>HTML</label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full h-64 px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  maxLength={2000}
                />

              </div>
            )}

            <div className="mb-4">
              <label htmlFor="quality" className="block text-sm font-medium mb-1">
                Quality Rating
              </label>
              <select
                id="quality"
                value={formData.quality}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {qualitySymbols.map((symbol, index) => (
                  <option key={index} value={qualityTags[index]}>
                    {`${symbol}-${qualityText[index]}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label>Tags</label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label>Author</label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label>Country</label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label>Year</label>
              <input
                type="text"
                id="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label>Themes</label>
              <input
                type="text"
                id="themes"
                value={formData.themes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="visibility"
                className="block text-sm font-medium mb-1"
              >
                Visibility
              </label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? 'Submitting...' : 'Create Post'}
            </button>
          </form>

          {/* Replace ImageSearch with MediaSearch */}
          <MetadataSearch onSelectMedia={handleMediaSelect} />
        </div>

      </div>
    </div>
  );
};

export default CreateRecommendation;
