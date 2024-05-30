
export interface PostsParameters {
    /** @description Post status filter (draft, published, scheduled) with a comma separated list. Defaults to published. */
    statuses?: string;
    /** @description Post status visibility (public, private) with a comma separated list. Defaults to public. */
    visibilities?: string;
    /** @description The current page of pagination. */
    page?: number;
    /** @description The number of posts to returns. Defaults to posts per page in settings. */
    limit?: number;
    /** @description Filter by specific category with a comma separated list of category IDs. */
    category_ids?: string;
    /** @description Filter by specific category with a comma separated list of category slugs. */
    category_slugs?: string;
    /** @description Filter by specific author with a comma separated list of author IDs. */
    author_ids?: string;
    /** @description Filter by specific author with a comma separated list of author slugs. */
    author_slugs?: string;
    /** @description Filter by specific post with a comma separated list of post IDs. */
    post_ids?: string;
    /** @description Filter by specific post with a comma separated list of post slugs. */
    post_slugs?: string;
}
