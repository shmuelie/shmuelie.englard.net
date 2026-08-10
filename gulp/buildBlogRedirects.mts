import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

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
    const appUrl = `${SITE_ORIGIN}/?p=${encodeURIComponent(post.slug ?? '')}`;
    const iso = post.publishedAtIso8601 ?? '';
    const dateHuman = post.publishedAt ?? (iso ? new Date(iso).toLocaleDateString() : '');
    const body = post.content ? unlazyImages(post.content) : `<p>${description}</p>`;
    const schema = post.schema_article ?? '';

    return `<!DOCTYPE html>
<html lang="en-US" dir="ltr">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href="${canonical}" />
    <title>${title} - Shmueli Yosef Englard</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <script>
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
    </script>
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
    ${schema}
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
 * Fetches blog posts from the DropInBlog API and generates static article pages under
 * dist/blog/<slug>/ for use as shareable, RSS-friendly URLs.
 */
export async function buildBlogRedirects(): Promise<void> {
    const posts = await fetchAllPosts();
    console.log(`Generating static blog pages for ${posts.length} posts…`);

    await Promise.all(posts.map(async (post) => {
        if (!post.slug || !post.id) {
            return;
        }
        const full = await fetchPostContent(post.id);
        const dir = path.join(DIST_DIR, 'blog', post.slug);
        await mkdir(dir, { recursive: true });
        const html = generateArticlePage({ ...post, ...full });
        await writeFile(path.join(dir, 'index.htm'), html, 'utf-8');
    }));

    console.log(`Generated ${posts.length} static blog pages in ${DIST_DIR}/blog/`);
}
