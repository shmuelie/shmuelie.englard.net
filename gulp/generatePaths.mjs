import fs from 'fs'

/**
 * Generates TypeScript path mappings for node modules.
 * @param {() => void} cb
 * @returns {void}
 */
export function generatePaths(cb) {
    const pathsConfig = {
        compilerOptions: {
            paths: {}
        }
    }

    /**
     * @type {{devDependencies:{[k:string]:string}}}
     */
    const projectMetadata = JSON.parse(fs.readFileSync("package.json"));
    for (const devDependencyName of Object.keys(projectMetadata.devDependencies)) {
        const devDependencyVersion = projectMetadata.devDependencies[devDependencyName];
        const unpkgPath = "https://unpkg.com/" + devDependencyName + "@" + devDependencyVersion;
        const localPath = "./node_modules/" + devDependencyName;
        pathsConfig.compilerOptions.paths[unpkgPath] = [
            localPath
        ];
    }
    fs.writeFileSync("tsconfig.paths.json", JSON.stringify(pathsConfig));
    cb();
}