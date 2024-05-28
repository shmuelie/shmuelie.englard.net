import { html, repeat } from 'https://unpkg.com/@microsoft/fast-element@1.13.0';
import { IFluentBlog } from './IFluentBlog.js';
import { listPostsTemplate } from './listPostsTemplate.js';

/**
 * Template for showing a collection of posts.
 */
export const listTemplate = html<IFluentBlog> `
<section class="blog-posts">
    <div>
        ${repeat(x => x.posts, listPostsTemplate)}
    </div>
</section>
`;
