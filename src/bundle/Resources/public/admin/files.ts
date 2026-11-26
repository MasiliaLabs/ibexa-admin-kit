/** What the admin's scripts do with files: taking one the server gives. */

type Page = Pick<Document, 'createElement'> & { body: Pick<HTMLElement, 'appendChild'> };

/**
 * Takes the file at an address (the browser keeps it, the page stays where it is): what a link with `download` does, for a button.
 * The server decides what the file is (a `Content-Disposition` header); `filename` is the name the browser proposes.
 */
export function downloadFile(url: string, filename: string, page: Page = document): void {
    const link = page.createElement('a');
    link.href = url;
    link.download = filename;
    page.body.appendChild(link);
    link.click();
    link.remove();
}
