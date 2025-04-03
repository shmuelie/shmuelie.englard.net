import { html, when } from 'https://unpkg.com/@microsoft/fast-element@1.14.0';
import { IFluentBlog } from './IFluentBlog.js';
import { loadingTemplate } from './loadingTemplate.js';
import { loadedTemplate } from './loadedTemplate.js';

/**
 * FluentBlog template
 */
export const template = html<IFluentBlog> `
${when(x => x.loading, loadingTemplate, loadedTemplate)}
`;
