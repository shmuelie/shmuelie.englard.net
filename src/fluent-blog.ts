import { } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { attr, html, repeat, observable, FASTElement, customElement, css, when, nullableNumberConverter } from 'https://unpkg.com/@microsoft/fast-element@1.13.0'
import { BlogPosting } from '../data/schema'
import { convertPost } from './drop-in-blog/schema-converters.js'
import { isError } from './drop-in-blog/request-helper.js'
import { register, ProviderCallback } from 'https://unpkg.com/hashed-es6@1.0.3'
import { Blog } from './drop-in-blog/blog.js'

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
    /**
     * Method to update the hash with state information. `null` when hash state not loaded.
     */
    private updateHash: ProviderCallback | null = null;
    /**
     * hashUpdated bound to the current instance.
     */
    private readonly boundHashUpdated = this.hashUpdated.bind(this);

    private blogApi: Blog | null = null;

    /**
     * The component is loading the blog content.
     */
    @observable
    loading: boolean = false;
    /**
     * The blog post summaries that are currently visible.
     */
    @observable
    posts: BlogPosting[] = [];
    /**
     * The blog post currently visible or null if showing the blog listing.
     */
    @observable
    post: BlogPosting | null = null;

    /**
     * The current page in the blog listing.
     */
    @attr({
        attribute: 'current-page',
        converter: nullableNumberConverter
    })
    currentPage: number | null = null;

    /**
     * The ID of the current blog post or null if showing the listing.
     */
    @attr({
        attribute: 'current-post',
        converter: nullableNumberConverter
    })
    currentPost: number | null = null;

    @attr({
        attribute: 'blog-id'
    })
    blogId: string | null = null;

    @attr({
        attribute: 'oauth-key'
    })
    oauthKey: string | null = null;

    /**
     * The ID for the current page in the state.
     */
    private get currentPageId(): string {
        return this.id + "Page";
    }

    /**
     * The ID of the current post in the state.
     */
    private get currentPostId(): string {
        return this.id + "Post";
    }

    /**
     * Handles the currentPage attribute changed.
     */
    currentPageChanged(): void {
        if (this.updateHash) {
            this.updateHash({
                [this.currentPageId]: this.currentPage?.toString() ?? ""
            });
            this._load();
        }
    }

    /**
     * Handles the currentPost attribute changed.
     */
    currentPostChanged(): void {
        if (this.updateHash) {
            this.updateHash({
                [this.currentPostId]: this.currentPost?.toString() ?? ""
            });
            this._load();
        }
    }

    private configureBlogApi(): void {
        if (!this.blogApi &&
            this.blogId &&
            this.oauthKey) {
                this.blogApi = new Blog(this.blogId, this.oauthKey);
        }
        if (this.updateHash) {
            this._load();
        }
    }

    blogIdChanged(): void {
        this.configureBlogApi();
    }

    oauthKeyChanged(): void {
        this.configureBlogApi();
    }

    override connectedCallback(): void {
        super.connectedCallback();

        this.updateHash = register({
            [this.currentPageId]: this.currentPage?.toString() ?? "",
            [this.currentPostId]: this.currentPost?.toString() ?? ""
        }, this.boundHashUpdated);
    }

    /**
     * Callback for when the hash is updated.
     * @param state The state from the hash.
     */
    private hashUpdated(state: Record<string, any>): void {
        let page = state[this.currentPageId];
        if (page === "") {
            page = null;
        }
        let post = state[this.currentPostId];
        if (post === "") {
            post = null;
        }
        this.currentPage = Number(page);
        this.currentPost = Number(post);
        this._load();
    }

    /**
     * Load the blog content.
     */
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

    /**
     * Load the the currently selected blog.
     * @returns true if there is a selected blog and it was loaded; otherwise, false.
     */
    private async _loadPost(): Promise<boolean> {
        if (this.currentPost) {
            const response = await this.blogApi?.getPost(this.currentPost);
            if (response && !isError(response)) {
                this.post = convertPost(response);
                return true;
            }
        }

        return false;
    }

    /**
     * Load the blog listings.
     */
    private async _loadPosts(): Promise<void> {
        this.currentPost = null;
        this.post = null;

        let currentPage: number;
        if (!this.currentPage) {
            currentPage = 0;
        } else {
            currentPage = this.currentPage;
        }

        const response = await this.blogApi?.getPosts({
            page: currentPage,

        });
        if (response && !isError(response)) {
            for (const post of response.posts ?? []) {
                if (post) {
                    this.posts.push(convertPost(post));
                }
            }
        }
    }
}