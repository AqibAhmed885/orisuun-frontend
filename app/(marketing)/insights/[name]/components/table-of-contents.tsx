import { cn } from "@/utils/utils";
import React from "react";

const stripHtml = (value: string = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (value: string = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const TableOfContents = ({ content }) => {

// Extract headings from all text content blocks.
  const extractHeadings = (html: string) => {
    const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    const headings = [] as Array<{ level: number; text: string; id: string }>;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const text = stripHtml(match[2] || '');
      if (!text) continue;
      headings.push({
        level: parseInt(match[1], 10),
        text,
        id: slugify(text),
      });
    }

    return headings;
  };

  const contentBlocks = Array.isArray(content) ? content : [];
  const headings = contentBlocks.flatMap((block: any) =>
    extractHeadings(typeof block?.Content === 'string' ? block.Content : '')
  );


  return (
    <div
      className={cn(
        "xl:sticky xl:top-32 xl:h-fit xl:right-0",
        "w-[350px]",
        "p-6 space-y-4 rounded-xl border bg-white",
        "mr-4 mt-4 xl:mr-0 xl:mt-0"
      )}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-blue-strong">
          Table of Content
        </h3>
      </div>
      <ul className="list-decimal list-inside text-nav-blue leading-6 font-semibold space-y-3">
        {headings.map((heading, index) => (
          <li key={index} style={{ marginLeft: `${(heading.level - 1) * 20}px` }}>
            <a href={`#${heading.id}`} className="hover:underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
