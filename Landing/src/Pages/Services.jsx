import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const container = useRef(null);

  useEffect(() => {
    const q = gsap.utils.selector(container);
    gsap.from(q(".card"), {
      y: 30, opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out",
      scrollTrigger: { trigger: container.current, start: "top 80%" }
    });
  }, []);

  const services = [
    { title: "Creative Direction", body: "We craft the vision and creative plan." },
    { title: "Video Production", body: "Studio-grade production for web & ads." },
    { title: "Brand Identity", body: "Logo, visual system, and tone." }
  ];

  return (
    <div ref={container} className="max-w-7xl mx-auto px-6 py-24" id="solutions">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s,i) => (
          <div key={i} className="card glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-600">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
