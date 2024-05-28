import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, isError } from './request-helper.js';
import { Category } from './schemas.js'

type Response = operations['categories-list']['responses']['200']['content']['application/json'];
type Data = NonNullable<Response['data']>;

export async function getCategories(blogId: string, oauthKey: string): Promise<Category[] | ErrorResponse> {
    const response = orError<Data, Response>(await get<Response>(blogId, oauthKey, 'categories'), {
        categories: []
    });
    if (isError(response)) {
        return response;
    }
    return response.categories ?? [];
}