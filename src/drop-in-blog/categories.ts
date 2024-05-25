import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, isError } from './request-helper.js';

export type Response = operations['categories-list']['responses']['200']['content']['application/json'];
export type Data = NonNullable<Response['data']>;
export type Category = NonNullable<Data['categories']>[0];

export async function getCategories(blogId: string, oauthKey: string): Promise<Category[] | ErrorResponse> {
    const response = orError<Data, Response>(await get<Response>(blogId, oauthKey, 'categories'), {
        categories: []
    });
    if (isError(response)) {
        return response;
    }
    return response.categories ?? [];
}