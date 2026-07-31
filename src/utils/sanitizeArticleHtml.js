/**
 * sanitizeArticleHtml.js
 * ─────────────────────────────────────────────
 * Auto-cleans, formats, AND restructures article HTML content.
 *
 * What it does:
 *  1. Strip ALL inline styles (color, font-size, font-family, background, etc.)
 *  2. Remove empty tags & excessive <br>
 *  3. Remove non-semantic wrapper spans/divs (Google Docs / Word garbage)
 *  4. Normalize whitespace & spacing
 *  5. Preserve semantic tags: <strong>, <em>, <a>, <img>, <video>, <h2-h6>, <ul>, <ol>, <li>, <blockquote>, <hr>, <table>, <pre>, <code>
 *  6. AUTO-PARAGRAPH: Split flat text into proper <p> paragraphs
 *  7. Clean up link targets (add target="_blank" to external links)
 *  8. Remove tracking/analytics attributes (data-*, onclick, etc.)
 *  9. Ensure images have lazy loading
 */

// Tags to completely remove (including their content) — must have a real closing tag
const TAGS_TO_REMOVE_WITH_CONTENT = ["script", "style", "noscript", "head", "title"];

// Void/self-closing junk tags that never have a matching closing tag (can't use the regex above)
const VOID_TAGS_TO_STRIP = ["meta", "link", "base"];

// Matches an attribute value whether it's "quoted", 'quoted', or bare/unquoted (common in Word HTML export)
const ATTR_VALUE = `(?:"[^"]*"|'[^']*'|[^\\s>]+)`;

/**
 * Main sanitize function
 * @param {string} html - Raw HTML string from editor or paste
 * @returns {{ html: string, changes: string[] }} - Cleaned HTML + list of changes made
 */
