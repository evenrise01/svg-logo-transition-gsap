"use client";
import Logo from "./Logo";
import { ReactNode, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useRouter, usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const isTransitioning = useRef(false);
  
  // Cache SVG path length to avoid recalculating
  const pathLengthRef = useRef<number>(0);
  
  // Store link handlers map for proper cleanup
  const linkHandlersRef = useRef<Map<Element, (e: Event) => void>>(new Map());

  // Stable event handler function
  const handleLinkClick = useCallback((e: Event) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    if (!target || isTransitioning.current) return;
    
    const url = new URL(target.href).pathname;
    if (url !== pathname) {
      isTransitioning.current = true;
      coverPage(url);
    }
  }, [pathname]);

  // Preload images from a given URL
  const preloadImages = useCallback(async (url: string): Promise<void> => {
    try {
      // Fetch the HTML of the target page
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse HTML to find image URLs
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const images = doc.querySelectorAll('img[src], img[srcset]');
      
      const imagePromises: Promise<void>[] = [];
      
      images.forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          imagePromises.push(
            new Promise((resolve) => {
              const image = new Image();
              image.onload = () => resolve();
              image.onerror = () => resolve(); // Resolve anyway to not block
              image.src = src.startsWith('http') ? src : new URL(src, window.location.origin).href;
            })
          );
        }
      });
      
      // Wait for all images to load (with timeout)
      await Promise.race([
        Promise.all(imagePromises),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2s timeout
      ]);
    } catch (error) {
      console.error('Error preloading images:', error);
      // Continue anyway
    }
  }, []);

  const coverPage = useCallback(async (url: string) => {
    const path = logoRef.current?.querySelector("path");
    const cachedLength = pathLengthRef.current;

    // Start the cover animation
    const tl = gsap.timeline();

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.inOut",
      transformOrigin: "left",
    })
      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.02")
      .set(
        path || {},
        {
          strokeDashoffset: cachedLength,
          fill: "transparent",
        },
        "-=0.25"
      )
      .to(
        path || {},
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
        },
        "-=0.5"
      )
      .to(path || {}, {
        fill: '#e3e4d8',
        duration: 1,
        ease: 'power2.inOut',
      }, "-=0.5");

    // Preload images while animation plays
    await preloadImages(url);

    // Complete the animation and navigate
    await tl.to(logoOverlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.inOut'
    }).then();

    router.push(url);
  }, [router, preloadImages]);

  const revealPage = useCallback(() => {
    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: 'right' });

    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.inOut",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
      }
    });
  }, []);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];

      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < 20; i++) {
        const block = document.createElement("div");
        block.className = "block";
        fragment.appendChild(block);
        blocksRef.current.push(block);
      }
      
      overlayRef.current.appendChild(fragment);
    };
    
    createBlocks();

    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

    // Cache SVG path length once
    if (logoRef.current) {
      const path = logoRef.current.querySelector("path");
      if (path) {
        const length = path.getTotalLength();
        pathLengthRef.current = length;
        
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent",
        });
      }
    }

    revealPage();

    // Attach event listeners with stable handlers
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      linkHandlersRef.current.set(link, handleLinkClick);
      link.addEventListener("click", handleLinkClick);
    });

    // Proper cleanup
    return () => {
      linkHandlersRef.current.forEach((handler, link) => {
        link.removeEventListener("click", handler);
      });
      linkHandlersRef.current.clear();
    };
  }, [pathname, handleLinkClick, revealPage]);

  return (
    <>
      <div className="transition-overlay" ref={overlayRef}></div>
      <div className="logo-overlay" ref={logoOverlayRef}>
        <div className="logo-container">
          <Logo ref={logoRef} />
        </div>
      </div>
      {children}
    </>
  );
};

export default PageTransition;