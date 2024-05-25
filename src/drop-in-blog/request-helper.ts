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

export async function get<T>(
    blogId: string,
    oauthKey: string,
    api: string,
    options?: {
        [k: string]: string
    }): Promise<T> {
    const requestUrl: URL = new URL(`https://api.dropinblog.com/v2/blog/${blogId}/${api}`);
    if (options) {
        for (const optionName of Object.keys(options)) {
            requestUrl.searchParams.append(optionName, options[optionName]);
        }
    }
    const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${oauthKey}`
        }
    });
    return await response.json() as T;
}