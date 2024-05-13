import { operations } from '../../data/dropinblog.api';
import { ErrorResponse, orError, get, rootUrl, isError } from './request-helper.js';

export type Response = operations['authors-list']['responses']['200']['content']['application/json'];
export type Data = NonNullable<Response['data']>;
export type Author = NonNullable<Data['authors']>[0];

export async function getAuthors(): Promise<Author[] | ErrorResponse> {
    const response = orError<Data, Response>(await get<Response>(new URL(`${rootUrl}/authors`)), {
        authors: []
    });
    if (isError(response)) {
        return response;
    }
    return response.authors ?? [];
}