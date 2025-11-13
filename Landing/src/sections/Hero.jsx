import React, { useEffect } from 'react';
import gsap from 'gsap';

const Hero = () => {

// const spotlight = document.querySelector(".spotlight");
// window.addEventListener("mousemove", e => {
//   const xPercent = 70 + (e.clientX / window.innerWidth ) * 20; 
//   const yPercent = 78 + (e.clientY / window.innerHeight ) * 16;

//   gsap.to(spotlight, {
//     "--spot-x": `${xPercent}%`,
//     "--spot-y": `${yPercent}%`,
//     duration: 0.6,
//     ease: "power2.out"
//   });
// });

const hero = document.querySelector(".hero");

window.addEventListener("mousemove", e => {
  const x =  (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  hero.style.setProperty("--cursor-x", `${x}%`);
  hero.style.setProperty("--cursor-y", `${y}%`);
  duration: 0.7;

});



  return (
    <div className="hero-section">
      <img src="/background.jpg" alt="hero background" className="hero-bg" />
      <div className="spotlight" id="spotlight" />
      <div class="vignette"></div>


      {/* text overlay inside the hero */}
      <div className="hero-inner container">
        <h4 className="headline">
          المحتوى هو <span className="text-[#F0706C]">الملك</span>
        </h4>
        <h1 className="headline">Content</h1>
        <h1 className="headline">
          is <span className="text-[#F0706C]">KING</span>
        </h1>
        <button className="cta">Contact Us</button>
      </div>
    </div>
  );
};

export default Hero;