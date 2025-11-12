import React from 'react';

const Hero = () => {
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