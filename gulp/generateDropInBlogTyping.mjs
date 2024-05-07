import openapiTS from 'openapi-typescript'
import fs from 'fs'

/**
 * Generates TypeScript typings for Drop In Blog OpenAPI
 * @param {() => void} cb Callback method to complete operation.
 * @returns {Promise<void>}
 */
export async function generateDropInBlogTypings(cb) {
    const schemaFile = fs.readFileSync("data/dropinblog.api.json");
    const schema = JSON.parse(schemaFile);
    const typings = await openapiTS(schema, {
        immutableTypes: true
    });
    fs.writeFileSync("data/dropinblog.api.d.ts", typings);
    cb();
}