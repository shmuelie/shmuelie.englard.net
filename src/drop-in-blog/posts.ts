import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get } from './request-helper.js';

export type Options = operations['posts-list']['parameters']['query'];
type Response = operations['posts-list']['responses']['200']['content']['application/json'];
export type PostsResponse = NonNullable<Response['data']>;

/**
 * Fetch a paginated collection of posts. By default, only posts that are published and accessible to the public will be returned.
 * @param options Optional options for the request.
 * @returns A Data on success; an ErrorResponse on error.
 */
export async function getPosts(blogId: string, oauthKey: string, options: Options = {}): Promise<PostsResponse | ErrorResponse> {
    return orError<PostsResponse, Response>(await get<Response>(blogId, oauthKey, 'posts', options as {[k:string]:any}), {
        pagination: {
            total: 0
        },
        posts: []
    });
}