import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../types';
import DOMPurify from 'dompurify';
import { apiUrl } from '../assets/env-var';
import PostDetail from './PostDetail';
import PostDetailPreview from './PostDetailPreview';
import ImageSearch from './ImageSearch';

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: 'recommendation',
    image: '',
    type: 'recommendation',
    visibility: 'public',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [contentType, setContentType] = useState<'Text' | 'HTML'>('Text');
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

    const post: Partial<Post> = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
      image: formData.image,
      type: formData.type,
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
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Post Type
              </label>
              <select
                id="type"
                value={formData.type}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="recommendation">Recommendation</option>
              </select>
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
          <ImageSearch/>
        </div>

      </div>
    </div>
  );
};

export default CreatePost;
