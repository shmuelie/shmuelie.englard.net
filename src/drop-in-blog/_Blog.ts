import { ApiError } from './ApiError.js';
import { AuthorsResponse } from "./AuthorsResponse.js";
import { CategoriesResponse } from "./CategoriesResponse.js";
import { SearchResponse } from "./SearchResponse.js";
import { SearchQuery } from "./SearchQuery.js";
import { PostResponse } from "./PostResponse.js";
import { PostsResponse } from "./PostsResponse.js";
import { PostsParameters } from "./PostsParameters.js";
import { Post } from "./_Post.js";
import { PostSummary } from "./PostSummary.js";
import { Category } from "./Category.js";
import { Author } from "./Author.js";

export class Blog {
    readonly blogId: string;
    readonly oauthKey: string;

    constructor(blogId: string, oauthKey: string) {
        this.blogId = blogId;
        this.oauthKey = oauthKey;
    }

    async getAuthors(): Promise<Author[]> {
        const response = await this.get<AuthorsResponse>('authors');
        if (!response.success) {
            throw new ApiError(response.message, response.code);
        }
        return response.data?.authors ?? [];
    }

    async getPosts(options?: PostsParameters): Promise<PostsResponse['data']> {
        const response = await this.get<PostsResponse>('posts', options as {[k:string]:string});
        if (!response.success) {
            throw new ApiError(response.message, response.code);
        }
        return response.data ?? {
            pagination: {
                total: 0
            },
            posts: []
        };
    }

    async searchPosts(query: SearchQuery): Promise<PostSummary[]> {
        const response = await this.get<SearchResponse>('search', query as {[k:string]:any});
        if (!response.success) {
            throw new ApiError(response.message, response.code);
        }
        return response.data?.posts ?? [];
    }

    async getCategories(): Promise<Category[]> {
        const response = await this.get<CategoriesResponse>('categories');
        if (!response.success) {
            throw new ApiError(response.message, response.code);
        }
        return response.data?.categoryies ?? [];
    }

    async getPost(id: number): Promise<Post | null> {
        const response = await this.get<PostResponse>(`posts/${id}`);
        if (!response.success) {
            throw new ApiError(response.message, response.code);
        }
        return response.data?.post ?? null;
    }

    async getPostBySlug(slug: string): Promise<Post | null> {
        const response = await this.get<PostResponse>(`posts/slug/${slug}`);
        if (!response.success) {
            throw new ApiError(response.message, response.code);
        }
        return response.data?.post ?? null;
    }

    private async get<T>(api: string, options?: {
        [k: string]: any
    }): Promise<T> {
        const requestUrl: URL = new URL(`https://api.dropinblog.com/v2/blog/${this.blogId}/${api}`);
        if (options) {
            for (const optionName of Object.keys(options)) {
                requestUrl.searchParams.append(optionName, options[optionName]);
            }
        }
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${this.oauthKey}`
            }
        });
        return await response.json() as T;
    }
}