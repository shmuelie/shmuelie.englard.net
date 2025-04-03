import { html } from 'https://unpkg.com/@microsoft/fast-element@1.14.0';
import { IFluentBlog } from './IFluentBlog.js';

/**
 * Template for no posts.
 */
export const noPostsTemplate = html<IFluentBlog> `
<section class="no-posts">
    <h1>No Posts</h1>
</section>
`;
