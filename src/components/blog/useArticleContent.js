import { useMemo } from 'react';

/*
 * Prepares a post's stored HTML for reading.
 *
 * The bodies are WordPress block markup captured verbatim from the reference
 * site — static authored content, not user input — so they are parsed once with
 * `DOMParser` rather than hand-rolled regexes, and four things come back:
 *
 *   lead     the opening paragraph, lifted out of the body so it can be set as
 *            a standfirst. Leaving it in place and repeating it above would
 *            print the same sentence twice.
 *   html     the remaining body, with every heading given a stable id so the
 *            contents rail can link to it.
 *   headings the rail's entries.
 *   minutes  reading time at 200 words per minute, derived from the text that
 *            is actually there.
 *
 * Parsing happens in a memo keyed on the raw HTML, so it runs once per article.
 */

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

export default function useArticleContent(rawHtml) {
  return useMemo(() => {
    if (!rawHtml) return { lead: '', html: '', headings: [], minutes: 1, words: 0 };

    const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
    const body = doc.body;

    // The reference markup ends with an empty paragraph on every post.
    body.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
    });

    const words = (body.textContent || '').trim().split(/\s+/).filter(Boolean).length;

    const firstParagraph = body.querySelector('p');
    const lead = firstParagraph?.textContent?.trim() ?? '';
    if (firstParagraph) firstParagraph.remove();

    const headings = [];
    const used = new Set();

    body.querySelectorAll('h2, h3').forEach((heading, i) => {
      const text = heading.textContent.trim();
      let id = slugify(text) || `section-${i + 1}`;

      // Two headings can slugify to the same string; keep ids unique.
      let n = 2;
      while (used.has(id)) id = `${slugify(text)}-${n++}`;
      used.add(id);

      heading.id = id;
      headings.push({ id, text, level: Number(heading.tagName[1]) });
    });

    return {
      lead,
      html: body.innerHTML,
      headings,
      words,
      minutes: Math.max(1, Math.round(words / 200)),
    };
  }, [rawHtml]);
}
