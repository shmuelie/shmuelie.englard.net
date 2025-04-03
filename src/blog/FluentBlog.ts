import { } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { attr, observable, FASTElement, customElement, nullableNumberConverter } from 'https://unpkg.com/@microsoft/fast-element@1.14.0'
import { register, ProviderCallback } from 'https://unpkg.com/hashed-es6@1.0.3'
import { Blog } from '../drop-in-blog/Blog.js'
import { template } from './template.js'
import { styles } from './styles.js'
import { IFluentBlog } from './IFluentBlog.js'
import { Post } from '../drop-in-blog/Post.js'
import { PostSummary } from '../drop-in-blog/PostSummary'

@customElement({
    name: 'fluent-blog',
    template: template,
    styles: styles
})
export class FluentBlog extends FASTElement implements IFluentBlog {
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
    posts: PostSummary[] = [];
    /**
     * The blog post currently visible or null if showing the blog listing.
     */
    @observable
    post: Post | null = null;

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
            try {
                const response = await this.blogApi?.getPost(this.currentPost);
                if (response) {
                    this.post = response;
                    return true;
                }
            }
            catch {
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

        try {
            const response = await this.blogApi?.getPosts({
                page: currentPage
            });
            if (response) {
                for (const post of response.posts ?? []) {
                    if (post) {
                        this.posts.push(post);
                    }
                }
            }
        }
        catch {
        }
    }
}