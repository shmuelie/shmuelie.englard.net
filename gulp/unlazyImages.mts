/**
 * Rewrites DropInBlog lazy-loaded images so they render without DropInBlog's runtime
 * JavaScript: moves the real URL from `data-lazy-load` into `src`.
 */
export function unlazyImages(html: string): string {
    return html.replace(/<img\b[^>]*>/gi, (tag) => {
        const lazy = tag.match(/data-lazy-load="([^"]+)"/i);
        if (!lazy) {
            return tag;
        }
        const url = lazy[1];
        // Use replacement functions so `$` sequences in the URL (e.g. signed CDN
        // URLs) are inserted literally instead of being interpreted as
        // String.prototype.replace special patterns ($&, $1, $`, $', $$).
        if (/\ssrc="/i.test(tag)) {
            return tag.replace(/\ssrc="[^"]*"/i, () => ` src="${url}"`);
        }
        return tag.replace(/<img\b/i, () => `<img src="${url}"`);
    });
}
