/**
 * Reads Markdown headings the way GitHub does, for the tests that check links
 * and anchors.
 */

// Blanks front matter and fenced code blocks, keeping line numbers.
export const withoutCodeBlocks = (text: string): string => {
  const lines = text.split('\n');
  let fence: string | undefined;
  return lines
    .map((line, index) => {
      if (index === 0 && line === '---') {
        fence = '---';
        return '';
      }
      if (fence === '---') {
        if (line === '---') fence = undefined;
        return '';
      }
      const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
      if (fence === undefined) {
        if (marker !== undefined) fence = marker;
        return marker === undefined ? line : '';
      }
      if (
        marker !== undefined &&
        marker[0] === fence[0] &&
        marker.length >= fence.length &&
        /^\s*[`~]+\s*$/.test(line)
      ) {
        fence = undefined;
      }
      return '';
    })
    .join('\n');
};

// The anchor GitHub gives a heading, before duplicates get a numeric suffix.
const headingSlug = (heading: string): string =>
  heading
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');

/** Each heading's text and the anchor that GitHub gives it, in order. */
export const headingsOf = (
  text: string
): { text: string; anchor: string }[] => {
  const headings: { text: string; anchor: string }[] = [];
  const anchors = new Set<string>();
  for (const line of withoutCodeBlocks(text).split('\n')) {
    const heading = /^ {0,3}#{1,6}[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/.exec(line);
    if (heading === null) continue;
    const base = headingSlug(heading[1]);
    let anchor = base;
    for (let suffix = 1; anchors.has(anchor); suffix += 1) {
      anchor = `${base}-${suffix}`;
    }
    anchors.add(anchor);
    headings.push({ text: heading[1], anchor });
  }
  return headings;
};

export const anchorsOf = (text: string): Set<string> =>
  new Set(headingsOf(text).map(({ anchor }) => anchor));
