import{html}from"https://unpkg.com/@microsoft/fast-element@1.14.0";export const paginationTemplate=html`
<nav class="blog-pagination">
    <fluent-flipper
        direction="previous"
        ?disabled="${e=>{var r;return(null!==(r=e.currentPage)&&void 0!==r?r:0)<=0}}"
        @click="${e=>{var r,t;(null!==(r=e.currentPage)&&void 0!==r?r:0)>0&&(e.currentPage=(null!==(t=e.currentPage)&&void 0!==t?t:0)-1)}}">
    </fluent-flipper>
    <span>Page ${e=>{var r;return(null!==(r=e.currentPage)&&void 0!==r?r:0)+1}} of ${e=>e.totalPages}</span>
    <fluent-flipper
        direction="next"
        ?disabled="${e=>{var r;return(null!==(r=e.currentPage)&&void 0!==r?r:0)+1>=e.totalPages}}"
        @click="${e=>{var r,t;(null!==(r=e.currentPage)&&void 0!==r?r:0)+1<e.totalPages&&(e.currentPage=(null!==(t=e.currentPage)&&void 0!==t?t:0)+1)}}">
    </fluent-flipper>
</nav>
`;
//# sourceMappingURL=paginationTemplate.js.map
