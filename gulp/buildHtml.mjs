import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import KEYS from 'jsdom-global/keys.js'
import { gulpDom } from './gulpDom.mjs'
import { contactPoints } from '../data/contactPoints.mjs'
import { podcasts } from '../data/podcasts.mjs'
import { youtubeChannels } from '../data/youtubeChannels.mjs'

/**
 * @typedef {import('microdata-tooling').apply} ApplyFunction
 * @typedef {import('microdata-tooling').ApplyOptions} ApplyOptions
 * @typedef {import('../data/schema').ContactPoint} ContactPoint
 * @typedef {import('shieldsio-elements').SimpleIconBadge} SimpleIconBadge
 * @typedef {import('shieldsio-elements').ShieldIOStaticBadge} ShieldIOStaticBadge
 */

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
    await renderContactPoints(document, apply)
    renderPodcasts(document, apply);
    renderYouTubeChannels(document, apply);
}

/**
 *
 * @param {Document} document
 * @param {ApplyFunction} apply
 * @returns {void}
 */
function renderYouTubeChannels(document, apply) {
    /**
     * @type {ApplyOptions}
     */
    const youtubeChannelOptions = {
    };

    apply(youtubeChannels, document.querySelector('section.youtubeChannels > div'), youtubeChannelOptions);
}

/**
 *
 * @param {Document} document
 * @param {ApplyFunction} apply
 * @returns {void}
 */
function renderPodcasts(document, apply) {
    /**
     * @type {ApplyOptions}
     */
    const podcastOptions = {
    };

    // Use data binding to create podcasts.
    apply(podcasts, document.querySelector('section.podcasts > div'), podcastOptions);
}

/**
 *
 * @param {Document} document
 * @param {ApplyFunction} apply
 * @returns {Promise<void>}
 */
async function renderContactPoints(document, apply) {
    const icons = (await import('shieldsio-elements')).icons;

    /**
     * @type {ApplyOptions}
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
                     * @type {SimpleIconBadge | ShieldIOStaticBadge}
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
                    link.href = contact.url || ""
                    link.rel = "me noopener";
                    link.title = contact.contactType || "";
                    link.appendChild(widget);
                    element.appendChild(link);
                }

                return false;
            }
        }
    }

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