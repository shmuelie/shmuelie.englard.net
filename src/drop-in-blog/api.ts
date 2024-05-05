import { ErrorResponse, orError, get } from './request-helper.js';
import { PostsResponseData, PostsOptions, PostsResponse, PostResponse } from './types.js';

const blogId = 'f56590c5-56ae-4aab-8d55-df9c76db569c';

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