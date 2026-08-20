import { Post } from "./Post.js";
import { Response } from "./Response.js";


export type PostResponse = Response<{
    readonly post?: Post;
}>;
