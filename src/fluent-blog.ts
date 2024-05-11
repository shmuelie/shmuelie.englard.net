import { } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { attr, html, repeat, observable, FASTElement, customElement, css, when, ValueConverter, nullableNumberConverter } from 'https://unpkg.com/@microsoft/fast-element@1.13.0'
import { BlogPosting } from '../data/schema'
import { getPosts } from './drop-in-blog/posts.js'
import { convertPost } from './drop-in-blog/schema-converters.js'
import { getPost } from './drop-in-blog/post.js'
import { isError } from './drop-in-blog/request-helper.js'
import { register, unregister, ProviderCallback, SchemaConfig } from 'https://unpkg.com/hashed-es6@1.0.2'

const listPostsTemplate = html<BlogPosting, FluentBlog>`
<fluent-card
    itemscope
    itemtype="https://schema.org/BlogPosting"
    title=${x => x.headline}
    @click="${(x, c) => c.parent.currentPost = Number(x['@id'])}">
    <img itemprop="image" src="${x => x.image}" alt="${x => x.headline}" />
    <div>
        <h2 itemprop="headline">${x => x.headline}</h2>
        <time datetime="${x => x.datePublished}">${x => new Date(<string>x.datePublished).toLocaleString()}</time>
        <p itemprop="abstract">${x => x.abstract}</p>
    </div>
</fluent-card>
`

const listTemplate = html<FluentBlog>`
<section class="blog-posts">
    <div>
        ${repeat(x => x.posts, listPostsTemplate)}
    </div>
</section>
`;

const postTemplate = html<FluentBlog>`
<section class="blog-post">
    <h1>
        <fluent-flipper direction="previous" @click="${x => x.currentPost = null}"></fluent-flipper>
        ${x => x.post?.headline}
    </h1>
    <time datetime="${x => x.post?.datePublished}">${x => new Date(<string>x.post?.datePublished).toLocaleString()}</time>
    <img src="${x => x.post?.image}" alt="${x => x.post?.headline}" />
    <article :innerHTML="${x => x.post?.articleBody}"></article>
</section>
`;

const loadingTemplate = html<FluentBlog>`
<section class="blog-loading">
    <div>
        <fluent-progress-ring></fluent-progress-ring>
    </div>
</section>
`;

const noPostsTemplate = html<FluentBlog>`
<section class="no-posts">
    <h1>No Posts</h1>
</section>
`;

const postsTemplate = html<FluentBlog>`
${when(x => x.posts.length === 0, noPostsTemplate)}
${when(x => x.posts.length > 0, listTemplate)}
`;

const loadedTemplate = html<FluentBlog>`
${when(x => x.post === null, postsTemplate)}
${when(x => x.post !== null, postTemplate)}
`;

const template = html<FluentBlog>`
    ${when(x => x.loading, loadingTemplate)}
    ${when(x => !x.loading, loadedTemplate)}
`;

const styles = css`
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
`;

@customElement({
    name: 'fluent-blog',
    template: template,
    styles: styles
})
export class FluentBlog extends FASTElement {
    private updateHash: ProviderCallback | null = null;
    private readonly boundHashUpdated = this.hashUpdated.bind(this);

    @observable
    loading: boolean = false;
    @observable
    posts: BlogPosting[] = [];
    @observable
    post: BlogPosting | null = null;

    @attr({
        attribute: 'current-page',
        converter: nullableNumberConverter
    })
    currentPage: number | null = null;

    @attr({
        attribute: 'current-post',
        converter: nullableNumberConverter
    })
    currentPost: number | null = null;

    currentPageChanged(): void {
        this._load();
    }

    currentPostChanged(): void {
        this._load();
    }

    override connectedCallback(): void {
        super.connectedCallback();

        const config: SchemaConfig = {};
        config[this.id + "Page"] = this.currentPage ?? "";
        config[this.id + "Post"] = this.currentPost ?? "";
        this.updateHash = register(config, this.boundHashUpdated);
        this._load();
    }
    private hashUpdated(state: Record<string, any>): void {
        let page = state[this.id + "Page"];
        if (page === "") {
            page = null;
        }
        let post = state[this.id + "Post"];
        if (post === "") {
            post = null;
        }
        this.loading = true;
        this.currentPage = page;
        this.currentPost = post;
        this.loading = false;
        this._load();
    }

    private async _load(): Promise<void> {
        if (this.loading) {
            return;
        }
        this.loading = true;

        this.posts.splice(0, this.posts.length);

        try {
            if (!await this._loadPost()) {
                await this._loadPosts();
            }
        }
        catch {
        }

        this.$emit("change");

        this.loading = false;
    }

    private async _loadPost(): Promise<boolean> {
        if (this.currentPost) {
            const response = await getPost(this.currentPost);
            if (response && !isError(response)) {
                this.post = convertPost(response);
                return true;
            }
        }

        return false;
    }

    private async _loadPosts(): Promise<void> {
        this.currentPost = null;
        this.post = null;

        let currentPage: number;
        if (!this.currentPage) {
            currentPage = 0;
        } else {
            currentPage = this.currentPage;
        }

        const response = await getPosts({
            page: currentPage,

        });
        if (!isError(response)) {
            for (const post of response.posts ?? []) {
                if (post) {
                    this.posts.push(convertPost(post));
                }
            }
        }
    }
}