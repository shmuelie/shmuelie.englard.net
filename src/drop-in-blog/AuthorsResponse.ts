import { Author } from "./Author.js";
import { Response } from "./Response.js";


export type AuthorsResponse = Response<{
    readonly authors?: Author[];
}>;
