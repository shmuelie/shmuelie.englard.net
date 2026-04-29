import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import KEYS from 'jsdom-global/keys.js'
import { gulpDom } from './gulpDom.mts'
import { contactPoints } from '../data/contactPoints.mjs'
import { desktops, servers } from '../data/hardware.mjs'
import type { DOMWindow } from 'jsdom'
import type { apply as ApplyFunction, ApplyOptions } from 'microdata-tooling'
import type { ContactPoint } from '../data/schema'
import type { SimpleIconBadge, ShieldIOStaticBadge } from 'shieldsio-elements'

/**
 * Changes input HTML DOM.
 */
async function renderHtml(document: Document, window: DOMWindow): Promise<string | null | undefined> {
    KEYS.forEach(function (key: string) {
        try {
            (global as any)[key] = (window as any)[key];
        }
        catch {
            // Ignore errors for keys that don't exist in the window object.
        }
    });
    (global as any)['customElements'] = window.customElements;

    (global as any).document = window.document;
    (global as any).window = window;
    (window as any).console = global.console;

    const apply = (await import('microdata-tooling')).apply;
    await renderContactPoints(document, apply)
    renderHardware(document);

    document.querySelector("meta[name=datetime]")!.setAttribute("content", new Date().toISOString());
    return undefined;
}

async function renderContactPoints(document: Document, apply: typeof ApplyFunction): Promise<void> {
    const icons: Record<string, any> = (await import('shieldsio-elements')).icons;

    const contactOptions: ApplyOptions = {
        typeHelpers: {
            "ContactPoint": function (data: any, element: Element) {
                const contact = data as ContactPoint | null;
                if (contact?.contactType) {
                    let widget: SimpleIconBadge | ShieldIOStaticBadge;
                    if (icons[contact.contactType]) {
                        widget = document.createElement("simpleicon-badge") as unknown as SimpleIconBadge;
                        widget.logo = contact.contactType;
                    } else {
                        widget = document.createElement("shieldio-badge") as unknown as ShieldIOStaticBadge;
                        widget.message = contact.contactType;
                    }
                    widget.badgeStyle = "for-the-badge";
                    const link = document.createElement("a");
                    link.target = "_blank";
                    link.style.textDecoration = "none";
                    link.href = contact.url || ""
                    link.rel = "me noopener";
                    link.title = contact.contactType || "";
                    link.appendChild(widget as unknown as Node);
                    element.appendChild(link);
                }

                return false;
            }
        }
    }

    const contactsElement = document.querySelector("section[itemprop=contactPoint]")!;
    apply(contactPoints, contactsElement, contactOptions);
    contactsElement.removeChild(contactsElement.querySelector("template")!);
}

function renderHardwareSection(document: Document, sectionSelector: string, data: any[]): void {
    const section = document.querySelector(sectionSelector)!;
    const container = section.querySelector('div')!;
    const template = container.querySelector('template')!;

    for (const system of data) {
        const card = document.createElement('wa-card');
        const heading = document.createElement('h2');
        heading.textContent = system.name;
        card.appendChild(heading);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th>Type</th><th>Item</th></tr>';
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        for (const item of system.items) {
            const row = document.createElement('tr');
            const typeCell = document.createElement('td');
            typeCell.textContent = item.type;
            row.appendChild(typeCell);

            const nameCell = document.createElement('td');
            if (item.url) {
                const link = document.createElement('a');
                link.href = item.url;
                link.target = '_blank';
                link.rel = 'noopener';
                link.textContent = item.name;
                nameCell.appendChild(link);
            } else {
                nameCell.textContent = item.name;
            }
            row.appendChild(nameCell);
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        card.appendChild(table);
        container.appendChild(card);
    }

    container.removeChild(template);
}

function renderHardware(document: Document): void {
    renderHardwareSection(document, 'wa-tab-panel[name="hardware"] > section.desktops', desktops);
    renderHardwareSection(document, 'wa-tab-panel[name="hardware"] > section.servers', servers);
}

/**
 * Modifies HTML to "render" content and then copies output to build folder.
 */
export function buildHtml(): NodeJS.ReadWriteStream {
    return gulp.src("src/*.htm").
        pipe(sourcemaps.init()).
        pipe(gulpDom(renderHtml)).
        pipe(sourcemaps.write(".")).
        pipe(gulp.dest("dist"));
}