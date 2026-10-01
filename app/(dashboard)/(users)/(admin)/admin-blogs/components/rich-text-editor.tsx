import { useCallback, useRef, useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import clsx from 'clsx';
import BoldIcon from '@/icons/fundraising/bold-icon';
import ItalicIcon from '@/icons/fundraising/italic-icon';
import UnderlineIcon from '@/icons/fundraising/underline-icon';
import UnorderedListIcon from '@/icons/fundraising/unordered-list';
import OrderedListIcon from '@/icons/fundraising/ordered-list';
import LinkIcon from '@/icons/fundraising/link-icon';
import ImageIcon from '@/icons/fundraising/image-icon';
import CodeIcon from '@/icons/fundraising/code-icon';
import AlignmentIcon from '@/icons/fundraising/alignment-icon';
import ChevronDownLg from '@/icons/chevron-down-lg';
import { useFormContext } from 'react-hook-form';
import TextStyle from '@tiptap/extension-text-style';
import Dropdown from '@/components/ui/dropdown';

const alignments = [
  { value: 'left', iconClass: '' },
  { value: 'center', iconClass: 'rotate-90' },
  { value: 'right', iconClass: 'rotate-180' },
];

const RichTextEditor = ({
  className,
  fieldName = 'shortDescription',
}: {
  className?: string;
  fieldName?: string; 
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    control,
    watch,
    getValues,
    clearErrors,
  } = useFormContext();

  const [htmlView, setHtmlView] = useState(false);
  const [color, setColor] = useState('#000000');
  const [selectedAlignment, setSelectedAlignment] = useState(alignments[0]);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
      Image,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Underline,
    ],
    content: '',
    immediatelyRender: false, // Fix SSR hydration error
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue(fieldName, html);
    },
  });

  // Sync editor content with form value
  const currentValue = watch(fieldName);
  useEffect(() => {
    if (editor && currentValue !== undefined && currentValue !== null) {
      const editorContent = editor.getHTML();
      // Only update if the content is different to avoid infinite loops
      if (editorContent !== currentValue) {
        editor.commands.setContent(currentValue);
      }
    }
  }, [editor, currentValue, fieldName]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      const uploadImage = async (file: File): Promise<string> => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return URL.createObjectURL(file)
      }

      try {
        const imageUrl = await uploadImage(file)
        editor.chain().focus().setImage({ src: imageUrl }).run()
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    },
    [editor],
  )

  if (!editor) return null;

  const toggleHtmlView = () => setHtmlView(!htmlView);
  const value = watch(fieldName);

  return (
    <div className="flex flex-col gap-2 relative">
      <div
        className={`bg-white border relative ${
          errors[fieldName] ? 'border-red-500' : 'border-black-200'
        } rounded w-full ${className}`}
      >
        <div className="flex p-2 flex-wrap items-center border-b border-b-black-200 gap-1.5 mb-4">
          <select
            className="text-center w-full max-w-[98px] h-7 text-sm"
            onChange={(e) => {
              const level = Number.parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 })
                  .run();
              }
            }}
          >
            <option value="0">Normal Text</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>

          {/* Text Alignment */}
          <Dropdown
            items={alignments}
            selected={selectedAlignment}
            onSelect={(item) => {
              setSelectedAlignment(item);
              editor.chain().focus().setTextAlign(item.value).run();
            }}
            renderItem={(item) => (
              <div className="flex items-center">
                <AlignmentIcon className={item.iconClass} />
              </div>
            )}
            className="w-[50px] h-7 gap-4 p-0 border-none"
            iconSize="w-4 h-4"
            border={false}
            wrapperClass="!p-0 !h-7 gap-2 !justify-center"
          />

          {/* Color Picker */}
          <div className="flex items-center justify-center gap-1 w-[50px] h-[28px]">
            <input
              ref={colorInputRef}
              type="color"
              value={color}
              className="w-8 h-7 cursor-pointer border border-black-200 rounded"
              onChange={(e) => {
                const newColor = e.target.value;
                setColor(newColor);
                editor.chain().focus().setColor(newColor).run();
              }}
            />
            <ChevronDownLg
              className="min-w-4 h-4 rotate-180 cursor-pointer"
              onClick={() => colorInputRef.current?.click()}
            />
          </div>

          {/* Formatting Buttons */}
          <div className="flex gap-0.5 items-center">
            <button
              type="button" // Add this
              className={clsx(
                'flex items-center justify-center w-7 h-7',
                editor.isActive('bold') && 'bg-gray-300'
              )}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <BoldIcon />
            </button>

            <button
              type="button" // Add this
              className={clsx(
                'flex items-center justify-center w-7 h-7',
                editor.isActive('italic') && 'bg-gray-300'
              )}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <ItalicIcon />
            </button>

            <button
              type="button" // Add this
              className={clsx(
                'flex items-center justify-center w-7 h-7',
                editor.isActive('underline') && 'bg-gray-300'
              )}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon />
            </button>
          </div>

          {/* List Buttons */}
          <div className="flex gap-0.5 items-center">
            <button
              type="button" // Add this
              className={clsx(
                'flex items-center justify-center w-7 h-7',
                editor.isActive('bulletList') && 'bg-gray-300'
              )}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <UnorderedListIcon />
            </button>

            <button
              type="button" // Add this
              className={clsx(
                'flex items-center justify-center w-7 h-7',
                editor.isActive('orderedList') && 'bg-gray-300'
              )}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <OrderedListIcon />
            </button>
          </div>

          {/* Link and Image Buttons */}
          <div className="flex gap-0.5 items-center">
            <button
              type="button" // Add this
              className="flex items-center justify-center w-7 h-7"
              onClick={() => {
                const previousUrl = editor.getAttributes('link').href;
                const url = window.prompt('Enter URL', previousUrl);

                if (url === null) {
                  return; // Cancelled
                }

                if (url === '') {
                  editor.chain().focus().unsetLink().run();
                  return;
                }

                editor.chain().focus().setLink({ href: url }).run();
              }}
            >
              <LinkIcon />
            </button>

            <label className="flex items-center justify-center w-7 h-7 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
              <ImageIcon />
            </label>

            <button
              type="button" // Add this
              className="flex items-center justify-center w-7 h-7"
              onClick={toggleHtmlView}
            >
              {htmlView ? <CodeIcon /> : <CodeIcon />}
            </button>
          </div>
        </div>

        {htmlView ? (
          <textarea
            className="w-full min-h-[200px] p-4 border-0 focus:outline-none"
            value={editor.getHTML()}
            onChange={(e) => {
              editor.commands.setContent(e.target.value);
              setValue(fieldName, e.target.value);
            }}
          />
        ) : (
          <EditorContent
            editor={editor}
            className="p-4 bg-white min-h-[200px] prose prose-sm max-w-none focus:outline-none"
          />
        )}
      </div>
      {errors[fieldName]?.message && (
        <span className="text-red-500 font-medium absolute bottom-1 left-2">
          {String(errors[fieldName]?.message)}
        </span>
      )}
    </div>
  );
};

export default RichTextEditor;