export function sanitizeArticleHtml(html) {
  if (!html || typeof html !== "string") return { html: "", changes: [] };

  const changes = [];
  let result = html;

  // ── 1. Remove dangerous/meta tags with their content ──
  for (const tag of TAGS_TO_REMOVE_WITH_CONTENT) {
    const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    if (regex.test(result)) {
      changes.push(`Menghapus tag <${tag}>`);
      result = result.replace(regex, "");
    }
  }

  // ── 2. Remove HTML comments (incl. Word/Office conditional <!--[if ...]><xml>...) ──
  if (/<!--[\s\S]*?-->/.test(result)) {
    changes.push("Menghapus komentar HTML");
    result = result.replace(/<!--[\s\S]*?-->/g, "");
  }

  // ── 2b. Remove void junk tags that never have a closing tag (<meta>, <link>, <base>) ──
  for (const tag of VOID_TAGS_TO_STRIP) {
    const regex = new RegExp(`<${tag}\\b[^>]*>`, "gi");
    if (regex.test(result)) {
      changes.push(`Menghapus tag <${tag}>`);
      result = result.replace(regex, "");
    }
  }

  // ── 2c. Unwrap Word/Office XML-namespaced tags (<o:p>, <w:sdt>, <m:oMath>, dll.) ──
  if (/<\/?[a-zA-Z]+:[a-zA-Z0-9]+/.test(result)) {
    changes.push("Membersihkan tag XML Word (o:p, w:sdt, dll.)");
    let prevNs = "";
    while (prevNs !== result) {
      prevNs = result;
      // Paired namespaced tags → unwrap, keep inner content
      result = result.replace(/<([a-zA-Z]+:[a-zA-Z0-9]+)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi, "$2");
    }
    // Any remaining self-closing/unpaired namespaced tags → drop the tag itself
    result = result.replace(/<\/?[a-zA-Z]+:[a-zA-Z0-9]+(?:\s[^>]*)?\/?>/gi, "");
  }

  // ── 3. Strip ALL inline style attributes ──
  if (new RegExp(`\\sstyle\\s*=\\s*${ATTR_VALUE}`, "i").test(result)) {
    changes.push("Menghapus semua inline style (warna, font, ukuran, dll.)");
    result = result.replace(new RegExp(`\\sstyle\\s*=\\s*${ATTR_VALUE}`, "gi"), "");
  }

  // ── 4. Strip class attributes (except on img/video for editor classes) ──
  if (new RegExp(`\\sclass\\s*=\\s*${ATTR_VALUE}`, "i").test(result)) {
    changes.push("Menghapus class CSS bawaan copas");
    result = result.replace(
      new RegExp(`(<(?!img|video)[^>]*?)\\sclass\\s*=\\s*${ATTR_VALUE}`, "gi"),
      "$1"
    );
  }

  // ── 5. Strip event handler attributes (onclick, onmouseover, etc.) ──
  if (new RegExp(`\\son\\w+\\s*=\\s*${ATTR_VALUE}`, "i").test(result)) {
    changes.push("Menghapus event handler (onclick, dll.)");
    result = result.replace(new RegExp(`\\son\\w+\\s*=\\s*${ATTR_VALUE}`, "gi"), "");
  }

  // ── 6. Strip data-* attributes ──
  if (new RegExp(`\\sdata-[\\w-]+\\s*=\\s*${ATTR_VALUE}`, "i").test(result)) {
    changes.push("Menghapus data attributes");
    result = result.replace(new RegExp(`\\sdata-[\\w-]+\\s*=\\s*${ATTR_VALUE}`, "gi"), "");
  }

  // ── 7. Strip id attributes ──
  if (new RegExp(`\\sid\\s*=\\s*${ATTR_VALUE}`, "i").test(result)) {
    changes.push("Menghapus id attributes");
    result = result.replace(new RegExp(`\\sid\\s*=\\s*${ATTR_VALUE}`, "gi"), "");
  }

  // ── 8. Unwrap non-semantic <span> tags (keep content) ──
  if (/<span[^>]*>/i.test(result)) {
    changes.push("Membersihkan tag <span> sampah (Google Docs / Word)");
    let prev = "";
    while (prev !== result) {
      prev = result;
      result = result.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1");
    }
  }

  // ── 9. Convert <b> → <strong>, <i> → <em> (semantic HTML) ──
  if (/<b(\s|>)/i.test(result)) {
    changes.push("Mengkonversi <b> → <strong>");
    result = result.replace(/<b(\s[^>]*)?\s*>/gi, "<strong$1>");
    result = result.replace(/<\/b>/gi, "</strong>");
  }
  if (/<i(\s|>)/i.test(result) && !/<i(mg|frame)/i.test(result)) {
    changes.push("Mengkonversi <i> → <em>");
    result = result.replace(/<i(\s[^>]*)?\s*>/gi, "<em$1>");
    result = result.replace(/<\/i>/gi, "</em>");
  }

  // ── 10. Unwrap non-semantic <div> wrappers → convert to <p> ──
  // Replace <div> that don't contain block elements with <p>
  if (/<div[^>]*>/i.test(result)) {
    const blockTags = "p|h[1-6]|ul|ol|li|blockquote|table|thead|tbody|tr|td|th|figure|pre|hr|iframe|video|img";
    // Simple divs that only contain inline content → convert to <p>
    let prevDiv = "";
    while (prevDiv !== result) {
      prevDiv = result;
      result = result.replace(
        new RegExp(`<div[^>]*>((?:(?!<(?:${blockTags})[\\s>])[\\s\\S])*?)<\\/div>`, "gi"),
        (match, inner) => {
          const trimmed = inner.replace(/&nbsp;/gi, " ").trim();
          if (!trimmed) return "";
          return `<p>${trimmed}</p>`;
        }
      );
    }
    changes.push("Mengkonversi <div> → paragraf yang rapi");
  }

  // ── 11. Remove &nbsp; at start/end of paragraphs + standalone &nbsp; ──
  if (/&nbsp;/i.test(result)) {
    changes.push("Menghapus spasi &nbsp; berlebih");
    result = result.replace(/(<p[^>]*>)\s*(&nbsp;\s*)+/gi, "$1");
    result = result.replace(/(&nbsp;\s*)+\s*(<\/p>)/gi, "$2");
    // Replace remaining &nbsp; with normal spaces
    result = result.replace(/&nbsp;/gi, " ");
  }

  // ── 12. Remove empty tags (except br, hr, img, video, iframe) ──
  let prevEmpty = "";
  const emptyTagRegex = /<(p|div|h[1-6]|strong|em|u|s|del|a|li|blockquote|pre|code|section|article|figure|figcaption|td|th|tr|thead|tbody|tfoot|table|ul|ol)(\s[^>]*)?>\s*<\/\1>/gi;
  while (prevEmpty !== result) {
    prevEmpty = result;
    const before = result;
    result = result.replace(emptyTagRegex, "");
    if (before !== result && !changes.includes("Menghapus tag kosong")) {
      changes.push("Menghapus tag kosong");
    }
  }

  // ── 13. Clean excessive <br> tags ──
  // Convert multiple <br> between block elements to paragraph breaks
  if (/(<br\s*\/?\s*>\s*){2,}/i.test(result)) {
    changes.push("Merapikan line break berlebih → paragraf");
    // Replace 2+ consecutive <br> with paragraph breaks
    result = result.replace(/(<br\s*\/?\s*>\s*){2,}/gi, "</p><p>");
  }
  // Remove lone <br> at start/end of paragraphs
  result = result.replace(/(<p[^>]*>)\s*<br\s*\/?>\s*/gi, "$1");
  result = result.replace(/\s*<br\s*\/?>\s*(<\/p>)/gi, "$1");

  // ── 14. AUTO-PARAGRAPH: The big one — restructure flat text into paragraphs ──
  result = autoParagraph(result, changes);

  // ── 15. Fix external links (add target & rel) ──
  if (/<a\s[^>]*href\s*=\s*["']https?:\/\//i.test(result)) {
    let fixedLinks = false;
    result = result.replace(/<a\s([^>]*href\s*=\s*["']https?:\/\/[^"']*["'][^>]*)>/gi, (match, attrs) => {
      let newAttrs = attrs;
      if (!/target\s*=/i.test(newAttrs)) {
        newAttrs += ' target="_blank"';
        fixedLinks = true;
      }
      if (!/rel\s*=/i.test(newAttrs)) {
        newAttrs += ' rel="noopener noreferrer"';
        fixedLinks = true;
      }
      return `<a ${newAttrs}>`;
    });
    if (fixedLinks) {
      changes.push('Menambahkan target="_blank" pada link eksternal');
    }
  }

  // ── 16. Ensure images have loading="lazy" ──
  if (/<img\s/i.test(result)) {
    let addedLazy = false;
    result = result.replace(/<img\s([^>]*)>/gi, (match, attrs) => {
      if (!/loading\s*=/i.test(attrs)) {
        addedLazy = true;
        return `<img ${attrs} loading="lazy">`;
      }
      return match;
    });
    if (addedLazy) {
      changes.push("Menambahkan lazy loading pada gambar");
    }
  }

  // ── 17. Final cleanup: collapse whitespace, trim ──
  result = result.replace(/>\s{2,}</g, "> <");
  result = result.trim();

  // ── 18. Final empty tag pass ──
  result = result.replace(/<(p|div)(\s[^>]*)?>\s*<\/\1>/gi, "");

  if (changes.length === 0) {
    changes.push("Konten sudah rapi, tidak ada perubahan");
  }

  return { html: result, changes };
}

/**
 * Auto-Paragraph: Detect and restructure flat text into proper <p> paragraphs.
 *
 * Handles these cases:
 *  - Raw text not wrapped in any tags
 *  - Text separated by double newlines (\n\n)
 *  - Text with <br><br> used as paragraph separators
 *  - Mix of already-wrapped and unwrapped text
 */
function autoParagraph(html, changes) {
  // Use DOM parser for accurate parsing
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");
  const body = doc.body;

  if (!body) return html;

  // Check if content is already well-structured (all children are block elements)
  const blockTagNames = new Set([
    "P", "H1", "H2", "H3", "H4", "H5", "H6",
    "UL", "OL", "BLOCKQUOTE", "TABLE", "FIGURE",
    "PRE", "HR", "IFRAME", "VIDEO", "IMG",
  ]);

  // Google Docs wraps its ENTIRE export in a single <b id="docs-internal-guid-...">
  // (and Word does similar things with stray <span>/<b> wrappers). If such an inline
  // element ends up wrapping block-level content, unwrap it — otherwise the rebuild
  // logic below treats the whole thing as one "inline" blob and re-wraps it in <p>,
  // producing invalid nested <p><p>...</p></p> markup.
  unwrapInlineBlockWrappers(body, blockTagNames, changes);

  let hasOrphanText = false;
  let hasOrphanInline = false;

  for (const node of body.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text.length > 0) {
        hasOrphanText = true;
        break;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toUpperCase();
      if (!blockTagNames.has(tag) && tag !== "DIV" && tag !== "SECTION" && tag !== "ARTICLE") {
        // Inline element (strong, em, a, span, etc.) not wrapped in <p>
        const text = node.textContent.trim();
        if (text.length > 0) {
          hasOrphanInline = true;
          break;
        }
      }
    }
  }

  if (!hasOrphanText && !hasOrphanInline) {
    // Already well-structured — check for oversized paragraphs that need splitting
    return splitLongParagraphs(body.innerHTML, changes);
  }

  changes.push("Menyusun ulang teks menjadi paragraf-paragraf rapi");

  // Rebuild content: collect consecutive inline/text nodes → wrap in <p>
  const result = [];
  let currentParagraph = [];

  function flushParagraph() {
    if (currentParagraph.length === 0) return;
    const combined = currentParagraph.join("").trim();
    if (combined) {
      // Split by double newlines within the combined text
      const parts = combined.split(/\n\s*\n/);
      for (const part of parts) {
        const trimmedPart = part.trim();
        if (trimmedPart) {
          // Further split by single newlines for paragraph breaks
          const lines = trimmedPart.split(/\n/);
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
              result.push(`<p>${trimmedLine}</p>`);
            }
          }
        }
      }
    }
    currentParagraph = [];
  }

  for (const node of body.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text.trim()) {
        currentParagraph.push(text);
      } else if (currentParagraph.length > 0) {
        // Whitespace-only text node between inline elements → keep as space
        currentParagraph.push(" ");
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toUpperCase();

      if (blockTagNames.has(tag) || tag === "DIV") {
        // Block element → flush current paragraph, then add block as-is
        flushParagraph();
        if (tag === "DIV") {
          // Convert div content to paragraph(s)
          const divContent = node.innerHTML.trim();
          if (divContent) {
            result.push(`<p>${divContent}</p>`);
          }
        } else {
          result.push(node.outerHTML);
        }
      } else if (tag === "BR") {
        // <br> → could be paragraph separator
        if (currentParagraph.length > 0) {
          // Check if next sibling is also <br> → paragraph break
          const nextNode = node.nextSibling;
          const nextIsBr = nextNode && nextNode.nodeType === Node.ELEMENT_NODE && nextNode.tagName === "BR";
          if (nextIsBr) {
            flushParagraph();
            // Skip the next <br> (it's consumed as part of the double-break)
          } else {
            // Single <br> inside text → treat as line break within paragraph
            currentParagraph.push("<br>");
          }
        }
      } else {
        // Inline element (strong, em, a, etc.) → accumulate
        currentParagraph.push(node.outerHTML);
      }
    }
  }
  flushParagraph();

  let output = result.join("");

  // Final pass: split oversized paragraphs
  output = splitLongParagraphs(output, changes);

  return output;
}

