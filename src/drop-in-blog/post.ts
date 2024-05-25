import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, isError } from './request-helper.js';

export type Response = operations['posts-retrieve']['responses']['200']['content']['application/json'];
export type Data = NonNullable<Response['data']>;
export type Post = NonNullable<Data['post']>;
export type Author = NonNullable<NonNullable<Post>['author']>;

/**
 * Retrieve a post
 * @param id The ID of the post.
 * @returns A post.Post on success; an ErrorResponse on error.
 */
export async function getPost(blogId: string, oauthKey: string, id: number): Promise<Post | ErrorResponse | null> {
    const response =  orError<Data, Response>(await get<Response>(blogId, oauthKey, `posts/${id}`), {});
    if (isError(response)) {
        return response;
    }
    return response.post ?? null;
}