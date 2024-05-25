import{orError,get}from"./request-helper.js";export async function getPosts(r,t,o={}){return orError(await get(r,t,"posts",o),{pagination:{total:0},posts:[]})}
//# sourceMappingURL=posts.js.map
