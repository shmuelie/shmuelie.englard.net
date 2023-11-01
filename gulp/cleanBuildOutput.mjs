import { deleteAsync } from 'del'

/**
 * Cleans the build output.
 * @returns {Promise<string[]>}
 */
export function cleanBuildOutput() {
    return deleteAsync("dist/*.*");
}