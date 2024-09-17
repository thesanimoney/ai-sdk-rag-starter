import React from 'react';
import SqlWrapper from "@/components/sql-wrapper";

// Function to convert markdown-like text to HTML
const convertToHTML = (text: string) => {
  // Convert headers (### for h3)
  let html = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');

  // Convert bold text (**text**)
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Convert new lines to <br /> or wrap in <p> tags for paragraphs
  html = html.replace(/\n/gim, '<br />');

  // Optional: Convert list items (- item)
  html = html.replace(/- (.*$)/gim, '<li>$1</li>');

  // Optional: Wrap list items in <ul> tags
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

  return html.trim();
};

export const DynamicTextRenderer = ({ text }: {text: string }) => {
  const htmlContent = convertToHTML(text);
  if (text.startsWith('```sql')) {
    let sqlText = text.replace('```sql', '')
    return <SqlWrapper code={sqlText}/>
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};



