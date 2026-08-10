/**
 * Parse the `p` (post slug) query parameter from a URL search string.
 * @param search The `location.search` string (e.g. `?p=my-post`).
 * @returns The slug if present, otherwise `null`.
 */
export function parsePostSlug(search: string): string | null {
    return new URLSearchParams(search).get("p");
}

/**
 * If a `?p=<slug>` query parameter is present and a blog element exists, activate
 * the blog tab and hand the slug off to the element via its `current-slug`
 * attribute.
 * @param search The `location.search` string to parse.
 * @param blogElement The `blog-element` to update, or `null` if none is present.
 * @param activateBlogTab Callback invoked to switch the UI to the blog tab.
 * @returns The slug that was applied, or `null` when nothing was done.
 */
export function openBlogPostFromQuery(
    search: string,
    blogElement: Element | null,
    activateBlogTab: () => void
): string | null {
    const postSlug = parsePostSlug(search);
    if (postSlug && blogElement) {
        activateBlogTab();
        blogElement.setAttribute("current-slug", postSlug);
        return postSlug;
    }
    return null;
}