/**
 * Unwrap inline elements (b, strong, span, em, a, ...) that wrap block-level
 * content. This is invalid HTML that real paste sources produce constantly —
 * most notably Google Docs, which wraps its entire export in a single
 * <b id="docs-internal-guid-...">. Left alone, the paragraph-rebuild logic
 * treats such a wrapper as one big "inline" node and re-wraps its whole
 * outerHTML (block children included) in a fresh <p>, producing broken
 * <p><p>...</p></p> nesting. Unwrapping first keeps the block children as
 * direct siblings so they're handled correctly afterwards.
 */
function unwrapInlineBlockWrappers(root, blockTagNames, changes) {
  let unwrapped = false;
  let changed = true;
  while (changed) {
    changed = false;
    const all = root.querySelectorAll("*");
    for (const el of all) {
      const tag = el.tagName.toUpperCase();
      if (blockTagNames.has(tag) || tag === "DIV" || tag === "SECTION" || tag === "ARTICLE") continue;

      const hasBlockChild = Array.from(el.children).some((child) => {
        const childTag = child.tagName.toUpperCase();
        return blockTagNames.has(childTag) || childTag === "DIV" || childTag === "SECTION" || childTag === "ARTICLE";
      });

      if (hasBlockChild) {
        const parent = el.parentNode;
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
        changed = true;
        unwrapped = true;
        break; // element list is now stale — restart the scan
      }
    }
  }

  if (unwrapped) {
    changes.push("Membongkar wrapper (b/span/dll.) yang salah membungkus konten blok");
  }
}

