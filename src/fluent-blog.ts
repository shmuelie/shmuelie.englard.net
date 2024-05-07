import { } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { attr, html, repeat, observable, FASTElement, customElement, css, when, ValueConverter } from 'https://unpkg.com/@microsoft/fast-element@1.13.0'
import { BlogPosting } from '../data/schema'
import { getPosts } from './drop-in-blog/posts.js'
import { convertPost } from './drop-in-blog/schema-converters.js'
import { getPost } from './drop-in-blog/post.js'
import { isError } from './drop-in-blog/request-helper.js'

const listPostsTemplate = html<BlogPosting, FluentBlog>`
<fluent-card
    itemscope
    itemtype="https://schema.org/BlogPosting"
    title=${x => x.headline}
    @click="${(x, c) => c.parent.currentPost = Number(x['@id'])}">
    <img itemprop="image" src="${x => x.image}" alt="${x => x.headline}" />
    <div>
        <h2 itemprop="headline">${x => x.headline}</h2>
        <p itemprop="abstract">${x => x.abstract}</p>
    </div>
</fluent-card>
`

const listTemplate = html<FluentBlog>`
<section class="blog-posts">
    <h1>${x => x.title }</h1>
    <div>
        ${repeat(x => x.posts!, listPostsTemplate)}
    </div>
</section>
`;

const singleTemplate = html<FluentBlog>`
<section class="blog-post">
    <h1>${x => x.post?.headline}</h1>
    <img src="${x => x.post?.image}" alt="${x => x.post?.headline}" />
    <article :innerHTML="${x => x.post?.articleBody}"></article>
</section>
`;

const loadingTemplate = html<FluentBlog>`
<section class="blog-posts">
    <h1>${x => x.title }</h1>
    <div>
        <fluent-progress-ring></fluent-progress-ring>
    </div>
</section>
`;

const template = html<FluentBlog>`
    ${when(x => x.posts === null, loadingTemplate)}
    ${when(x => x.post === null && x.posts !== null, listTemplate)}
    ${when(x => x.post !== null, singleTemplate)}
`;

const styles = css`
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

    section.blog-posts fluent-card p {
        overflow-y: auto;
        height: 100px;
    }

    section.blog-posts fluent-card h2 {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
`;

const numberConverter: ValueConverter = {
    toView(value: number | null | undefined): string {
        if (value && !Number.isNaN(value)) {
            value.toString();
        }
        return "";
    },
    fromView(value: string | null | undefined): number {
        if (value) {
            return Number(value);
        }
        return Number.NaN;
    }
};

@customElement({
    name: 'fluent-blog',
    template: template,
    styles: styles
})
export class FluentBlog extends FASTElement {
    private _loading: boolean = false;
    @observable
    posts: BlogPosting[] | null = null;
    @observable
    post: BlogPosting | null = null;

    @attr({
        attribute: 'current-page',
        converter: numberConverter
    })
    currentPage: number | null = null;

    @attr({
        attribute: 'current-post',
        converter: numberConverter
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

        this._load();
    }

    private async _load(): Promise<void> {
        if (this._loading) {
            return;
        }
        this._loading = true;

        if (this.currentPost) {
            const response = await getPost(this.currentPost);
            if (response && !isError(response)) {
                this.post = convertPost(response);
                this._loading = false;
                return;
            }
        }

        let currentPage: number;
        if (!this.currentPage) {
            currentPage = 0;
        } else {
            currentPage = this.currentPage;
        }
        if (!this.currentPost) {
            this.currentPost = null;
        }

        const response = await getPosts({
            page: currentPage
        });
        if (this.posts !== null) {
            this.posts.splice(0, this.posts.length);
        } else {
            this.posts = [];
        }
        if (!isError(response)) {
            for (const post of response.posts ?? []) {
                if (post) {
                    this.posts.push(convertPost(post));
                }
            }
        }
        this._loading = false;
    }
}