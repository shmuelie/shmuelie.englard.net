import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get } from './request-helper.js';

export type Options = operations['posts-list']['parameters']['query'];
export type Response = operations['posts-list']['responses']['200']['content']['application/json'];
export type Data = NonNullable<Response['data']>;
export type Post = NonNullable<Data['posts']>[0];
export type Author = NonNullable<NonNullable<Post>['author']>;

/**
 * Fetch a paginated collection of posts. By default, only posts that are published and accessible to the public will be returned.
 * @param options Optional options for the request.
 * @returns A Data on success; an ErrorResponse on error.
 */
export async function getPosts(blogId: string, oauthKey: string, options: Options = {}): Promise<Data | ErrorResponse> {
    return orError<Data, Response>(await get<Response>(blogId, oauthKey, 'posts', options as {[k:string]:any}), {
        pagination: {
            total: 0
        },
        posts: []
    });
}