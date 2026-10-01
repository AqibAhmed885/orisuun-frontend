'use client';

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RefObject, useLayoutEffect } from 'react';

type UseGSAPScrollOptions = {
  scope?: RefObject<HTMLElement | null>;
  revealSelector?: string;
  parallaxSelector?: string;
  anchorOffset?: number;
  enabled?: boolean;
};

export function useGSAPScroll({
  scope,
  revealSelector = '[data-gsap-reveal]',
  parallaxSelector = '[data-gsap-parallax]',
  anchorOffset = 92,
  enabled = true,
}: UseGSAPScrollOptions = {}) {
  useLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    gsap.ticker.lagSmoothing(1000, 16);
    document.documentElement.classList.add('gsap-scroll-ready');

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const navigationEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isPageReload = navigationEntry?.type === 'reload';

    if (isPageReload) {
      window.scrollTo(0, 0);
      ScrollTrigger.update();
    }

    const root = scope?.current ?? document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scrollTween: gsap.core.Tween | null = null;

    let active = true;

    const ctx = gsap.context(() => {
      const revealItems = Array.from(root.querySelectorAll<HTMLElement>(revealSelector));
      const parallaxItems = Array.from(root.querySelectorAll<HTMLElement>(parallaxSelector));

      if (prefersReducedMotion) {
        gsap.set(revealItems, { autoAlpha: 1, y: 0, scale: 1, clearProps: 'transform' });
        return;
      }

      if (revealItems.length) {
        gsap.set(revealItems, {
          autoAlpha: 0,
          y: 42,
          willChange: 'transform, opacity',
          force3D: true,
        });

        ScrollTrigger.batch(revealItems, {
          start: 'top 86%',
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.08,
              clearProps: 'transform,willChange',
            });
          },
        });
      }

      parallaxItems.forEach((item) => {
        const distance = Number(item.dataset.gsapParallax) || 28;

        gsap.fromTo(
          item,
          { y: -distance },
          {
            y: distance,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, root);

    const scrollToElement = (target: HTMLElement) => {
      scrollTween?.kill();

      scrollTween = gsap.to(window, {
        scrollTo: {
          y: target,
          offsetY: anchorOffset,
          autoKill: true,
        },
        duration: 0.75,
        ease: 'power3.out',
        onUpdate: () => ScrollTrigger.update(),
        onComplete: () => ScrollTrigger.refresh(),
      });
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      scrollToElement(target);
    };

    const refresh = () => {
      if (active && root.isConnected) {
        ScrollTrigger.refresh();
      }
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('load', refresh);

    document.fonts?.ready.then(refresh).catch(() => undefined);

    const refreshFrame = window.requestAnimationFrame(refresh);
    const refreshTimeout = window.setTimeout(refresh, 350);

    return () => {
      active = false;
      window.cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimeout);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', refresh);
      document.documentElement.classList.remove('gsap-scroll-ready');
      window.history.scrollRestoration = previousScrollRestoration;
      scrollTween?.kill();
      ctx.revert();
    };
  }, [anchorOffset, enabled, parallaxSelector, revealSelector, scope]);
}
