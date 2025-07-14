// Utility function to strip HTML tags and get plain text
export const stripHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// Utility function to get preview text from HTML content
export const getPreviewText = (html, maxLength = 120) => {
  if (!html) return '';
  
  const plainText = stripHtmlTags(html);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength) + '...';
};

// Utility function to safely render HTML content
export const createMarkup = (html) => {
  return { __html: html };
};

// Utility function to get word count from HTML
export const getWordCount = (html) => {
  if (!html) return 0;
  
  const plainText = stripHtmlTags(html);
  return plainText.split(/\s+/).filter(word => word.length > 0).length;
};

// Utility function to get estimated reading time
export const getReadingTime = (html) => {
  if (!html) return 0;
  
  const wordCount = getWordCount(html);
  const wordsPerMinute = 200; // Average reading speed
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return readingTime;
};
