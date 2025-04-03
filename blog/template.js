import{html,when}from"https://unpkg.com/@microsoft/fast-element@1.14.0";import{loadingTemplate}from"./loadingTemplate.js";import{loadedTemplate}from"./loadedTemplate.js";export const template=html`
${when((e=>e.loading),loadingTemplate,loadedTemplate)}
`;
//# sourceMappingURL=template.js.map
