import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, isError } from './request-helper.js';

export type Query = operations['posts-search']['parameters']['query'];
export type Response = operations['posts-search']['responses']['200']['content']['application/json'];
export type Data = NonNullable<Response['data']>;
export type Post = NonNullable<Data['posts']>[0];
export type Author = NonNullable<NonNullable<Post>['author']>;

/**
 * Search for posts.
 * @param query The search query.
 * @returns An array of posts on success; an ErrorResponse on error.
 */
export async function searchPosts(blogId: string, oauthKey: string, query: Query): Promise<Post[] | ErrorResponse> {
    const response = orError<Data, Response>(await get<Response>(blogId, oauthKey, 'search', query as {[k:string]:any}), {
        posts: []
    });
    if (isError(response)) {
        return response;
    }
    return response.posts ?? [];
}