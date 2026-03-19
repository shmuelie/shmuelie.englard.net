import through from 'through2'
import PluginError from 'plugin-error'
import { JSDOM, type DOMWindow, type ConstructorOptions } from 'jsdom'

const PLUGIN_NAME = "gulp-jsdom";

type Mutator = (document: Document, window: DOMWindow) => Promise<string | null | undefined>;

/**
 * Allows for manipulation of HTML DOM in a gulp pipeline.
 */
export function gulpDom(mutator: Mutator, options?: ConstructorOptions | null, serialize?: boolean | null) {
    options = options || {};
	serialize = serialize || true;

    async function transform(this: any, file: any, encoding: string, callback: Function) {
		if (file.isNull()) {
			return callback(null, file);
		}
		if (file.isStream()) {
			callback(new PluginError(PLUGIN_NAME, "Streaming not supported"));
            return;
		}

		try {
			if (file.isBuffer()) {
				const dom = new JSDOM(file.contents.toString("utf8"), options!);

				const context = {
					file: file,
					filename: file.history[file.history.length - 1].substr(file.base.length)
				};
				const output = await mutator.call(context, dom.window.document, dom.window);

				if (typeof output === "string") {
					file.contents = Buffer.from(output);
				} else if (serialize) {
					file.contents = Buffer.from(dom.serialize());
				} else {
					file.contents = Buffer.from(dom.window.document.documentElement.outerHTML)
				}

				this.push(file);
			}

		} catch (err) {
			this.emit("error", new PluginError(PLUGIN_NAME, err as any));
		}

		callback();
	}

	return through.obj(transform);
}