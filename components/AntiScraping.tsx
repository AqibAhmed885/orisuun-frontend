'use client';

import { useEffect } from 'react';

/**
 * Anti-scraping component that adds client-side protection
 * against web scrapers, bots, and automated tools
 */
export default function AntiScraping() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection for scraping protection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts commonly used for scraping
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S (Save), Ctrl+U (View Source), Ctrl+Shift+I (DevTools), F12 (DevTools)
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'u')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Detect headless browsers and automation tools
    const detectHeadless = () => {
      // Check for common headless browser indicators
      const checks = [
        // Puppeteer/Playwright specific
        () => !!(window as any).navigator.webdriver,
        () => !!(window as any).__nightmare,
        () => !!(document as any).__selenium_unwrapped,
        () => !!(window as any).callPhantom || !!(window as any)._phantom,
        () => /HeadlessChrome/i.test(window.navigator.userAgent),
        () => !!(window as any).Buffer, // Node.js Buffer in browser context
        () => !!(window as any).emit, // Node.js EventEmitter
        () => !!(window as any).spawn, // Node.js child_process
      ];

      const isHeadless = checks.some(check => {
        try {
          return check();
        } catch {
          return false;
        }
      });

      if (isHeadless) {
        // Redirect or block headless browsers
        document.body.innerHTML = '<h1>Access Denied</h1>';
        window.location.href = 'about:blank';
      }
    };

    // Detect DevTools opening (anti-scraping measure)
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          console.clear();
        }
      } else {
        devtoolsOpen = false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    // Run detection checks
    detectHeadless();
    
    // Check for DevTools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Disable drag and drop to prevent content extraction
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('dragstart', handleDragStart);

    // Disable copy (optional - may impact user experience)
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', 'Copying is disabled on this platform.');
      }
      return false;
    };
    document.addEventListener('copy', handleCopy);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      clearInterval(devToolsInterval);
    };
  }, []);

  return null; // This component doesn't render anything
}
