"use client";
import { ReactNode, useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useRouter, usePathname } from "next/navigation";
import Signature from "./Signature";
import { ScrambleTextPlugin } from "gsap/all";

gsap.registerPlugin(ScrambleTextPlugin);

interface PageTransitionProps {
  children: ReactNode;
}

// Array of random transition texts
const transitionTexts = [
  "Breathing Life in Pixels!",
  "Crafting Digital Dreams!",
  "Where Creativity Meets Code!",
  "Pixel Perfect Experiences!",
  "Designing Tomorrow, Today!",
  "Innovation in Motion!",
  "Your Vision, Our Passion!",
  "Creating Digital Magic!",
  "Transforming Ideas into Reality!",
  "Building Beautiful Interfaces!",
];

const PageTransitionSignature = ({ children }: PageTransitionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const transitionTextRef = useRef<HTMLParagraphElement>(null);
  const isTransitioning = useRef(false);

  // Random text state
  const [randomText, setRandomText] = useState("");

  // Cache SVG path length to avoid recalculating
  const pathLengthRef = useRef<number>(0);

  // Store link handlers map for proper cleanup
  const linkHandlersRef = useRef<Map<Element, (e: Event) => void>>(new Map());

  // Stable event handler function
  const handleLinkClick = useCallback(
    (e: Event) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      if (!target || isTransitioning.current) return;

      const url = new URL(target.href).pathname;
      if (url !== pathname) {
        isTransitioning.current = true;
        // Generate new random text
        const newText = transitionTexts[Math.floor(Math.random() * transitionTexts.length)];
        
        // Start animation immediately with the new text
        // Don't update state yet - let scramble handle it
        coverPage(url, newText);
      }
    },
    [pathname]
  );

  // Preload images from a given URL
  const preloadImages = useCallback(async (url: string): Promise<void> => {
    try {
      // Fetch the HTML of the target page
      const response = await fetch(url);
      const html = await response.text();

      // Parse HTML to find image URLs
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const images = doc.querySelectorAll("img[src], img[srcset]");

      const imagePromises: Promise<void>[] = [];

      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("data:")) {
          imagePromises.push(
            new Promise((resolve) => {
              const image = new Image();
              image.onload = () => resolve();
              image.onerror = () => resolve(); // Resolve anyway to not block
              image.src = src.startsWith("http")
                ? src
                : new URL(src, window.location.origin).href;
            })
          );
        }
      });

      // Wait for all images to load (with timeout)
      await Promise.race([
        Promise.all(imagePromises),
        new Promise((resolve) => setTimeout(resolve, 2000)), // 2s timeout
      ]);
    } catch (error) {
      console.error("Error preloading images:", error);
      // Continue anyway
    }
  }, []);

  const coverPage = useCallback(
    async (url: string, targetText: string) => {
      const path = logoRef.current?.querySelector("path");
      const cachedLength = pathLengthRef.current;
      const textElement = transitionTextRef.current;

      // Start the cover animation
      const tl = gsap.timeline();

      // Slide overlay up from bottom
      tl.set(overlayRef.current, { y: "100%" })
        .set(textElement, { 
          opacity: 1,
          textContent: "" // Start with empty text
        })
        .to(overlayRef.current, {
          y: "0%",
          duration: 0.75,
          ease: "power2.inOut",
        })
        // Show logo overlay once main overlay is in place
        .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
        // Animate logo drawing
        .set(path || {}, {
          strokeDashoffset: cachedLength,
          fill: "transparent",
        })
        .to(
          path || {},
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
          },
          "-=0.3"
        )
        // Scramble text animation from empty to target text
        .to(textElement, {
          duration: 1.2,
          scrambleText: {
            text: targetText,
            chars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
            revealDelay: 0.3,
            speed: 0.3,
            tweenLength: false,
          },
          ease: "none",
        }, "-=1.0")
        .to(
          path || {},
          {
            fill: "none",
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.7"
        );

      // Preload images while animation plays
      await preloadImages(url);

      // Slide overlay up to reveal new page
      await tl
        .to(logoOverlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        })
        .then();

      router.push(url);
      
      // Update state after navigation for next time
      setRandomText(targetText);
    },
    [router, preloadImages]
  );

  const revealPage = useCallback(() => {
    // Set initial state - overlay covering the page
    gsap.set(overlayRef.current, { y: "0%" });

    // Slide overlay up to reveal page
    gsap.to(overlayRef.current, {
      y: "-100%",
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        isTransitioning.current = false;
      },
    });
  }, []);

  useEffect(() => {
    // Set initial random text
    setRandomText(
      transitionTexts[Math.floor(Math.random() * transitionTexts.length)]
    );

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
      <div className="transition-overlay-slide" ref={overlayRef}></div>
      <div className="logo-overlay flex flex-col" ref={logoOverlayRef}>
        <div className="logo-container flex-col gap-12">
          <Signature ref={logoRef} />
        </div>
        <div className="transition-text-container">
          <p className="transition-text" ref={transitionTextRef}>
            {randomText}
          </p>
        </div>
      </div>
      {children}
    </>
  );
};

export default PageTransitionSignature;