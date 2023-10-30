import through from 'through2'
import PluginError from 'plugin-error'
import { JSDOM } from 'jsdom'

const PLUGIN_NAME = "gulp-jsdom";

/**
 * Allows for manipulation of HTML DOM in a gulp pipeline.
 * @param {(document:Document,window:import('jsdom').DOMWindow) => Promise<string?>} mutator The function to manipulate the DOM.
 * @param {import('jsdom').ConstructorOptions?} options Options for creating the JSDOM DOM.
 * @param {boolean?} serialize If document should be converted to a string using JSDOM's serialize method. If not set, defaults to true.
 */
export function gulpDom(mutator, options, serialize) {
    options = options || {};
	serialize = serialize || true;

    async function transform(file, encoding, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}
		if (file.isStream()) {
			callback(new PluginError(PLUGIN_NAME, "Streaming not supported"));
            return;
		}

		try {
			if (file.isBuffer()) {
				const dom = new JSDOM(file.contents.toString("utf8"), options);

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
			this.emit("error", new PluginError(PLUGIN_NAME, err));
		}

		callback();
	}

	return through.obj(transform);
}