import React, { useEffect } from 'react';
import gsap from 'gsap';

const Hero = () => {


window.addEventListener("load", () => {
  gsap.fromTo(".spotlight",
    { "--spot-w": "0vw", "--spot-h": "0vh" }, // start tiny
    { "--spot-w": "40vw", "--spot-h": "18vh", // final beam size
      duration: 2.5,
      ease: "power3.out"
    }
  );
});

const hero = document.querySelector(".hero");

window.addEventListener("mousemove", e => {
  const x =  (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  hero.style.setProperty("--cursor-x", `${x}%`);
  hero.style.setProperty("--cursor-y", `${y}%`);
  duration: 0.6;

});



  return (
    <div className="hero-section">
      
      <img src="/background.jpg" alt="hero background" className="hero-bg" />
      <div className="spotlight" id="spotlight" />
     
      <div class="vignette"></div>

       {/* Animated SVG blob background */}
    <svg className="hero-blob" viewBox="0 0 800 600" preserveAspectRatio="none">
        <path fill="#fff" d="M0,0 C250,700 500,50 800,0 L800,600 L0,600 Z">
          <animate attributeName="d" dur="10s" repeatCount="indefinite"
          values="
            M0,0 C350,800 400,50 900,0 L900,700 L0,700 Z;
            M0,0 C400,600 400,25 900,0 L900,700 L0,700 Z;
            M0,0 C300,450 400,50 900,0 L900,700 L0,700 Z;
            M0,0 C350,800 400,25 900,0 L900,700 L0,700 Z
          " />
        </path>
      </svg>
   
  

      {/* text overlay inside the hero */}
      <div className="hero-inner container">
        <h4 className="headline" >
         <p>.امتلك الأضواء</p>
         <p dir="rtl" >سيطر على <span dir="rtl" className="text-[#F0706C]">
          المسرح.</span></p>
        </h4>
        <h1 className="headline">Own The Spotlight. </h1>
        <h1 className="headline">
          Command The <span className="text-[#F0706C]">Stage.</span>
        </h1>
        <button className="cta">Contact Us</button>
      </div>
    </div>
  );
};

export default Hero;