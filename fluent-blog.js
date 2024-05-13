var __decorate=this&&this.__decorate||function(t,e,o,s){var r,l=arguments.length,i=l<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,o):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,o,s);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(i=(l<3?r(i):l>3?r(e,o,i):r(e,o))||i);return l>3&&i&&Object.defineProperty(e,o,i),i};import{attr,html,repeat,observable,FASTElement,customElement,css,when,nullableNumberConverter}from"https://unpkg.com/@microsoft/fast-element@1.13.0";import{getPosts}from"./drop-in-blog/posts.js";import{convertPost}from"./drop-in-blog/schema-converters.js";import{getPost}from"./drop-in-blog/post.js";import{isError}from"./drop-in-blog/request-helper.js";import{register}from"https://unpkg.com/hashed-es6@1.0.3";const listPostsTemplate=html`
<fluent-card
    itemscope
    itemtype="https://schema.org/BlogPosting"
    title=${t=>t.headline}
    @click="${(t,e)=>e.parent.currentPost=Number(t["@id"])}">
    <img itemprop="image" src="${t=>t.image}" alt="${t=>t.headline}" />
    <div>
        <h2 itemprop="headline">${t=>t.headline}</h2>
        <time datetime="${t=>t.datePublished}">${t=>new Date(t.datePublished).toLocaleString()}</time>
        <p itemprop="abstract">${t=>t.abstract}</p>
    </div>
</fluent-card>
`,listTemplate=html`
<section class="blog-posts">
    <div>
        ${repeat((t=>t.posts),listPostsTemplate)}
    </div>
</section>
`,postTemplate=html`
<section class="blog-post">
    <h1>
        <fluent-flipper direction="previous" @click="${t=>t.currentPost=null}"></fluent-flipper>
        ${t=>{var e;return null===(e=t.post)||void 0===e?void 0:e.headline}}
    </h1>
    <time datetime="${t=>{var e;return null===(e=t.post)||void 0===e?void 0:e.datePublished}}">${t=>{var e;return new Date(null===(e=t.post)||void 0===e?void 0:e.datePublished).toLocaleString()}}</time>
    <img src="${t=>{var e;return null===(e=t.post)||void 0===e?void 0:e.image}}" alt="${t=>{var e;return null===(e=t.post)||void 0===e?void 0:e.headline}}" />
    <article :innerHTML="${t=>{var e;return null===(e=t.post)||void 0===e?void 0:e.articleBody}}"></article>
</section>
`,loadingTemplate=html`
<section class="blog-loading">
    <div>
        <fluent-progress-ring></fluent-progress-ring>
    </div>
</section>
`,noPostsTemplate=html`
<section class="no-posts">
    <h1>No Posts</h1>
</section>
`,postsTemplate=html`
${when((t=>0===t.posts.length),noPostsTemplate)}
${when((t=>t.posts.length>0),listTemplate)}
`,loadedTemplate=html`
${when((t=>null===t.post),postsTemplate)}
${when((t=>null!==t.post),postTemplate)}
`,template=html`
    ${when((t=>t.loading),loadingTemplate)}
    ${when((t=>!t.loading),loadedTemplate)}
`,styles=css`
section.blog-loading {
    margin: 20px;
}

section.no-posts {
    margin: 20px;
}

section.blog-posts > div {
    display: flex;
    flex-wrap: wrap;
    padding-left: 10px;
}

section.blog-posts fluent-card {
    max-width: 300px;
    color: var(--neutral-foreground-rest);
    margin: 10px;
    width: 40vw;
    cursor: pointer;
}

section.blog-posts fluent-card img {
    max-width: 300px;
    width: 40vw;
}

section.blog-posts fluent-card div {
    padding: 0 10px 10px;
}

section.blog-posts fluent-card time {
    font-style: italic;
}

section.blog-posts fluent-card p {
    overflow-y: auto;
    height: 100px;
}

section.blog-posts fluent-card h2 {
    text-overflow: ellipsis;
    overflow-x: clip;
    white-space: nowrap;
}

section.blog-post {
    margin: 20px;
}

section.blog-post fluent-flipper {
    color: var(--accent-foreground-rest);
    width: calc(((var(--base-height-multiplier) + var(--density))* var(--design-unit) + var(--design-unit))* 1px)
}

section.blog-post fluent-flipper:hover {
    color: var(--accent-foreground-hover);
}

section.blog-post img {
    border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-rest);
    border-radius: calc(var(--layer-corner-radius) * 1px);
    box-shadow: var(--elevation-shadow-card-rest);
}

section.blog-post a {
    color: var(--accent-foreground-rest);
}

section.blog-post a:hover {
    color: var(--accent-foreground-hover);
}

section.blog-post a:active {
    color: var(--accent-foreground-active);
}

section.blog-post a:focus {
    color: var(--accent-foreground-focus);
}

section.blog-post a.badge {
    text-decoration: none !important;
    display: block;
}

section.blog-post time {
    font-style: italic;
}
`;let FluentBlog=class extends FASTElement{constructor(){super(...arguments),this.updateHash=null,this.boundHashUpdated=this.hashUpdated.bind(this),this.loading=!1,this.posts=[],this.post=null,this.currentPage=null,this.currentPost=null}get currentPageId(){return this.id+"Page"}get currentPostId(){return this.id+"Post"}currentPageChanged(){var t,e;this.updateHash&&(this.updateHash({[this.currentPageId]:null!==(e=null===(t=this.currentPage)||void 0===t?void 0:t.toString())&&void 0!==e?e:""}),this._load())}currentPostChanged(){var t,e;this.updateHash&&(this.updateHash({[this.currentPostId]:null!==(e=null===(t=this.currentPost)||void 0===t?void 0:t.toString())&&void 0!==e?e:""}),this._load())}connectedCallback(){var t,e,o,s;super.connectedCallback(),this.updateHash=register({[this.currentPageId]:null!==(e=null===(t=this.currentPage)||void 0===t?void 0:t.toString())&&void 0!==e?e:"",[this.currentPostId]:null!==(s=null===(o=this.currentPost)||void 0===o?void 0:o.toString())&&void 0!==s?s:""},this.boundHashUpdated)}hashUpdated(t){let e=t[this.currentPageId];""===e&&(e=null);let o=t[this.currentPostId];""===o&&(o=null),this.currentPage=Number(e),this.currentPost=Number(o),this._load()}async _load(){if(!this.loading){this.loading=!0,this.posts.splice(0,this.posts.length);try{await this._loadPost()||await this._loadPosts()}catch{}this.$emit("change"),this.loading=!1}}async _loadPost(){if(this.currentPost){const t=await getPost(this.currentPost);if(t&&!isError(t))return this.post=convertPost(t),!0}return!1}async _loadPosts(){var t;let e;this.currentPost=null,this.post=null,e=this.currentPage?this.currentPage:0;const o=await getPosts({page:e});if(!isError(o))for(const e of null!==(t=o.posts)&&void 0!==t?t:[])e&&this.posts.push(convertPost(e))}};__decorate([observable],FluentBlog.prototype,"loading",void 0),__decorate([observable],FluentBlog.prototype,"posts",void 0),__decorate([observable],FluentBlog.prototype,"post",void 0),__decorate([attr({attribute:"current-page",converter:nullableNumberConverter})],FluentBlog.prototype,"currentPage",void 0),__decorate([attr({attribute:"current-post",converter:nullableNumberConverter})],FluentBlog.prototype,"currentPost",void 0),FluentBlog=__decorate([customElement({name:"fluent-blog",template:template,styles:styles})],FluentBlog);export{FluentBlog};
//# sourceMappingURL=fluent-blog.js.map
