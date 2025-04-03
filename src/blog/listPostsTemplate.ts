import { html } from 'https://unpkg.com/@microsoft/fast-element@1.14.0';
import { IFluentBlog } from './IFluentBlog.js';
import { PostSummary } from '../drop-in-blog/PostSummary.js';

/**
 * Template for showing post summaries
 */
export const listPostsTemplate = html<PostSummary, IFluentBlog> `
<fluent-card
    itemscope
    itemtype="https://schema.org/BlogPosting"
    title=${x => x.title}
    @click="${(x, c) => c.parent.currentPost = Number(x.id?.toString() ?? '0')}">
    <img itemprop="image" src="${x => x.featuredImage}" alt="${x => x.title}" />
    <div>
        <h2 itemprop="headline">${x => x.title}</h2>
        <time datetime="${x => x.publishedAt}">${x => new Date(<string>x.publishedAt).toLocaleString()}</time>
        <p itemprop="abstract">${x => x.summary}</p>
    </div>
</fluent-card>
`;
