import { html } from 'https://unpkg.com/@microsoft/fast-element@1.14.0';
import { IFluentBlog } from './IFluentBlog.js';
import { render } from './render.js';
import { Post } from '../drop-in-blog/Post.js';

/**
 * Template for showing a single post, scoped.
 */
const postTemplate = html<Post, IFluentBlog> `
<section class="blog-post">
    <h1>
        <fluent-flipper direction="previous" @click="${(_, c) => c.parent.currentPost = null}"></fluent-flipper>
        <span>${x => x.title}</span>
    </h1>
    <img src="${x => x.featuredImage}" alt="${x => x.title}" />
    <time datetime="${x => x.publishedAt}">${x => new Date(<string>x.publishedAt).toLocaleString()}</time>
    <article :innerHTML="${x => x.content}"></article>
</section>
`;

/**
 * Template for showing a single post
 */
export const postTemplateRenderer = html<IFluentBlog> `
${render(x => x.post, postTemplate)}
`

