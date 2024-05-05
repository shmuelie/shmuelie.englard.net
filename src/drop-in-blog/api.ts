import { ErrorResponse, orError, get, isError } from './request-helper.js';
import { post, posts } from './types.js';

const blogId = 'f56590c5-56ae-4aab-8d55-df9c76db569c';

/**
 * Fetch a paginated collection of posts. By default, only posts that are published and accessible to the public will be returned.
 * @param options Optional options for the request.
 * @returns A posts.Data on success; an ErrorResponse on error.
 */
export async function getPosts(options: posts.Options = {}): Promise<posts.Data | ErrorResponse> {
    const requestUrl: URL = new URL(`https://api.dropinblog.com/v2/blog/${blogId}/posts`);
    const optionsMap = options as {[k:string]:any};
    for (const optionName of Object.keys(options)) {
        requestUrl.searchParams.append(optionName, optionsMap[optionName]);
    }
    return orError<posts.Data, posts.Response>(await get<posts.Response>(requestUrl), {
        pagination: {
            total: 0
        },
        posts: []
    });
}

/**
 * Retrieve a post
 * @param id The ID of the post.
 * @returns A post.Post on success; an ErrorResponse on error.
 */
export async function getPost(id: number): Promise<post.Post | ErrorResponse | null> {
    const response =  orError<post.Data, post.Response>(await get<post.Response>(new URL(`https://api.dropinblog.com/v2/blog/${blogId}/posts/${id}`)), {});
    if (isError(response)) {
        return response;
    }
    return response.post ?? null;
}