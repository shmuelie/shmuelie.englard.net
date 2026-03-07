import { html } from 'https://unpkg.com/@microsoft/fast-element@1.14.0';
import { IFluentBlog } from './IFluentBlog.js';

/**
 * Template for blog pagination controls.
 */
export const paginationTemplate = html<IFluentBlog> `
<nav class="blog-pagination">
    <fluent-flipper
        direction="previous"
        ?disabled="${x => (x.currentPage ?? 0) <= 0}"
        @click="${x => { if ((x.currentPage ?? 0) > 0) x.currentPage = (x.currentPage ?? 0) - 1; }}">
    </fluent-flipper>
    <span>Page ${x => (x.currentPage ?? 0) + 1} of ${x => x.totalPages}</span>
    <fluent-flipper
        direction="next"
        ?disabled="${x => (x.currentPage ?? 0) + 1 >= x.totalPages}"
        @click="${x => { if ((x.currentPage ?? 0) + 1 < x.totalPages) x.currentPage = (x.currentPage ?? 0) + 1; }}">
    </fluent-flipper>
</nav>
`;
