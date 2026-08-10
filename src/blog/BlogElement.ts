import { LitElement, html, css, nothing } from 'https://unpkg.com/lit@3.3.2/index.js'
import { customElement, property, state } from 'https://unpkg.com/lit@3.3.2/decorators.js'
import { unsafeHTML } from 'https://unpkg.com/lit@3.3.2/directives/unsafe-html.js'
import { register, unregister, ProviderCallback } from 'https://unpkg.com/hashed-es6@1.0.3'
import { Blog } from '../drop-in-blog/Blog.js'
import { Post } from '../drop-in-blog/Post.js'
import { PostSummary } from '../drop-in-blog/PostSummary.js'

@customElement('blog-element')
export class BlogElement extends LitElement {
    static override styles = css`
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

        section.blog-posts wa-card {
            color: var(--wa-color-neutral-700);
            margin: 10px;
            width: 40vw;
            min-width: 250px;
            max-width: 300px;
            cursor: pointer;
        }

        section.blog-posts wa-card img {
            max-width: 300px;
            width: 100%;
        }

        section.blog-posts wa-card div {
            padding: 0 10px 10px;
        }

        section.blog-posts wa-card time {
            font-style: italic;
        }

        section.blog-posts wa-card p {
            overflow-y: auto;
            max-height: 100px;
        }

        section.blog-posts wa-card h2 {
            text-overflow: ellipsis;
            overflow-x: clip;
            white-space: nowrap;
        }

        section.blog-post {
            margin: 20px;
        }

        section.blog-post .back-button {
            cursor: pointer;
            font-size: 1.2em;
            margin-right: 8px;
        }

        section.blog-post h1 {
            display: flex;
            flex-wrap: wrap;
        }

        section.blog-post h1 span {
            margin: auto;
        }

        section.blog-post img {
            border: 1px solid var(--wa-color-neutral-300);
            border-radius: var(--wa-border-radius-medium);
            box-shadow: var(--wa-shadow-small);
            object-fit: cover;
            width: 100%;
            max-height: 300px;
        }

        section.blog-post a {
            color: var(--wa-color-primary-600);
        }

        section.blog-post a:hover {
            color: var(--wa-color-primary-700);
        }

        section.blog-post a:active {
            color: var(--wa-color-primary-800);
        }

        section.blog-post a:focus {
            color: var(--wa-color-primary-700);
        }

        section.blog-post a.badge {
            text-decoration: none !important;
            display: block;
        }

        section.blog-post time {
            font-style: italic;
            display: block;
        }

        .blog-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
            padding: 20px 10px;
        }

        .blog-pagination button {
            background: none;
            border: 1px solid var(--wa-color-neutral-300);
            border-radius: var(--wa-border-radius-medium);
            color: var(--wa-color-primary-600);
            cursor: pointer;
            padding: 6px 12px;
            font-size: 1em;
        }

        .blog-pagination button:hover:not(:disabled) {
            color: var(--wa-color-primary-700);
            border-color: var(--wa-color-primary-600);
        }

        .blog-pagination button:disabled {
            opacity: 0.3;
            cursor: default;
        }

        .blog-pagination span {
            user-select: none;
        }

        @media (max-width: 480px) {
            section.blog-posts wa-card {
                width: calc(100% - 20px);
                max-width: none;
                min-width: 0;
            }

            section.blog-posts wa-card img {
                max-width: none;
            }

            section.blog-posts > div {
                padding-left: 0;
            }

            section.blog-post {
                margin: 10px;
            }

            section.blog-post h1 {
                font-size: 1.3em;
            }
        }
    `;

    private updateHash: ProviderCallback | null = null;
    private readonly boundHashUpdated = this.hashUpdated.bind(this);
    private blogApi: Blog | null = null;
    private loadGeneration: number = 0;

    @state()
    private loading: boolean = false;

    @state()
    private posts: PostSummary[] = [];

    @state()
    private post: Post | null = null;

    @state()
    private totalPages: number = 0;

    @property({ attribute: 'current-page', type: Number, reflect: true })
    currentPage: number | null = null;

    @property({ attribute: 'current-post', type: Number, reflect: true })
    currentPost: number | null = null;

    @property({ attribute: 'current-slug' })
    currentSlug: string | null = null;

    @property({ attribute: 'blog-id' })
    blogId: string | null = null;

    @property({ attribute: 'oauth-key' })
    oauthKey: string | null = null;

    private get currentPageId(): string {
        return this.id + "Page";
    }

    private get currentPostId(): string {
        return this.id + "Post";
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.updateHash = register({
            [this.currentPageId]: this.currentPage?.toString() ?? "",
            [this.currentPostId]: this.currentPost?.toString() ?? ""
        }, this.boundHashUpdated);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        // Detach the hashed-es6 provider so a removed element no longer reacts to
        // hash changes (which would otherwise call _load() and dispatch events
        // after the element left the DOM). This also lets connectedCallback
        // re-register cleanly if the element is reconnected.
        if (this.updateHash) {
            this.updateHash = null;
            try {
                unregister(this.boundHashUpdated);
            } catch { /* already detached (e.g. store reset) */ }
        }
    }

