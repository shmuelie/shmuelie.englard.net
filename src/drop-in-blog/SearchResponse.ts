import { PostSummary } from "./PostSummary";
import { Response } from "./Response";


export type SearchResponse = Response<{
    readonly posts?: PostSummary[];
}>;
