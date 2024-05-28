import { html, when } from 'https://unpkg.com/@microsoft/fast-element@1.13.0';
import { IFluentBlog } from './IFluentBlog.js';
import { postTemplateRenderer } from './postTemplate.js';
import { postsTemplate } from './postsTemplate.js';

/**
 * Template for showing content when loaded.
 */
export const loadedTemplate = html<IFluentBlog> `
${when(x => x.post === null, postsTemplate, postTemplateRenderer)}
`;
