import React from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useCallback, useState, useRef } from 'react';
import 'highlight.js/styles/atom-one-dark.css';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}


const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange, onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CustomMarkdownShortcuts = Extension.create({
    name: 'customMarkdownShortcuts',

    addKeyboardShortcuts() {
      return {
        'Space': ({ editor }) => {
          const { state } = editor;
          const { selection } = state;
          const { $head } = selection;

          // Get current line text
          const lineText = $head.parent.textContent;

          // Match #Header pattern (without space)
          const headingMatch = lineText.match(/^(#{1,6})([^\s].*)/);
          if (headingMatch && $head.parent.type.name === 'paragraph') {
            const level = Math.min(6, Math.max(1, headingMatch[1].length)) as 1|2|3|4|5|6;
            editor.chain().focus().setHeading({ level }).run();
            return true;
          }

          return false;
        }
      };
    }
  });

  const CustomHeadingExtension = Extension.create({
    name: 'customHeadingHandler',

    addKeyboardShortcuts() {
      return {
      };
    }
  });

  const CustomShortcutExtension = Extension.create({
    name: 'customShortcuts',

    addKeyboardShortcuts() {
      return {
        'Space': ({ editor }) => {
          const text = editor.state.doc.textBetween(
            editor.state.selection.$from.start(),
            editor.state.selection.$from.pos,
            ''
          );

          const headingMatch = text.match(/^(#{1,6})([^\s])/);
          if (headingMatch) {
          // Convert to valid heading level (1-6)
            const level = Math.min(6, Math.max(1, headingMatch[1].length)) as 1|2|3|4|5|6;

            editor.chain()
              .focus()
              .deleteRange({
                from: editor.state.selection.$from.start(),
                to: editor.state.selection.$from.start() + headingMatch[1].length
              })
              .setHeading({ level })
              .run();
            return true;
          }

          return false;
        }
      };
    }
  });

  const KeepHeadingFormat = Extension.create({
    name: 'keepHeadingFormat',

    addKeyboardShortcuts() {
      return {
        'Shift-Enter': ({ editor }) => {
          if (editor.isActive('heading')) {
          // Instead of just inserting '\n', we'll insert a proper <br> tag
            editor.chain().focus().insertContent('<br>').run();
            return true;
          }
          return false;
        },
        'Enter': ({ editor }) => {
          if (editor.isActive('heading')) {
            const level = editor.getAttributes('heading').level;

            // First create a new paragraph below
            editor.chain().focus().insertContentAt(editor.state.selection.to, '<p></p>').run();

            // Then move cursor to it
            const pos = editor.state.selection.to + 1;
            editor.chain().focus().setTextSelection(pos).run();

            return true;
          }
          return false;
        }
      };
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'editor-heading',
          },
          // Configure custom markdown shortcut parsing
        },
      },
      ),
      Image.configure({
        allowBase64: false,
        inline: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing... Use # for headings, > for quotes, * for lists',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      CustomMarkdownShortcuts,
      CustomHeadingExtension,
      CustomShortcutExtension,
      KeepHeadingFormat
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none text-white p-2 min-h-[20rem]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });


  const addImage = useCallback(() => {
    if (!editor) return;
    fileInputRef.current?.click();
  }, [editor]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      setIsUploading(true);
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
      // Clear input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addCodeBlock = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  const addBlockquote = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const addHorizontalRule = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  const addOrderedList = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const addBulletList = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Content</label>
      <div className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
        {/* Toolbar */}
        <div className="bg-gray-800 p-2 border-b border-gray-600">
          <div className="flex flex-wrap gap-2">
            {/* Text Formatting */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('bold') ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Bold (Ctrl+B)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                  <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('italic') ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Italic (Ctrl+I)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="4" x2="10" y2="4"></line>
                  <line x1="14" y1="20" x2="5" y2="20"></line>
                  <line x1="15" y1="4" x2="9" y2="20"></line>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('strike') ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Strikethrough"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="17" y1="7" x2="10" y2="18"></line>
                  <line x1="7" y1="7" x2="14" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600 mx-1"></div>

            {/* Headings */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('heading', { level: 1 }) ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Heading 1 (# )"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Heading 2 (## )"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('heading', { level: 3 }) ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Heading 3 (### )"
              >
                H3
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600 mx-1"></div>

            {/* Lists */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={addBulletList}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('bulletList') ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Bullet List (* )"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button
                type="button"
                onClick={addOrderedList}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('orderedList') ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Numbered List (1. )"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="10" y1="6" x2="21" y2="6"></line>
                  <line x1="10" y1="12" x2="21" y2="12"></line>
                  <line x1="10" y1="18" x2="21" y2="18"></line>
                  <path d="M4 6h1v4"></path>
                  <path d="M4 10h2"></path>
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                </svg>
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600 mx-1"></div>

            {/* Media and blocks */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={addCodeBlock}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('codeBlock') ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Code Block (``` )"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={addBlockquote}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive('blockquote') ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Quote (> )"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={addHorizontalRule}
                className="p-2 rounded hover:bg-gray-600 bg-gray-700"
                title="Horizontal Line (--- )"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                type="button"
                onClick={addImage}
                className={`p-2 rounded hover:bg-gray-600 bg-gray-700 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Insert Image"
                disabled={isUploading}
              >
                {isUploading ? (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeDasharray="32" strokeDashoffset="8" fill="none" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="h-6 w-px bg-gray-600 mx-1"></div>

            {/* Text alignment */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Align Left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Align Center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="10" x2="6" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="18" y1="18" x2="6" y2="18"></line>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-600 ${
                  editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                title="Align Right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="10" x2="7" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="21" y1="18" x2="7" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />

        {/* Help text */}
        <div className="p-2 bg-gray-800 text-xs text-gray-400 border-t border-gray-600">
          <div>Tips:</div>
          <div>• Type # followed by space for H1, ## for H2, etc.</div>
          <div>• Type {'>'} for blockquote, * for bullets, 1. for numbered lists</div>
          <div>• Type ``` for code blocks</div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
