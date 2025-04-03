import{html}from"https://unpkg.com/@microsoft/fast-element@1.14.0";import{render}from"./render.js";const postTemplate=html`
<section class="blog-post">
    <h1>
        <fluent-flipper direction="previous" @click="${(t,e)=>e.parent.currentPost=null}"></fluent-flipper>
        <span>${t=>t.title}</span>
    </h1>
    <img src="${t=>t.featuredImage}" alt="${t=>t.title}" />
    <time datetime="${t=>t.publishedAt}">${t=>new Date(t.publishedAt).toLocaleString()}</time>
    <article :innerHTML="${t=>t.content}"></article>
</section>
`;export const postTemplateRenderer=html`
${render((t=>t.post),postTemplate)}
`;
//# sourceMappingURL=postTemplate.js.map
