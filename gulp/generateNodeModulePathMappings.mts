import fs from 'fs'

/**
 * Generates TypeScript path mappings for node modules.
 */
export function generateNodeModulePathMappings(cb: () => void): void {
    const pathsConfig: { compilerOptions: { paths: Record<string, string[]> } } = {
        compilerOptions: {
            paths: {}
        }
    }

    const projectMetadata: { devDependencies: Record<string, string> } = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    for (const devDependencyName of Object.keys(projectMetadata.devDependencies)) {
        const devDependencyVersion = projectMetadata.devDependencies[devDependencyName];
        const unpkgPath = "https://unpkg.com/" + devDependencyName + "@" + devDependencyVersion;
        const localPath = "./node_modules/" + devDependencyName;
        pathsConfig.compilerOptions.paths[unpkgPath] = [
            localPath
        ];
        // Also map subpath imports (e.g., lit/decorators.js → ./node_modules/lit/decorators.js)
        pathsConfig.compilerOptions.paths[unpkgPath + "/*"] = [
            localPath + "/*"
        ];
    }
    fs.writeFileSync("tsconfig.paths.json", JSON.stringify(pathsConfig));
    cb();
}