import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import KEYS from 'jsdom-global/keys.js'
import { gulpDom } from './gulpDom.mjs'
import fs from 'fs'

/**
 * @typedef {import('./src/schema').ContactPoint} ContactPoint
 */

/**
 * @type {ContactPoint[]}
 */
const contactPoints = JSON.parse(fs.readFileSync("src/me.json"));
contactPoints.sort(function (a, b) {
    return a.contactType.localeCompare(b.contactType);
});

/**
 * Changes input HTML DOM.
 * @param {Document} document
 * @param {import('jsdom').DOMWindow} window
 * @returns {Promise<string?>}
 */
async function renderHtml(document, window) {
    KEYS.forEach(function (key) {
        global[key] = window[key];
    });
    global['customElements'] = window.customElements;

    global.document = window.document;
    global.window = window;
    window.console = global.console;

    const apply = (await import('microdata-tooling')).apply;
    const icons = (await import('shieldsio-elements')).icons;

    /**
     * @type {import('microdata-tooling').ApplyOptions}
     */
    const contactOptions = {
        typeHelpers: {
            "ContactPoint": function (data, element) {
                /**
                 * @type {ContactPoint | null}
                 */
                const contact = data;
                if (contact?.contactType) {
                    /**
                     * @type {import('shieldsio-elements').SimpleIconBadge | import('shieldsio-elements').ShieldIOStaticBadge}
                     */
                    let widget;
                    if (icons[contact.contactType]) {
                        widget = document.createElement("simpleicon-badge");
                        widget.logo = contact.contactType;
                    } else {
                        widget = document.createElement("shieldio-badge");
                        widget.message = contact.contactType;
                    }
                    widget.badgeStyle = "for-the-badge";
                    const link = document.createElement("a");
                    link.target = "_blank";
                    link.style.textDecoration = "none";
                    link.href = contact.url || "";
                    link.rel = "me";
                    link.appendChild(widget);
                    element.appendChild(link);
                }

                return false;
            }
        }
    };

    apply(contactPoints, document.querySelector("section[itemprop=contactPoint]"), contactOptions);
    apply(contactPoints, document.querySelector("div[itemprop=contactPoint]"), contactOptions);
}

/**
 * Modifies HTML to "render" content and then copies output to build folder.
 * @returns {NodeJS.ReadWriteStream}
 */
export function buildHtml() {
    return gulp.src("src/*.htm").
        pipe(sourcemaps.init()).
        pipe(gulpDom(renderHtml)).
        pipe(sourcemaps.write(".", {
            includeContent: false,
            sourceRoot: "https://github.com/shmuelie/shmuelie.englard.net/tree/master/src"
        })).
        pipe(gulp.dest("dist"));
}