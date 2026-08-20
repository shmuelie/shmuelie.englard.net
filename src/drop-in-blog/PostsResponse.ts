import { Pagination } from "./Pagination.js";
import { PostSummary } from "./PostSummary.js";
import { Response } from "./Response.js";


export type PostsResponse = Response<{
    readonly posts: PostSummary[];
    readonly pagination?: Pagination;
}>;
