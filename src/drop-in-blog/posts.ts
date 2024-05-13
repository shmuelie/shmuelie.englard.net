import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, rootUrl } from './request-helper.js';

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
export async function getPosts(options: Options = {}): Promise<Data | ErrorResponse> {
    const requestUrl: URL = new URL(`${rootUrl}/posts`);
    const optionsMap = options as {[k:string]:any};
    for (const optionName of Object.keys(options)) {
        requestUrl.searchParams.append(optionName, optionsMap[optionName]);
    }
    return orError<Data, Response>(await get<Response>(requestUrl), {
        pagination: {
            total: 0
        },
        posts: []
    });
}