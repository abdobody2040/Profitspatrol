/**
 * printCard.ts
 * ─────────────
 * Pure DOM utility for printing a card element in a popup window.
 * Zero React dependency — independently testable and reusable.
 *
 * Extracted from BusinessCard.tsx (was SRE-01 XSS vector — document.write).
 * Uses cloneNode(true) to copy the live element tree with no string serialisation.
 */

const PRINT_STYLES = [
    '@page{margin:0;size:auto;}',
    'body{margin:0;padding:0;background:#f8fafc;display:flex;justify-content:center;align-items:center;min-height:100vh;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;font-family:ui-sans-serif,system-ui,sans-serif;}',
    '.print-container{padding:40px;border-radius:32px;box-shadow:0 20px 40px rgba(0,0,0,.05);border:8px solid white;display:flex;flex-direction:column;align-items:center;gap:24px;}',
    '.print-title{font-size:28px;font-weight:900;color:#4f46e5;margin:0 0 8px;}',
    '.print-subtitle{font-size:16px;color:#64748b;margin:0;}',
    '#print-target{transform:scale(1.15);transform-origin:center;margin:20px 0;}',
    '@media print{body{background:white;}.print-container{border:none;box-shadow:none;}#print-target{transform:scale(1);}}',
].join('\n');

export class PopupBlockedError extends Error {
    constructor() {
        super('POPUP_BLOCKED');
        this.name = 'PopupBlockedError';
    }
}

/**
 * Opens a styled print dialog containing a clone of `cardEl`.
 * Throws `PopupBlockedError` if the browser blocks the popup.
 */
export function printCardElement(cardEl: HTMLElement): void {
    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) throw new PopupBlockedError();

    const doc = win.document;
    doc.title = 'Profits Patrol Business Card';

    const meta = doc.createElement('meta');
    meta.setAttribute('charset', 'utf-8');
    doc.head.appendChild(meta);

    const style = doc.createElement('style');
    style.textContent = PRINT_STYLES;
    doc.head.appendChild(style);

    // Load Tailwind from CDN for gradient/utility classes on the cloned card
    const script = doc.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    doc.head.appendChild(script);

    const container = doc.createElement('div');
    container.className = 'print-container';

    const h1 = doc.createElement('h1');
    h1.className = 'print-title';
    h1.textContent = '🚀 Official Profits Patrol Business Card'; // textContent — safe

    const p = doc.createElement('p');
    p.className = 'print-subtitle';
    p.textContent = 'Verified CEO Identity';

    const printTarget = doc.createElement('div');
    printTarget.id = 'print-target';
    printTarget.appendChild(cardEl.cloneNode(true)); // deep clone — no innerHTML/serialisation

    container.append(h1, p, printTarget);
    doc.body.appendChild(container);

    // Print after Tailwind has processed the injected classes
    script.onload = () => setTimeout(() => win.print(), 400);
    setTimeout(() => win.print(), 1800); // Fallback if CDN is slow
}
