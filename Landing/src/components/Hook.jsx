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
      className="flex flex-row justify-center items-center gap-6 py-20"
    >
      <img src="/MovieElements3.png" alt="hook" className="size-35" />

      <h1 className="text-4xl font-bold">
        Gaffer. Camera. Action.
      </h1>
    </div>
  );
};

export default Hook;
