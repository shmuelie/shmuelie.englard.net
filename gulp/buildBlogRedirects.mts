import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const BLOG_ID = 'f56590c5-56ae-4aab-8d55-df9c76db569c';
const OAUTH_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWQxODQzOC1lMzAyLTRiMmYtYmNjZC03ZjNhZmM0MTU1ZDAiLCJqdGkiOiI4MzYzMDYwYWUzNzZiYjdiZjgxNzc0YWUwNDdhMWQ4MmY0OTFhZTFlZDBjZDUwNjgzMDJiOGExMjc2NTBlNGE0ZDkwYzhlODc2YTU5ZDM2ZSIsImlhdCI6MTcxNDM5NTI1MS43NjA0MTYsIm5iZiI6MTcxNDM5NTI1MS43NjA0MjEsImV4cCI6MjUwMzMxMzY1MS42ODAzNzUsInN1YiI6IjcwNDU3MDU5NTM3NiIsInNjb3BlcyI6W119.WHUVAeNQdjOMmktUq04JBwNtz4oU75Erxl0GIoz63XyKXZxZU1rb9UOaom6jdPOuGik3lc6nirLpHzI6pHVVeoilJRuzCo3AVL845XgAlhWp8Vr_dPMpXUOf3xdkvI3J6TxIskZowe8thQRirlH3Ror0V8FL9AtqHlQTS-GFME7CcWVi7kAfiLTEw8Pd9iYOaDEKtQFqYhgoTgN6PoX3u0xKiJqxK6iF4WtOFu5R3BH9c9IUuWMiIGpA5A53vGYUgjftkn6ccRlN7frFtU_11mUcsUvyVgQSzozNKzVxa0ODJzfRhqtGMQhuMPq2G6C_rtfzLjaP00prMBzaT56nQDadfUuCHvcbdX-Kpp-vSOoYf6XNyfBFAAW7fsZiBv7r09pYhLsZ4ZWeIyAk91W9nwyBXJY-_8NBd5YmD-UfEfXrxcxQyNjHWJK2zdvzDGQ0vVBrgctY43f4MHXqXqhRobeMmuQRESdJQL3qdsr-dPc_rU_oZEHPH5TEc0_bF5opmJtkmGspMABV9sY3Tp38aocVx6Cas0ecOKtByY2CFiszJdmH2AU3nl9bjyOkRc0I1gClxD7TFtcJq2_D0hB1IH1qldRRy6pAJXpeXrOq2ZK-lbixxAqPq07spYNgd3TKO-MgC0BPWg9inOp5rqXfH7kznadQG_mIrE8yhbWrFmw';
const SITE_ORIGIN = 'https://shmuelie.englard.net';
const DIST_DIR = 'dist';

interface PostInfo {
    id?: number;
    title?: string;
    slug?: string;
    seoDescription?: string;
    featuredImage?: string;
    publishedAt?: string;
    publishedAtIso8601?: string;
    content?: string;
    schema_article?: string;
}

const WA_STYLES = 'https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/styles';

// DropInBlog HTML is owner-authored today, but treat it as untrusted (defense in
// depth): a compromised CMS account, or a future feature such as comments/guest
// authors, must not be able to inject <script>, event handlers, or javascript:
// URLs into the generated static pages. A single window-backed DOMPurify
// instance is reused for every post.
const purify = DOMPurify(new JSDOM('').window);

function sanitizeCmsHtml(html: string): string {
    return purify.sanitize(html);
}

/**
 * Inline theme script shared by every generated page. Kept as a constant so its
 * exact text can both be embedded in a <script> element and hashed for the
 * Content-Security-Policy `script-src` allow-list.
 */
const THEME_SCRIPT = `
        (function () {
            var query = window.matchMedia("(prefers-color-scheme: dark)");
            function applyTheme(isDark) {
                var root = document.documentElement;
                root.classList.toggle("wa-dark", isDark);
                root.classList.toggle("wa-light", !isDark);
                root.style.colorScheme = isDark ? "dark" : "light";
            }
            applyTheme(query.matches);
            query.addEventListener("change", function (event) { applyTheme(event.matches); });
        })();
    `;

/**
 * Computes the CSP `'sha256-...'` source expression for an inline script's exact
 * text content, so the policy can allow our own inline scripts without opening
 * the page up to arbitrary injected ones via `'unsafe-inline'`.
 */
function scriptHash(scriptText: string): string {
    return `'sha256-${createHash('sha256').update(scriptText, 'utf8').digest('base64')}'`;
}

/**
 * Builds the Content-Security-Policy meta tag. Inline scripts are allow-listed by
 * hash (no `'unsafe-inline'` for scripts) so injected markup cannot execute;
 * styles come from our own inline blocks and the pinned Web Awesome CDN assets.
 */
