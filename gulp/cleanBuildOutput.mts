import { deleteAsync } from 'del'

/**
 * Cleans the build output.
 */
export function cleanBuildOutput(): Promise<string[]> {
    return deleteAsync("dist/*.*");
}