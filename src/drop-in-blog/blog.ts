import { getPosts, PostsResponse, Options as PostsOptions } from './posts.js';
export { PostsResponse, Options as PostsOptions} from './posts.js';
import { getPost } from './post.js';
import { getAuthors } from './authors.js';
import { getCategories } from './categories.js';
import { searchPosts, Query } from './search.js';
export { Query } from './search.js';
import { ErrorResponse } from './request-helper.js';
import { Author, Category, Post, PostSummary } from './schemas.js';
export { Author, Category, Post, PostSummary } from './schemas.js';

export class Blog {
    readonly blogId: string;
    readonly oauthKey: string;

    constructor(blogId: string, oauthKey: string) {
        this.blogId = blogId;
        this.oauthKey = oauthKey;
    }

    async getAuthors(): Promise<Author[] | ErrorResponse> {
        return await getAuthors(this.blogId, this.oauthKey);
    }

    async getPosts(options: PostsOptions = {}): Promise<PostsResponse | ErrorResponse> {
        return await getPosts(this.blogId, this.oauthKey, options);
    }

    async searchPosts(query: Query): Promise<PostSummary[] | ErrorResponse> {
        return await searchPosts(this.blogId, this.oauthKey, query);
    }

    async getCategories(): Promise<Category[] | ErrorResponse> {
        return await getCategories(this.blogId, this.oauthKey);
    }

    async getPost(id: number): Promise<Post | ErrorResponse | null> {
        return await getPost(this.blogId, this.oauthKey, id);
    }
}