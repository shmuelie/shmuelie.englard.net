import{html,when}from"https://unpkg.com/@microsoft/fast-element@1.13.0";import{listTemplate}from"./listTemplate.js";import{noPostsTemplate}from"./noPostsTemplate.js";export const postsTemplate=html`
${when((t=>0===t.posts.length),noPostsTemplate,listTemplate)}
`;
//# sourceMappingURL=postsTemplate.js.map
