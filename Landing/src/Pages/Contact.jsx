import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Contact() {
  const el = useRef(null);

  useEffect(() => {
    // when contact enters, slightly pulse CTA
    gsap.fromTo(el.current.querySelector(".cta"), { scale: 0.98 }, {
      scale: 1, duration: 0.6, ease: "elastic.out(1, 0.6)",
      scrollTrigger: { trigger: el.current, start: "top 70%" }
    });
  }, []);

  return (
    <div ref={el} id="contact" className="max-w-4xl mx-auto px-6 py-32 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to step into the light?</h2>
      <p className="text-gray-600 mb-8">Let’s make your brand the star of the show. Tell us about your project and we’ll take it from there.</p>
      <button className="cta px-8 py-4 rounded-full bg-gafferBlue text-white font-semibold shadow-lg">Let’s make you a star</button>
    </div>
  );
}