/**
 * Split very long paragraphs (>800 chars of text) at sentence boundaries.
 * This handles the case where a huge block of pasted text ends up in one <p>.
 */
function splitLongParagraphs(html, changes) {
  const MAX_PARAGRAPH_LENGTH = 800; // chars of text content
  let didSplit = false;

  const result = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, inner) => {
    // Get text-only length (strip tags)
    const textOnly = inner.replace(/<[^>]*>/g, "").trim();
    if (textOnly.length <= MAX_PARAGRAPH_LENGTH) return match;

    // This paragraph is too long — try to split at sentence boundaries
    const sentences = splitIntoSentences(inner);
    if (sentences.length <= 1) return match; // Can't split further

    didSplit = true;

    // Group sentences into chunks of ~3-5 sentences per paragraph
    const SENTENCES_PER_PARAGRAPH = 4;
    const paragraphs = [];
    let current = [];

    for (const sentence of sentences) {
      current.push(sentence);
      if (current.length >= SENTENCES_PER_PARAGRAPH) {
        paragraphs.push(`<p${attrs}>${current.join(" ").trim()}</p>`);
        current = [];
      }
    }
    if (current.length > 0) {
      paragraphs.push(`<p${attrs}>${current.join(" ").trim()}</p>`);
    }

    return paragraphs.join("");
  });

  if (didSplit) {
    changes.push("Memecah paragraf panjang menjadi beberapa paragraf pendek");
  }

  return result;
}

