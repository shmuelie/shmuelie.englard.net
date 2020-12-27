
/**
 * Add WinJS styling to elements.
 *
 * @param root style elements under this element.
 */
export function styleProcess(root: HTMLElement): void {
    for (const element of root.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6,button,textarea")) {
        element.classList.add("win-" + element.tagName.toLowerCase());
    }
    for (const element of root.querySelectorAll("a")) {
        if (!element.classList.contains("twitter-follow-button") && !element.classList.contains("LI-simple-link")) {
            element.classList.add("win-link");
        }
    }
    for (const element of root.querySelectorAll<HTMLInputElement>("input[type=button],input[type=checkbox],input[type=radio]")) {
        element.classList.add("win-" + element.type);
    }
    for (const element of root.querySelectorAll<HTMLInputElement>("input[type=file]")) {
        element.classList.add("win-button", "win-button-file");
    }
    for (const element of root.querySelectorAll<HTMLInputElement>("input[type=text],input[type=password]")) {
        element.classList.add("win-textbox");
    }
    for (const element of root.querySelectorAll("select")) {
        element.classList.add("win-dropdown");
    }
    for (const element of root.querySelectorAll("progress")) {
        element.classList.add("win-progress-bar");
    }
    for (const element of root.querySelectorAll<HTMLInputElement>("input[type=range]")) {
        element.classList.add("win-slider");
    }
}