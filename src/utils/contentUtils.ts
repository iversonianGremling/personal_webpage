// src/utils/contentUtils.ts
import DOMPurify from "dompurify";

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a"],
    ALLOWED_ATTR: ["href", "target"],
  });
};

export const truncateHTMLContent = (
  html: string,
  maxLength: number = 150,
): string => {
  const cleanText = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  const truncated = cleanText.slice(0, maxLength);
  return truncated + (cleanText.length > maxLength ? "..." : "");
};
