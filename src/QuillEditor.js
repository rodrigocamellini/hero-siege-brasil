import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function QuillEditor({ value, onChange, placeholder, modules }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isInternalChange = useRef(false);

  // Initialize Quill
  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const editor = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder: placeholder || 'Escreva aqui...',
      modules: modules || {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      },
    });

    quillRef.current = editor;

    // Handle changes
    editor.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        isInternalChange.current = true;
        const html = editor.root.innerHTML;
        // Quill sets innerHTML to <p><br></p> when empty
        onChange(html === '<p><br></p>' ? '' : html);
      }
    });

  }, []); // Run once on mount

  // Update content if value changes externally
  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const editor = quillRef.current;
      
      if (isInternalChange.current) {
          isInternalChange.current = false;
          return;
      }

      const currentContent = editor.root.innerHTML;
      const normalizedCurrent = currentContent === '<p><br></p>' ? '' : currentContent;
      
      if (value !== normalizedCurrent) {
          const delta = editor.clipboard.convert(value);
          editor.setContents(delta, 'silent');
      }
    }
  }, [value]);

  return <div ref={containerRef} style={{ minHeight: '300px', backgroundColor: 'white', color: 'black' }} />;
}
