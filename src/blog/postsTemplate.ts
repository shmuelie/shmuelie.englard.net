import { html, when } from 'https://unpkg.com/@microsoft/fast-element@1.13.0';
import { IFluentBlog } from './IFluentBlog.js';
import { listTemplate } from './listTemplate.js';
import { noPostsTemplate } from './noPostsTemplate.js';

/**
 * Template for loaded showing posts.
 */
export const postsTemplate = html<IFluentBlog> `
${when(x => x.posts.length === 0, noPostsTemplate, listTemplate)}
`;
