import { Post } from "./Post";
import { Response } from "./Response";


export type PostResponse = Response<{
    readonly post?: Post;
}>;
