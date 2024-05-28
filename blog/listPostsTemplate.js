import{html}from"https://unpkg.com/@microsoft/fast-element@1.13.0";export const listPostsTemplate=html`
<fluent-card
    itemscope
    itemtype="https://schema.org/BlogPosting"
    title=${t=>t.title}
    @click="${(t,e)=>{var i,m;return e.parent.currentPost=Number(null!==(m=null===(i=t.id)||void 0===i?void 0:i.toString())&&void 0!==m?m:"0")}}">
    <img itemprop="image" src="${t=>t.featuredImage}" alt="${t=>t.title}" />
    <div>
        <h2 itemprop="headline">${t=>t.title}</h2>
        <time datetime="${t=>t.publishedAt}">${t=>new Date(t.publishedAt).toLocaleString()}</time>
        <p itemprop="abstract">${t=>t.summary}</p>
    </div>
</fluent-card>
`;
//# sourceMappingURL=listPostsTemplate.js.map
