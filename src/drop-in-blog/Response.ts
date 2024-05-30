
export interface Response<T> {
    readonly success: boolean;
    readonly code: number;
    readonly locale: string;
    readonly message: string;
    readonly data: T;
}
