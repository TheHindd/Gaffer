// src/components/Hero.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

  const Hero = ({children}) => {
  const heroRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const spotlight = spotlightRef.current;
    if (!hero || !spotlight) return;

    // Initial open animation for spotlight CSS vars
    gsap.fromTo(
      spotlight,
      { "--spot-w": "0vw", "--spot-h": "0vh" },
      { "--spot-w": "40vw", "--spot-h": "18vh", duration: 2.2, ease: "power3.out" }
    );

    // mousemove handler - use gsap.to to smooth updates
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      gsap.to(hero, { css: { "--cursor-x": `${x}%`, "--cursor-y": `${y}%` }, duration: 0.6, overwrite: true });
    };

    window.addEventListener("mousemove", onMove);

    // refresh spotlight sizes when resizing
    const onResize = () => gsap.set(spotlight, { "--spot-w": getComputedStyle(spotlight).getPropertyValue("--spot-w") });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(hero);
      gsap.killTweensOf(spotlight);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-section relative">
      <img src="/background.jpg" alt="hero background" className="hero-bg" />
      {/* spotlight div — we animate CSS vars on this element */}
      <div ref={spotlightRef} className="spotlight" aria-hidden />
      <div className="cursor" />


      {/* Insert Navbar inside hero */}
      <div className="hero-navbar">
        {children}
      </div>

      <div className="vignette" aria-hidden />

      {/* SVG blob (decorative) */}
      <svg className="hero-blob" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden>
        <path fill="#ffffffff" d="M0,0 C250,700 500,50 800,0 L800,600 L0,600 Z">
          <animate attributeName="d" dur="10s" repeatCount="indefinite"
            values="
              M0,0 C350,800 400,50 900,0 L900,700 L0,700 Z;
              M0,0 C400,600 400,25 900,0 L900,700 L0,700 Z;
              M0,0 C300,450 400,50 900,0 L900,700 L0,700 Z;
              M0,0 C350,800 400,25 900,0 L900,700 L0,700 Z
            " />
        </path>
      </svg>

      <div className="hero-inner container">
        <h1 className="headline leading-tight">
          <span className="block" dir="rtl">امتلك الأضواء.<span className="text-[#F0706C]"></span></span>
          <span className="block">
            Own The <span className="text-[#F0706C]">Spotlight.</span>
          </span>
        </h1>
        <p className="subcopy">
          سيطر على <span className="text-[#F0706C]">المسرح</span> — حلول إنتاج محتوى إبداعي
        </p>

        <div className="mt-6">
          <a href="#contact" className="cta inline-block">Contact Us</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
