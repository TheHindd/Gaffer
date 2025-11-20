import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hook = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;

    gsap.fromTo(
      el,
      { 
        y: 40,            // starts lower
        opacity: 0,       // fades in cleanly
        filter: "blur(8px)"  // subtle blur entrance
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",     // smoother trigger
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex grid grid-flow-row grid-cols-9 justify-center items-center py-10 "
    >
      <img src="/MovieElements3.png" alt="hook" className="size-30 col-start-4 col-end-5 row-start-2"  />

      <h1 className="text-3xl font-bold col-start-5 col-end-9 row-start-2">
        Gaffer. Camera. Action.
      </h1>

      {/* <p className="text-sm text-red-400 font-semibold col-start-3 col-end-8 row-start-1 mb-8"> we give you the light you need</p>
      <p className="text-sm text-red-400 font-semibold col-start-8 col-end-10 row-start-3 " > so you can take the action</p>
    > */}
    </div>
  );
};

export default Hook;
