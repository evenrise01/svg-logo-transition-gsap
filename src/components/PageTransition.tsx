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
  const overlayRef = useRef<HTMLDivElement>(null); //full screen layer ref
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];

      for (let i = 0; i < 20; i++) {
        const block = document.createElement("div");
        block.className = "block";
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    };
    createBlocks();

    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

    if (logoRef.current) {
      const path = logoRef.current.querySelector("path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent",
        });
      }
    }

    revealPage();

    //Instead of letting browser instantly navigate to the new page. We want to:
    //1.Pause the navigation action to the new page
    //2. Play thee transition animation
    //3. Then continue with the navigation

    const handleRouteChange = (url: string) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      coverPage(url);
    };

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        if (!target) return;
        const href = target.href;
        const url = new URL(href).pathname;
        if (url !== pathname) {
          handleRouteChange(url);
        }
      });
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleRouteChange);
      });
    };
  }, [router, pathname]);

  const coverPage = useCallback((url: string) => {
    const tl = gsap.timeline({
      onComplete: () => router.push(url),
    });

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.inOut",
      transformOrigin: "left",
    })
      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.02")
      .set(
        logoRef.current?.querySelector("path") || {},
        {
          strokeDashoffset: logoRef.current
            ?.querySelector("path")
            ?.getTotalLength(),
          fill: "transparent",
        },
        "-=0.25"
      )
      .to(
        logoRef.current?.querySelector("path") || {},
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
        },
        "-=0.5"
      )
      .to(logoRef.current?.querySelector("path") || {}, {
        fill: '#e3e4d8',
        duration: 1,
        ease: 'power2.inOut',
      }, "-=0.5")
      .to(logoOverlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.inOut'
      })
  }, [router]);

  const revealPage = () => {
    gsap.set(blocksRef.current, {scaleX: 1, transformOrigin: 'right'});

    gsap.to(blocksRef.current, {
        scaleX: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.inOut",
        transformOrigin: "right",
        onComplete: () => {
            isTransitioning.current = false;
        }
      })
  }

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