function cspMeta(inlineScripts: string[]): string {
    const scriptSources = inlineScripts.map(scriptHash).join(' ');
    const policy = [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "img-src 'self' https: data:",
        "style-src 'self' 'unsafe-inline' https://unpkg.com",
        "font-src 'self' https://unpkg.com data:",
        `script-src ${scriptSources}`
    ].join('; ');
    return `<meta http-equiv="Content-Security-Policy" content="${policy}" />`;
}

/**
 * Re-emits the CMS-provided Schema.org data inside a `<script type="application/ld+json">`
 * block we control. The raw `schema_article` value (which may arrive as bare JSON
 * or already wrapped in a script tag) is parsed and re-serialized with `<`, `>`
 * and `&` escaped, so a hostile CMS payload cannot break out of the script
 * element. Returns the tag plus its exact inline text (for CSP hashing), or empty
 * strings when there is no valid JSON to emit.
 */
function renderStructuredData(raw: string | undefined): { tag: string; script: string } {
    if (!raw) {
        return { tag: '', script: '' };
    }
    const match = raw.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const jsonText = (match ? match[1] : raw).trim();
    if (!jsonText) {
        return { tag: '', script: '' };
    }
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonText);
    } catch {
        return { tag: '', script: '' };
    }
    const script = JSON.stringify(parsed)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');
    return { tag: `<script type="application/ld+json">${script}</script>`, script };
}

/**
 * Fetches all published blog posts from the DropInBlog API, paginating through all pages.
 */
async function fetchAllPosts(): Promise<PostInfo[]> {
    const allPosts: PostInfo[] = [];
    let page = 0;
    let lastPage = 0;

    do {
        const url = new URL(`https://api.dropinblog.com/v2/blog/${BLOG_ID}/posts`);
        url.searchParams.set('page', String(page));
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${OAUTH_KEY}`
            }
        });
        const json: any = await response.json();
        if (!json.success) {
            throw new Error(`DropInBlog API error: ${json.message}`);
        }
        const posts: PostInfo[] = json.data?.posts ?? [];
        allPosts.push(...posts);
        lastPage = json.data?.pagination?.last_page ?? 0;
        page++;
    } while (page <= lastPage);

    return allPosts;
}

/**
 * Rewrites DropInBlog lazy-loaded images so they render without DropInBlog's runtime
 * JavaScript: moves the real URL from `data-lazy-load` into `src`.
 */
function unlazyImages(html: string): string {
    return html.replace(/<img\b[^>]*>/gi, (tag) => {
        const lazy = tag.match(/data-lazy-load="([^"]+)"/i);
        if (!lazy) {
            return tag;
        }
        const url = lazy[1];
        if (/\ssrc="/i.test(tag)) {
            return tag.replace(/\ssrc="[^"]*"/i, ` src="${url}"`);
        }
        return tag.replace(/<img\b/i, `<img src="${url}"`);
    });
}

/**
 * Generates a self-contained static article page for a blog post. The page renders the
 * full post content (for crawlers, social unfurlers, and no-JS visitors), carries Open
 * Graph metadata for sharing, self-canonicalizes to /blog/<slug>/, and links to the
 * interactive single-page view via /?p=<slug>.
 */
function generateArticlePage(post: PostInfo): string {
    const title = escapeHtml(post.title ?? 'Blog Post');
    const description = escapeHtml(post.seoDescription ?? '');
    const image = post.featuredImage ?? '';
    const canonical = `${SITE_ORIGIN}/blog/${post.slug}/`;
    const appPath = `/?p=${encodeURIComponent(post.slug ?? '')}`;
    const appUrl = `${SITE_ORIGIN}${appPath}`;
    const iso = post.publishedAtIso8601 ?? '';
    const dateHuman = post.publishedAt ?? (iso ? new Date(iso).toLocaleDateString() : '');
    const body = post.content ? unlazyImages(sanitizeCmsHtml(post.content)) : `<p>${description}</p>`;
    const structuredData = renderStructuredData(post.schema_article);

    const redirectScript = `window.location.replace(${JSON.stringify(appPath)});`;
    const inlineScripts = [redirectScript, THEME_SCRIPT];
    if (structuredData.script) {
        inlineScripts.push(structuredData.script);
    }

    return `<!DOCTYPE html>
<html lang="en-US" dir="ltr">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${cspMeta(inlineScripts)}
    <script>${redirectScript}</script>
    <link rel="canonical" href="${canonical}" />
    <title>${title} - Shmueli Yosef Englard</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <script>${THEME_SCRIPT}</script>
    <link rel="stylesheet" href="/index.css" />
    <link rel="stylesheet" href="${WA_STYLES}/webawesome.css" />
    <link rel="stylesheet" href="${WA_STYLES}/themes/default.css" />
    <style>
        main.blog-static { margin: 10px auto; padding: 20px; max-width: 60em; }
        main.blog-static > nav { margin-bottom: 16px; }
        main.blog-static img { max-width: 100%; height: auto; border-radius: var(--wa-border-radius-medium); }
        main.blog-static time { font-style: italic; display: block; margin-bottom: 16px; }
        main.blog-static .app-link { display: inline-block; margin-top: 24px; }
    </style>
    ${structuredData.tag}
</head>
<body dir="ltr">
    <main class="blog-static card">
        <nav><a href="/">← Shmueli Yosef Englard</a></nav>
        <article itemscope itemtype="https://schema.org/BlogPosting">
            <h1 itemprop="headline">${title}</h1>
            ${iso ? `<time itemprop="datePublished" datetime="${escapeHtml(iso)}">${escapeHtml(dateHuman)}</time>` : ''}
            ${image ? `<img itemprop="image" src="${escapeHtml(image)}" alt="${title}" />` : ''}
            <div itemprop="articleBody">${body}</div>
        </article>
        <a class="app-link" href="${escapeHtml(appUrl)}">Open the interactive version →</a>
    </main>
</body>
</html>`;
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Fetches a single post's full data (including rendered content) from the DropInBlog API.
 * Returns an empty object on any failure so page generation can degrade gracefully to the
 * post summary rather than failing the whole build.
 */
async function fetchPostContent(id: number): Promise<Partial<PostInfo>> {
    try {
        const url = new URL(`https://api.dropinblog.com/v2/blog/${BLOG_ID}/posts/${id}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${OAUTH_KEY}`
            }
        });
        const json: any = await response.json();
        if (!json?.success) {
            return {};
        }
        const post: any = json.data?.post ?? {};
        return {
            content: post.content,
            schema_article: post.schema_article,
            publishedAt: post.publishedAt,
            publishedAtIso8601: post.publishedAtIso8601
        };
    } catch {
        return {};
    }
}

