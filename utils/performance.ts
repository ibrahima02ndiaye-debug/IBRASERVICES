/**
 * Performance monitoring utilities
 */

/**
 * Simple in-memory cache for API responses
 */
class SimpleCache<T> {
    private cache = new Map<string, { data: T; timestamp: number }>();
    private ttl: number;

    constructor(ttlMinutes: number = 5) {
        this.ttl = ttlMinutes * 60 * 1000;
    }

    set(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) return null;

        // Check if expired
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }

    delete(key: string): void {
        this.cache.delete(key);
    }
}

export const apiCache = new SimpleCache(5); // 5 minute TTL

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Measure and log performance of a function
 */
export async function measurePerformance<T>(
    name: string,
    fn: () => Promise<T>
): Promise<T> {
    const start = performance.now();

    try {
        const result = await fn();
        const duration = performance.now() - start;

        if (process.env.NODE_ENV === 'development') {
            console.log(`⚡ Performance: ${name} took ${duration.toFixed(2)}ms`);
        }

        // TODO: Send metrics to monitoring service
        // Analytics.track('performance', { name, duration });

        return result;
    } catch (error) {
        const duration = performance.now() - start;
        console.error(`❌ Performance: ${name} failed after ${duration.toFixed(2)}ms`);
        throw error;
    }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Lazy load images with IntersectionObserver
 */
export function lazyLoadImage(img: HTMLImageElement): void {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target as HTMLImageElement;
                    const src = image.dataset.src;

                    if (src) {
                        image.src = src;
                        image.removeAttribute('data-src');
                        observer.unobserve(image);
                    }
                }
            });
        },
        {
            rootMargin: '50px',
        }
    );

    observer.observe(img);
}

/**
 * Get network information if available
 */
export function getNetworkInfo() {
    const nav = navigator as any;

    if ('connection' in nav) {
        const conn = nav.connection;
        return {
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData,
        };
    }

    return null;
}

/**
 * Check if on slow network
 */
export function isSlowNetwork(): boolean {
    const info = getNetworkInfo();
    return info ? info.effectiveType === '2g' || info.effectiveType === 'slow-2g' : false;
}
