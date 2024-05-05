import { operations } from '../data/dropinblog.api'
import { BlogPosting, Person } from '../data/schema'

export type PostsOptions = operations['posts-list']['parameters']['query'];
export type PostsResponse = operations['posts-list']['responses']['200']['content']['application/json'];
export type PostsResponseData = NonNullable<PostsResponse['data']>;
export type PostsResponsePost = NonNullable<NonNullable<PostsResponse['data']>['posts']>[0];
export type PostsResponseAuthor = NonNullable<NonNullable<PostsResponsePost>['author']>;
export type PostResponse = operations['posts-retrieve']['responses']['200']['content']['application/json'];
export type PostResponsePost = NonNullable<NonNullable<PostResponse['data']>['post']>;
export type PostResponseAuthor = NonNullable<NonNullable<PostResponsePost>['author']>;

export type Post = PostsResponsePost | PostResponsePost;

export type Author = PostsResponseAuthor | PostResponseAuthor;

export interface ErrorResponse {
    readonly code: number;
    readonly message: string;
}

const blogId = 'f56590c5-56ae-4aab-8d55-df9c76db569c';
const oauthKey = '';

async function get<T>(url: URL): Promise<T> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${oauthKey}`
        }
    });
    return await response.json() as T;
}

interface Response<T> {
    success?: boolean;
    code?: number;
    message?: string;
    data?: T;
}

function orError<TData, TResponse extends Response<TData>>(response: TResponse, fallback: TData): TData | ErrorResponse {
    if (response.success) {
        return response.data ?? fallback;
    }

    return {
        code: response.code ?? 0,
        message: response.message ?? "Unknown Error"
    };
}

export function isError(obj: any): obj is ErrorResponse {
    return 'message' in obj && 'code' in obj;
}

export function isFullPost(post: Post): post is PostResponsePost {
    return 'content' in post;
}

const emptyPostsResponse: PostsResponseData = {
    pagination: {
        total: 0
    },
    posts: []
};

/**
 * Fetch a paginated collection of posts. By default, only posts that are published and accessible to the public will be returned.
 * @param options Optional options for the request.
 * @returns A PostsResponseData on success; an ErrorResponse on error.
 */
export async function getPosts(options: PostsOptions = {}): Promise<PostsResponseData | ErrorResponse> {
    const requestUrl: URL = new URL(`https://api.dropinblog.com/v2/blog/${blogId}/posts`);
    const optionsMap = options as {[k:string]:any};
    for (const optionName of Object.keys(options)) {
        requestUrl.searchParams.append(optionName, optionsMap[optionName]);
    }
    return orError(await get<PostsResponse>(requestUrl), emptyPostsResponse);
}

export async function getPost(id: number): Promise<PostResponse> {
    return await get<PostResponse>(new URL(`https://api.dropinblog.com/v2/blog/${blogId}/posts/${id}`));
}

export function convertAuthor(author: Author | undefined) : Person | undefined {
    if (author) {
        const id = author.id?.toString() ?? '0';
        return {
            "@type": "Person",
            "@id": id,
            identifier: author.slug ?? id,
            name: author.name,
            image: author.photo,
            description: author.bio,
        };
    }
    return undefined;
}

export function convertPost(post: Post) : BlogPosting {
    const id = post.id?.toString() ?? '0';
    let blogPosting: BlogPosting = {
        "@type": "BlogPosting",
        "@id": id,
        identifier: post.slug ?? id,
        abstract: post.summary,
        image: post.featuredImage,
        headline: post.title,
        datePublished: post.publishedAtIso8601,
        dateModified: post.updatedAtIso8601,
        keywords: post.keyword,
        author: convertAuthor(post.author)
    };

    if (isFullPost(post)) {
        blogPosting.articleBody = post.content;
    }

    return blogPosting;
}