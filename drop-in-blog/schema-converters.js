export function isFullPost(t){return"content"in t}export function convertAuthor(t){var o,i,e;if(t){const n=null!==(i=null===(o=t.id)||void 0===o?void 0:o.toString())&&void 0!==i?i:"0";return{"@type":"Person","@id":n,identifier:null!==(e=t.slug)&&void 0!==e?e:n,name:t.name,image:t.photo,description:t.bio}}}export function convertPost(t){var o,i,e;const n=null!==(i=null===(o=t.id)||void 0===o?void 0:o.toString())&&void 0!==i?i:"0";let r={"@type":"BlogPosting","@id":n,identifier:null!==(e=t.slug)&&void 0!==e?e:n,abstract:t.summary,image:t.featuredImage,headline:t.title,datePublished:t.publishedAt,dateModified:t.updatedAt,keywords:t.keyword,author:convertAuthor(t.author)};return isFullPost(t)&&(r.articleBody=t.content),r}
//# sourceMappingURL=schema-converters.js.map