/**
 * Generates the /blog/ index page. DropInBlog's RSS feed links to /blog/?p=<slug>; this
 * page reads that slug and forwards to the matching static article at /blog/<slug>/.
 * With no slug it falls back to the blog tab of the single-page app.
 */
function generateBlogIndexPage(): string {
    const redirectScript = `
        (function () {
            var slug = new URLSearchParams(window.location.search).get('p');
            window.location.replace(slug ? '/?p=' + encodeURIComponent(slug) : '/#/rootTabs/blog');
        })();
    `;
    return `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${cspMeta([redirectScript])}
    <title>Blog - Shmueli Yosef Englard</title>
    <script>${redirectScript}</script>
    <meta http-equiv="refresh" content="0; url=/#/rootTabs/blog" />
</head>
<body>
    <p><a href="/#/rootTabs/blog">Go to the blog</a></p>
</body>
</html>`;
}

/**
 * Loads posts from a local fixture file instead of the live DropInBlog API. Used
 * by the end-to-end tests (via the `BLOG_FIXTURE` env var) to build a
 * deterministic, network-independent `dist/` with static blog pages. The fixture
 * is an array of full post objects (content included), so no per-post content
 * fetch is needed.
 */
async function loadFixturePosts(fixturePath: string): Promise<PostInfo[]> {
    const raw = await readFile(fixturePath, 'utf-8');
    const posts = JSON.parse(raw) as PostInfo[];
    console.log(`Using blog fixture ${fixturePath} (${posts.length} posts)`);
    return posts;
}

/**
 * Fetches blog posts from the DropInBlog API and generates static article pages under
 * dist/blog/<slug>/ for use as shareable, RSS-friendly URLs.
 */
export async function buildBlogRedirects(): Promise<void> {
    const fixturePath = process.env['BLOG_FIXTURE'];
    const posts = fixturePath ? await loadFixturePosts(fixturePath) : await fetchAllPosts();
    console.log(`Generating static blog pages for ${posts.length} posts…`);

    const blogDir = path.join(DIST_DIR, 'blog');
    await mkdir(blogDir, { recursive: true });
    await writeFile(path.join(blogDir, 'index.htm'), generateBlogIndexPage(), 'utf-8');

    await Promise.all(posts.map(async (post) => {
        if (!post.slug || !post.id) {
            return;
        }
        // Fixture posts already carry their full content; only the live API path
        // needs a second request to fetch the rendered article body.
        const full = fixturePath ? post : await fetchPostContent(post.id);
        const dir = path.join(blogDir, post.slug);
        await mkdir(dir, { recursive: true });
        const html = generateArticlePage({ ...post, ...full });
        await writeFile(path.join(dir, 'index.htm'), html, 'utf-8');
    }));

    console.log(`Generated ${posts.length} static blog pages in ${DIST_DIR}/blog/`);
}
