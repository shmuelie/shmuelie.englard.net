import{html,repeat,when}from"https://unpkg.com/@microsoft/fast-element@1.14.0";import{listPostsTemplate}from"./listPostsTemplate.js";import{paginationTemplate}from"./paginationTemplate.js";export const listTemplate=html`
<section class="blog-posts">
    <div>
        ${repeat(t=>t.posts,listPostsTemplate)}
    </div>
    ${when(t=>t.totalPages>1,paginationTemplate)}
</section>
`;
//# sourceMappingURL=listTemplate.js.map
