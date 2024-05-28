import{html,repeat}from"https://unpkg.com/@microsoft/fast-element@1.13.0";import{listPostsTemplate}from"./listPostsTemplate.js";export const listTemplate=html`
<section class="blog-posts">
    <div>
        ${repeat((t=>t.posts),listPostsTemplate)}
    </div>
</section>
`;
//# sourceMappingURL=listTemplate.js.map
