/**
 * Accessibility Utilities
 * Helpers for keyboard navigation, ARIA, and screen reader support
 */

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement?.focus();
                e.preventDefault();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                firstElement?.focus();
                e.preventDefault();
            }
        }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
        container.removeEventListener('keydown', handleKeyDown);
    };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
    return (
        element.getAttribute('aria-hidden') !== 'true' &&
        !element.hidden &&
        element.style.display !== 'none' &&
        element.style.visibility !== 'hidden'
    );
}

/**
 * Get accessible label for element
 */
export function getAccessibleLabel(element: HTMLElement): string {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy);
        return labelElement?.textContent || '';
    }

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label) return label.textContent || '';
    }

    return element.textContent || '';
}

/**
 * Create skip link for keyboard navigation
 */
export function createSkipLink(targetId: string, label: string = 'Skip to main content'): HTMLAnchorElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded';
    skipLink.textContent = label;

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    return skipLink;
}

/**
 * Keyboard event helper
 */
export const Keys = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    TAB: 'Tab',
    HOME: 'Home',
    END: 'End',
};

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Add ARIA busy state
 */
export function setAriaBusy(element: HTMLElement, busy: boolean): void {
    element.setAttribute('aria-busy', String(busy));
}

/**
 * Create accessible button from div (for custom buttons)
 */
export function makeAccessibleButton(element: HTMLElement, onClick: () => void): void {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');

    element.addEventListener('click', onClick);
    element.addEventListener('keydown', (e) => {
        if (e.key === Keys.ENTER || e.key === Keys.SPACE) {
            e.preventDefault();
            onClick();
        }
    });
}

/**
 * Announce page change for SPAs
 */
export function announcePageChange(pageName: string): void {
    document.title = `${pageName} - IBRA Services`;
    announceToScreenReader(`Navigated to ${pageName}`, 'assertive');
}
