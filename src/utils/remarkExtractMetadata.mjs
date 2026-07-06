import { visit } from 'unist-util-visit';

function extractText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value || '';
  }
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}

export function remarkExtractMetadata() {
  return (tree, file) => {
    let firstImage = null;
    let summary = null;

    visit(tree, 'image', (node) => {
      if (!firstImage && node.url) {
        firstImage = node.url;
      }
    });

    visit(tree, 'paragraph', (node) => {
      if (!summary) {
        // Collect text from paragraph
        const text = extractText(node).trim();
        
        // Ensure it's not empty and not an image marker or HTML
        if (text.length > 0 && !text.startsWith('!') && !text.startsWith('<')) {
          let truncated = text;
          if (truncated.length > 160) {
            truncated = truncated.substring(0, 157).trim() + '...';
          }
          summary = truncated;
        }
      }
    });

    // Inject into frontmatter
    file.data.astro = file.data.astro || {};
    file.data.astro.frontmatter = file.data.astro.frontmatter || {};
    file.data.astro.frontmatter.summary = summary;
    file.data.astro.frontmatter.heroImage = file.data.astro.frontmatter.heroImage || firstImage;
  };
}
