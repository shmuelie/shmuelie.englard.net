import{ApiError}from"./ApiError.js";export class Blog{constructor(s,t){this.blogId=s,this.oauthKey=t}async getAuthors(){var s,t;const o=await this.get("authors");if(!o.success)throw new ApiError(o.message,o.code);return null!==(t=null===(s=o.data)||void 0===s?void 0:s.authors)&&void 0!==t?t:[]}async getPosts(s){var t;const o=await this.get("posts",s);if(!o.success)throw new ApiError(o.message,o.code);return null!==(t=o.data)&&void 0!==t?t:{pagination:{total:0},posts:[]}}async searchPosts(s){var t,o;const a=await this.get("search",s);if(!a.success)throw new ApiError(a.message,a.code);return null!==(o=null===(t=a.data)||void 0===t?void 0:t.posts)&&void 0!==o?o:[]}async getCategories(){var s,t;const o=await this.get("categories");if(!o.success)throw new ApiError(o.message,o.code);return null!==(t=null===(s=o.data)||void 0===s?void 0:s.categoryies)&&void 0!==t?t:[]}async getPost(s){var t,o;const a=await this.get(`posts/${s}`);if(!a.success)throw new ApiError(a.message,a.code);return null!==(o=null===(t=a.data)||void 0===t?void 0:t.post)&&void 0!==o?o:null}async getPostBySlug(s){var t,o;const a=await this.get(`posts/slug/${s}`);if(!a.success)throw new ApiError(a.message,a.code);return null!==(o=null===(t=a.data)||void 0===t?void 0:t.post)&&void 0!==o?o:null}async get(s,t){const o=new URL(`https://api.dropinblog.com/v2/blog/${this.blogId}/${s}`);if(t)for(const s of Object.keys(t))o.searchParams.append(s,t[s]);const a=await fetch(o,{method:"GET",headers:{accept:"application/json",authorization:`Bearer ${this.oauthKey}`}});return await a.json()}}
//# sourceMappingURL=Blog.js.map
