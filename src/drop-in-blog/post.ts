import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, rootUrl, isError } from './request-helper.js';

export type Response = operations['posts-retrieve']['responses']['200']['content']['application/json'];
export type Data = NonNullable<Response['data']>;
export type Post = NonNullable<Data['post']>;
export type Author = NonNullable<NonNullable<Post>['author']>;

/**
 * Retrieve a post
 * @param id The ID of the post.
 * @returns A post.Post on success; an ErrorResponse on error.
 */
export async function getPost(id: number): Promise<Post | ErrorResponse | null> {
    const response =  orError<Data, Response>(await get<Response>(new URL(`${rootUrl}/posts/${id}`)), {});
    if (isError(response)) {
        return response;
    }
    return response.post ?? null;
}