/**
 * Split HTML content into sentences, preserving inline HTML tags.
 * Splits on: . ! ? followed by a space and uppercase letter, or end of string.
 */
function splitIntoSentences(html) {
  // Simple sentence boundary detection that preserves HTML
  const sentences = [];
  let current = "";
  let inTag = false;
  let i = 0;

  while (i < html.length) {
    const char = html[i];

    if (char === "<") {
      inTag = true;
      current += char;
      i++;
      continue;
    }
    if (char === ">") {
      inTag = false;
      current += char;
      i++;
      continue;
    }
    if (inTag) {
      current += char;
      i++;
      continue;
    }

    current += char;

    // Check for sentence boundary: . ! ? followed by space + uppercase or end
    if ((char === "." || char === "!" || char === "?") && !inTag) {
      // Look ahead: is next non-space char uppercase or end of string?
      let j = i + 1;
      while (j < html.length && (html[j] === " " || html[j] === "\n" || html[j] === "\r" || html[j] === "\t")) {
        j++;
      }
      if (j >= html.length || (html[j] >= "A" && html[j] <= "Z") || html[j] === "<") {
        // Sentence boundary found
        const trimmed = current.trim();
        if (trimmed) {
          sentences.push(trimmed);
        }
        current = "";
      }
    }
    i++;
  }

  // Remaining text
  const remaining = current.trim();
  if (remaining) {
    sentences.push(remaining);
  }

  return sentences;
}
