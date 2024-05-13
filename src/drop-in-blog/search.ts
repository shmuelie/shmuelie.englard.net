import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, rootUrl, isError } from './request-helper.js';

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
export async function searchPosts(query: Query): Promise<Post[] | ErrorResponse> {
    const requestUrl: URL = new URL(`${rootUrl}/search`);
    const queryMap = query as {[k:string]:any};
    for (const queryName of Object.keys(query)) {
        requestUrl.searchParams.append(queryName, queryMap[queryName]);
    }
    const response = orError<Data, Response>(await get<Response>(requestUrl), {
        posts: []
    });
    if (isError(response)) {
        return response;
    }
    return response.posts ?? [];
}