import { PostSummary } from "./PostSummary.js";
import { Response } from "./Response.js";


export type SearchResponse = Response<{
    readonly posts?: PostSummary[];
}>;
