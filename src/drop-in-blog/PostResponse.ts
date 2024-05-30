import { Post } from "./_Post";
import { Response } from "./Response";


export type PostResponse = Response<{
    readonly post?: Post;
}>;
