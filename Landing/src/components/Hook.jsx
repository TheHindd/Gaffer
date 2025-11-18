import {React, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Hook = () => {

   const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;

    gsap.from(el, {
      y: 30,                // start slightly lower
      opacity: 30,           // start transparent
      duration: 2,          // animation length
      ease: "power2.out",   // smooth easing
      scrollTrigger: {
        trigger: el,
        start: "top 50%",   // when section enters viewport
        toggleActions: "play none none reverse"
      }
    });
  }, []);


  return (
    
    <div ref={sectionRef} className='flex flex-row justify-center items-center '>  
    <img src="/MovieElements3.png" alt="hook image" className="size-35 "/>

      <h1 className='text-4xl font-bold z-10'>
        <p >Gaffer. Camera. Action. </p> </h1>
       {/* <img src="/MovieElement.png" alt="hook image" className="size-35  mr-10 "/> */}
    </div>
  )
}

export default Hook
