import { operations } from '../data/dropinblog.api'
import { BlogPosting, Person } from '../data/schema'

export type PostsOptions = operations['posts-list']['parameters']['query'];
export type PostsResponse = operations['posts-list']['responses']['200']['content']['application/json'];
export type PostsResponsePost = NonNullable<NonNullable<PostsResponse['data']>['posts']>[0];
export type PostsResponseAuthor = NonNullable<NonNullable<PostsResponsePost>['author']>;
export type PostResponse = operations['posts-retrieve']['responses']['200']['content']['application/json'];
export type PostResponsePost = NonNullable<NonNullable<PostResponse['data']>['post']>;
export type PostResponseAuthor = NonNullable<NonNullable<PostResponsePost>['author']>;

export type Post = PostsResponsePost | PostResponsePost;

export type Author = PostsResponseAuthor | PostResponseAuthor;

const blogId = 'f56590c5-56ae-4aab-8d55-df9c76db569c';
const oauthKey = '';

/**
 * Fetch a paginated collection of posts. By default, only posts that are published and accessible to the public will be returned.
 * @param options Optional options for the request.
 * @returns A collection of posts.
 */
export async function getPosts(options: PostsOptions = {}): Promise<PostsResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${oauthKey}`
        }
    };
    const requestUrl: URL = new URL(`https://api.dropinblog.com/v2/blog/${blogId}/posts`);
    const optionsMap = options as {[k:string]:any};
    for (const optionName of Object.keys(options)) {
        requestUrl.searchParams.append(optionName, optionsMap[optionName]);
    }
    const response = await fetch(requestUrl, requestOptions);
    return await response.json() as PostsResponse;
}

export async function getPost(id: number): Promise<PostResponse> {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${oauthKey}`
        }
    };
    const requestUrl = new URL(`https://api.dropinblog.com/v2/blog/${blogId}/posts/${id}`);
    const response = await fetch(requestUrl, requestOptions);
    return await response.json() as PostResponse;
}

export function convertAuthor(author: Author | undefined) : Person | undefined {
    if (author) {
        return {
            "@type": "Person",
            name: author.name,
            image: author.photo,
            identifier: author.slug,
            description: author.bio
        };
    }
    return undefined;
}

export function convertPost(post: Post) : BlogPosting {
    let blogPosting: BlogPosting = {
        "@type": "BlogPosting",
        "@id": post.id?.toString() ?? '0',
        abstract: post.summary,
        image: post.featuredImage,
        headline: post.title,
        datePublished: post.publishedAtIso8601,
        dateModified: post.updatedAtIso8601,
        keywords: post.keyword,
        author: convertAuthor(post.author)
    };

    if ('content' in post) {
        blogPosting.articleBody = post.content;
    }

    return blogPosting;
}