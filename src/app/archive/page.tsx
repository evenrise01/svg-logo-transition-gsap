import React from "react";

import { ReactLenis } from "lenis/react";

const ArchivePage = () => {
  return (
    <>
      <ReactLenis />
      <div className="container">
        <div className="w-[30%] mx-auto py-[15rem] px-8 flex flex-col gap-8">
          <img src="/first.jpg" alt="first" className="aspect-[5/7]"/>
          <img src="/second.jpg" alt="second" className="aspect-[5/7]"/>
          <img src="/third.jpg" alt="third" className="aspect-[5/7]"/>
          <img src="/fourth.jpg" alt="fourth.jpg" className="aspect-[5/7]"/>
        </div>
      </div>
    </>
  );
};

export default ArchivePage;
