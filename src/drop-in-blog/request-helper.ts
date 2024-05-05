export interface ErrorResponse {
    readonly code: number;
    readonly message: string;
}

interface Response<T> {
    success?: boolean;
    code?: number;
    message?: string;
    data?: T;
}

export function orError<TData, TResponse extends Response<TData>>(response: TResponse, fallback: TData): TData | ErrorResponse {
    if (response.success) {
        return response.data ?? fallback;
    }

    return {
        code: response.code ?? 0,
        message: response.message ?? "Unknown Error"
    };
}

export function isError(obj: any): obj is ErrorResponse {
    return 'message' in obj && 'code' in obj;
}

const oauthKey = '';

export async function get<T>(url: URL): Promise<T> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${oauthKey}`
        }
    });
    return await response.json() as T;
}