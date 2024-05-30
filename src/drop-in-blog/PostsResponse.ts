import { Pagination } from "./Pagination";
import { PostSummary } from "./PostSummary";
import { Response } from "./Response";


export type PostsResponse = Response<{
    readonly posts: PostSummary[];
    readonly pagination?: Pagination;
}>;
