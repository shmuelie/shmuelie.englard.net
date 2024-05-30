import { Author } from "./Author";
import { Response } from "./Response";


export type AuthorsResponse = Response<{
    readonly authors?: Author[];
}>;
