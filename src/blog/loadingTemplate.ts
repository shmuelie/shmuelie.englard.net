import { html } from 'https://unpkg.com/@microsoft/fast-element@1.13.0';
import { IFluentBlog } from './IFluentBlog.js';

/**
 * Template to show while loading content.
 */
export const loadingTemplate = html<IFluentBlog> `
<section class="blog-loading">
    <div>
        <fluent-progress-ring></fluent-progress-ring>
    </div>
</section>
`;
