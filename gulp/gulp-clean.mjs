import { deleteAsync } from 'del'

/**
 * Cleans the build output.
 * @returns {Promise<string[]>}
 */
export function clean() {
    return deleteAsync("dist/*.*");
}