    override updated(changedProperties: Map<string, unknown>): void {
        if (changedProperties.has('blogId') || changedProperties.has('oauthKey')) {
            this.configureBlogApi();
        }
        if (changedProperties.has('currentPage') && this.updateHash) {
            this.updateHash({ [this.currentPageId]: this.currentPage?.toString() ?? "" });
            this._load();
        }
        if (changedProperties.has('currentPost') && this.updateHash) {
            this.updateHash({ [this.currentPostId]: this.currentPost?.toString() ?? "" });
            if (this.post?.id !== this.currentPost) {
                this._load();
            }
        }
        if (changedProperties.has('currentSlug') && this.currentSlug) {
            const slug = this.currentSlug;
            this.currentSlug = null;
            this._resolveSlug(slug);
        }
    }

    private async _resolveSlug(slug: string): Promise<void> {
        if (!this.blogApi) {
            return;
        }
        const generation = ++this.loadGeneration;
        this.loading = true;
        try {
            const post = await this.blogApi.getPostBySlug(slug);
            if (generation !== this.loadGeneration) {
                return;
            }
            this.post = post ?? null;
            this.currentPost = post?.id ?? null;
        } catch { /* ignore */ }
        finally {
            if (generation === this.loadGeneration) {
                this.loading = false;
                this.dispatchEvent(new Event('change'));
            }
        }
    }

    private configureBlogApi(): void {
        if (!this.blogApi && this.blogId && this.oauthKey) {
            this.blogApi = new Blog(this.blogId, this.oauthKey);
        }
        if (this.updateHash) {
            this._load();
        }
    }

    private hashUpdated(state: Record<string, any>): void {
        let page = state[this.currentPageId];
        if (page === "") page = null;
        let post = state[this.currentPostId];
        if (post === "") post = null;
        this.currentPage = page != null ? Number(page) : null;
        this.currentPost = post != null ? Number(post) : null;
        this._load();
    }

    private async _load(): Promise<void> {
        if (!this.blogApi) {
            return;
        }
        const generation = ++this.loadGeneration;
        this.loading = true;
        this.posts = [];

        try {
            if (this.currentPost) {
                const post = await this.blogApi.getPost(this.currentPost);
                if (generation !== this.loadGeneration) {
                    return;
                }
                if (post) {
                    this.post = post;
                    return;
                }
            }

            const currentPage = this.currentPage ?? 0;
            const response = await this.blogApi.getPosts({ page: currentPage });
            if (generation !== this.loadGeneration) {
                return;
            }
            this.currentPost = null;
            this.post = null;
            if (response) {
                this.totalPages = response.pagination?.last_page ?? 0;
                this.posts = (response.posts ?? []).filter((p): p is PostSummary => p != null);
            }
        } catch { /* ignore */ }
        finally {
            if (generation === this.loadGeneration) {
                this.loading = false;
                this.dispatchEvent(new Event('change'));
            }
        }
    }

    override render() {
        if (this.loading) {
            return html`<section class="blog-loading"><div><wa-spinner></wa-spinner></div></section>`;
        }
        if (this.post) {
            return this.renderPost();
        }
        if (this.posts.length === 0) {
            return html`<section class="no-posts"><h1>No Posts</h1></section>`;
        }
        return this.renderPostList();
    }

    private renderPost() {
        const post = this.post!;
        return html`
        <section class="blog-post">
            <h1>
                <span class="back-button" @click=${() => this.currentPost = null}>←</span>
                <span>${post.title}</span>
            </h1>
            <img src="${post.featuredImage ?? ''}" alt="${post.title ?? ''}" />
            <time datetime="${post.publishedAt ?? ''}">${post.publishedAt ? new Date(post.publishedAt).toLocaleString() : ''}</time>
            <article>${unsafeHTML(post.content ?? '')}</article>
        </section>`;
    }

    private renderPostList() {
        return html`
        <section class="blog-posts">
            <div>
                ${this.posts.map(post => html`
                <wa-card
                    itemscope
                    itemtype="https://schema.org/BlogPosting"
                    @click=${() => this.currentPost = Number(post.id?.toString() ?? '0')}>
                    <img slot="media" itemprop="image" src="${post.featuredImage ?? ''}" alt="${post.title ?? ''}" />
                    <div>
                        <h2 itemprop="headline">${post.title}</h2>
                        <time datetime="${post.publishedAt ?? ''}">${post.publishedAt ? new Date(post.publishedAt).toLocaleString() : ''}</time>
                        <p itemprop="abstract">${post.summary}</p>
                    </div>
                </wa-card>`)}
            </div>
            ${this.totalPages > 1 ? html`
            <nav class="blog-pagination">
                <button ?disabled=${(this.currentPage ?? 0) <= 0}
                    @click=${() => { if ((this.currentPage ?? 0) > 0) this.currentPage = (this.currentPage ?? 0) - 1; }}>
                    ← Previous
                </button>
                <span>Page ${(this.currentPage ?? 0) + 1} of ${this.totalPages}</span>
                <button ?disabled=${(this.currentPage ?? 0) + 1 >= this.totalPages}
                    @click=${() => { if ((this.currentPage ?? 0) + 1 < this.totalPages) this.currentPage = (this.currentPage ?? 0) + 1; }}>
                    Next →
                </button>
            </nav>` : nothing}
        </section>`;
    }
}
