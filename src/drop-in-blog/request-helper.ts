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

// This key is read-only so it's safe to commit
const oauthKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWQxODQzOC1lMzAyLTRiMmYtYmNjZC03ZjNhZmM0MTU1ZDAiLCJqdGkiOiI4MzYzMDYwYWUzNzZiYjdiZjgxNzc0YWUwNDdhMWQ4MmY0OTFhZTFlZDBjZDUwNjgzMDJiOGExMjc2NTBlNGE0ZDkwYzhlODc2YTU5ZDM2ZSIsImlhdCI6MTcxNDM5NTI1MS43NjA0MTYsIm5iZiI6MTcxNDM5NTI1MS43NjA0MjEsImV4cCI6MjUwMzMxMzY1MS42ODAzNzUsInN1YiI6IjcwNDU3MDU5NTM3NiIsInNjb3BlcyI6W119.WHUVAeNQdjOMmktUq04JBwNtz4oU75Erxl0GIoz63XyKXZxZU1rb9UOaom6jdPOuGik3lc6nirLpHzI6pHVVeoilJRuzCo3AVL845XgAlhWp8Vr_dPMpXUOf3xdkvI3J6TxIskZowe8thQRirlH3Ror0V8FL9AtqHlQTS-GFME7CcWVi7kAfiLTEw8Pd9iYOaDEKtQFqYhgoTgN6PoX3u0xKiJqxK6iF4WtOFu5R3BH9c9IUuWMiIGpA5A53vGYUgjftkn6ccRlN7frFtU_11mUcsUvyVgQSzozNKzVxa0ODJzfRhqtGMQhuMPq2G6C_rtfzLjaP00prMBzaT56nQDadfUuCHvcbdX-Kpp-vSOoYf6XNyfBFAAW7fsZiBv7r09pYhLsZ4ZWeIyAk91W9nwyBXJY-_8NBd5YmD-UfEfXrxcxQyNjHWJK2zdvzDGQ0vVBrgctY43f4MHXqXqhRobeMmuQRESdJQL3qdsr-dPc_rU_oZEHPH5TEc0_bF5opmJtkmGspMABV9sY3Tp38aocVx6Cas0ecOKtByY2CFiszJdmH2AU3nl9bjyOkRc0I1gClxD7TFtcJq2_D0hB1IH1qldRRy6pAJXpeXrOq2ZK-lbixxAqPq07spYNgd3TKO-MgC0BPWg9inOp5rqXfH7kznadQG_mIrE8yhbWrFmw';
const blogId = 'f56590c5-56ae-4aab-8d55-df9c76db569c';

export const rootUrl = `https://api.dropinblog.com/v2/blog/${blogId}`;

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