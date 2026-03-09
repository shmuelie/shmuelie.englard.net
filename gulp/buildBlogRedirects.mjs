import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const BLOG_ID = 'f56590c5-56ae-4aab-8d55-df9c76db569c';
const OAUTH_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWQxODQzOC1lMzAyLTRiMmYtYmNjZC03ZjNhZmM0MTU1ZDAiLCJqdGkiOiI4MzYzMDYwYWUzNzZiYjdiZjgxNzc0YWUwNDdhMWQ4MmY0OTFhZTFlZDBjZDUwNjgzMDJiOGExMjc2NTBlNGE0ZDkwYzhlODc2YTU5ZDM2ZSIsImlhdCI6MTcxNDM5NTI1MS43NjA0MTYsIm5iZiI6MTcxNDM5NTI1MS43NjA0MjEsImV4cCI6MjUwMzMxMzY1MS42ODAzNzUsInN1YiI6IjcwNDU3MDU5NTM3NiIsInNjb3BlcyI6W119.WHUVAeNQdjOMmktUq04JBwNtz4oU75Erxl0GIoz63XyKXZxZU1rb9UOaom6jdPOuGik3lc6nirLpHzI6pHVVeoilJRuzCo3AVL845XgAlhWp8Vr_dPMpXUOf3xdkvI3J6TxIskZowe8thQRirlH3Ror0V8FL9AtqHlQTS-GFME7CcWVi7kAfiLTEw8Pd9iYOaDEKtQFqYhgoTgN6PoX3u0xKiJqxK6iF4WtOFu5R3BH9c9IUuWMiIGpA5A53vGYUgjftkn6ccRlN7frFtU_11mUcsUvyVgQSzozNKzVxa0ODJzfRhqtGMQhuMPq2G6C_rtfzLjaP00prMBzaT56nQDadfUuCHvcbdX-Kpp-vSOoYf6XNyfBFAAW7fsZiBv7r09pYhLsZ4ZWeIyAk91W9nwyBXJY-_8NBd5YmD-UfEfXrxcxQyNjHWJK2zdvzDGQ0vVBrgctY43f4MHXqXqhRobeMmuQRESdJQL3qdsr-dPc_rU_oZEHPH5TEc0_bF5opmJtkmGspMABV9sY3Tp38aocVx6Cas0ecOKtByY2CFiszJdmH2AU3nl9bjyOkRc0I1gClxD7TFtcJq2_D0hB1IH1qldRRy6pAJXpeXrOq2ZK-lbixxAqPq07spYNgd3TKO-MgC0BPWg9inOp5rqXfH7kznadQG_mIrE8yhbWrFmw';
const SITE_ORIGIN = 'https://shmuelie.englard.net';
const DIST_DIR = 'dist';

/**
 * @typedef {{ id?: number, title?: string, slug?: string, seoDescription?: string, featuredImage?: string }} PostInfo
 */

/**
 * Fetches all published blog posts from the DropInBlog API, paginating through all pages.
 * @returns {Promise<PostInfo[]>}
 */
async function fetchAllPosts() {
    /** @type {PostInfo[]} */
    const allPosts = [];
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
        const json = await response.json();
        if (!json.success) {
            throw new Error(`DropInBlog API error: ${json.message}`);
        }
        const posts = json.data?.posts ?? [];
        allPosts.push(...posts);
        lastPage = json.data?.pagination?.last_page ?? 0;
        page++;
    } while (page <= lastPage);

    return allPosts;
}

/**
 * Generates an HTML redirect page for a blog post.
 * @param {PostInfo} post
 * @returns {string}
 */
function generateRedirectPage(post) {
    const title = escapeHtml(post.title ?? 'Blog Post');
    const description = escapeHtml(post.seoDescription ?? '');
    const image = post.featuredImage ?? '';
    const spaUrl = `${SITE_ORIGIN}/#rootTabs=tab-blog&theblogPost=${post.id}`;

    return `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${spaUrl}" />
    <link rel="canonical" href="${spaUrl}" />
    <title>${title} - Shmueli Yosef Englard</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${SITE_ORIGIN}/blog/${post.slug}/" />
    <meta property="og:type" content="article" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
</head>
<body>
    <p>Redirecting to <a href="${spaUrl}">${title}</a>…</p>
</body>
</html>`;
}

/**
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Fetches blog posts from the DropInBlog API and generates static redirect pages.
 * @returns {Promise<void>}
 */
export async function buildBlogRedirects() {
    const posts = await fetchAllPosts();
    console.log(`Generating redirect pages for ${posts.length} blog posts…`);

    await Promise.all(posts.map(async (post) => {
        if (!post.slug || !post.id) {
            return;
        }
        const dir = path.join(DIST_DIR, 'blog', post.slug);
        await mkdir(dir, { recursive: true });
        const html = generateRedirectPage(post);
        await writeFile(path.join(dir, 'index.htm'), html, 'utf-8');
    }));

    console.log(`Generated ${posts.length} blog redirect pages in ${DIST_DIR}/blog/`);
}
