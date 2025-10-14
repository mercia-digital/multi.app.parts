declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return;

  const runtimeConfig = useRuntimeConfig();
  const gaId = runtimeConfig.public?.analytics?.gaMeasurementId as string | undefined;
  const clarityId = runtimeConfig.public?.analytics?.clarityProjectId as string | undefined;

  // Initialize Google Analytics (gtag) if ID is present and loader script is on the page
  if (gaId) {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];
    // Define gtag if missing
    if (!window.gtag) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag = function () {
        window.dataLayer?.push(arguments as unknown as any);
      } as unknown as typeof window.gtag;
    }
    // Boot GA
    window.gtag?.('js', new Date());
    window.gtag?.('config', gaId);
  }

  // Initialize Microsoft Clarity if not already initialized
  if (clarityId && typeof window.clarity !== 'function') {
    (function (c: any, l: Document, a: string, r: string, i: string) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      const t = l.createElement(r) as HTMLScriptElement; t.async = 1 as any;
      t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0]; y.parentNode?.insertBefore(t, y);
    })(window, document, 'clarity', 'script', clarityId);
  }
});
