import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, isError } from './request-helper.js';
import { Author } from './schemas.js';

type Response = operations['authors-list']['responses']['200']['content']['application/json'];
type Data = NonNullable<Response['data']>;

export async function getAuthors(blogId: string, oauthKey: string): Promise<Author[] | ErrorResponse> {
    const response = orError<Data, Response>(await get<Response>(blogId, oauthKey, 'authors'), {
        authors: []
    });
    if (isError(response)) {
        return response;
    }
    return response.authors ?? [];
}