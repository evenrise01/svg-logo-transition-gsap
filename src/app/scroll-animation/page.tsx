'use client'
import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ScrollAnimationPage = () => {
  return (
    <div className="scroll-animation-page">
      <section className="scroll-intro scroll-animation-section">
        <h1 className="h1-scroll-animation-text text-center w-1/2">
          We create modern websites that feel effortlessly personal.
        </h1>
      </section>
      <section className="p-2 scroll-animation-section">
        <div className="relative w-full h-full">
          {/* Column appears on the left */}
          <div className="scroll-col col-1">
            <div className="col-content">
              <div className="col-content-wrapper">
                <h1 className="h1-scroll-animation-text text-[#a1a1a1] w-[60%]">
                  We design spaces where comfort meets quiet sophistication.
                </h1>
                <p className="text-[#f1f1f1] w-[60%]">
                  Layered textures, rich tones, and thoughtful details come
                  together to create interiors that feel lived-in yet elevated.
                </p>
              </div>
            </div>
          </div>
          {/* Column 2 sits on the right and holds the image elements */}
          <div className="scroll-col translate-x-full">
            <div className="col-img col-img-1">
              <div className="col-img-wrapper">
                <img src="/scroll-animation/first.jpg" alt="first image" />
              </div>
            </div>

            <div className="col-img col-img-2">
              <div className="col-img-wrapper">
                <img src="/scroll-animation/second.jpg" alt="second image" />
              </div>
            </div>
          </div>
          <div className="scroll-col translate-x-full translate-y-full p-2">
            <div className="col-content-wrapper">
              <h1 className="text-[#a1a1a1] w-[60%]">Our interiors are crafted to feel as calm as they look.</h1>
              <p className="text-[#f1f1f1] w-[60%]">
                Each space is designed with intentional balance between warmth
                and modernity, light and shadow, function and beauty.
              </p>
            </div>
            <div className="col-content-wrapper-2">
            <h1>Every detail is chosen to bring ease and elegance into your space.</h1>
              <p>
                From crown furnishings to ambient lighting, we shape environments that reflect your lifestyle with timeless clarity.
              </p>
            </div>
          </div>
          <div className="scroll-col translate-x-full translate-y-full">
            <div className="col-img">
                <div className="col-img-wrapper">
                    <img src="/scroll-animation/third.jpg" alt="third"/>
                </div>
            </div>
          </div>
        </div>
      </section>
      <section className="scroll-outro scroll-animation-section">
        <h1 className="text-center w-1/2 h1-scroll-animation-text">Timeless design begins with a conversation.</h1>
      </section>
    </div>
  );
};

export default ScrollAnimationPage;
