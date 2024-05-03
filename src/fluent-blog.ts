import { allComponents, baseLayerLuminance, provideFluentDesignSystem, StandardLuminance, fluentCard } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { DesignToken, FoundationElement } from 'https://unpkg.com/@microsoft/fast-foundation@2.49.6'
import { attr, html } from 'https://unpkg.com/@microsoft/fast-element@1.13.0'
import { BlogPosting } from '../data/schema'
import { apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.4'
import { getPosts, convertPost, getPost } from './drop-in-blog.js'

const template = html<FluentBlog>`
    <section class="blog-posts">
        <h1>${x => x.title }</h1>
        <div>
            <template data-type="BlogPosting">
                <slot></slot>
            </template>
        </div>
    </section>
`;

export class FluentBlog extends FoundationElement {
    private _posts: BlogPosting[] = [];
    private _template: HTMLTemplateElement | null = null;
    private _post: BlogPosting | null = null;

    constructor() {
        super();
    }

    get posts(): BlogPosting[] {
        return this._posts;
    }

    get post(): BlogPosting | null {
        return this._post;
    }

    @attr({
        attribute: 'current-page'
    })
    currentPage: number | null = null;

    @attr({
        attribute: 'current-post'
    })
    currentPost: number | null = null;

    currentPageChanged(): void {
        this._loadPosts();
    }

    currentPostChanged(): void {
        this._loadPost();
    }

    override connectedCallback(): void {
        super.connectedCallback();

        this._template = this.ownerDocument.createElement("template");
        this._template.dataset['type'] = "BlogPosting";
        if (this.firstChild) {
            this._template.appendChild(this.firstChild.cloneNode());
        }

        this._loadPost();
    }

    private async _loadPosts(): Promise<void> {
        let currentPage: number;
        if (!this.currentPage) {
            currentPage = 0;
        } else {
            currentPage = this.currentPage;
        }
        this.currentPost = null;

        const response = await getPosts({
            page: currentPage
        });
        this._posts = response?.data?.posts?.map(convertPost) ?? [];
        const postsElement = this.shadowRoot!.querySelector('section.blog-posts > div') as HTMLElement;
        apply(this._posts as unknown as Thing, postsElement);
    }

    private async _loadPost(): Promise<void> {
        if (!this.currentPost) {
            await this._loadPosts();
            return;
        }

        const response = await getPost(this.currentPost);
        const post = response?.data?.post;
        if (!post) {
            this.currentPost = null;
            await this._loadPosts();
            return;
        }

        this._post = convertPost(post);
    }
}

export const fluentBlog = FoundationElement.compose({
    baseName: 'blog',
    baseClass: FluentBlog,
    template: template
});