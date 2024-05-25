import { getPosts, Data, Options } from './posts.js';
import { getPost, Post } from './post.js';
import { getAuthors, Author } from './authors.js';
import { getCategories, Category } from './categories.js';
import { searchPosts, Query, Post as SearchPost } from './search.js';
import { ErrorResponse } from './request-helper.js';

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

    async getPosts(options: Options = {}): Promise<Data | ErrorResponse> {
        return await getPosts(this.blogId, this.oauthKey, options);
    }

    async searchPosts(query: Query): Promise<SearchPost[] | ErrorResponse> {
        return await searchPosts(this.blogId, this.oauthKey, query);
    }

    async getCategories(): Promise<Category[] | ErrorResponse> {
        return await getCategories(this.blogId, this.oauthKey);
    }

    async getPost(id: number): Promise<Post | ErrorResponse | null> {
        return await getPost(this.blogId, this.oauthKey, id);
    }
}