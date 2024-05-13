import{orError,get,rootUrl}from"./request-helper.js";export async function getPosts(r={}){const o=new URL(`${rootUrl}/posts`),t=r;for(const e of Object.keys(r))o.searchParams.append(e,t[e]);return orError(await get(o),{pagination:{total:0},posts:[]})}
//# sourceMappingURL=posts.js.map
