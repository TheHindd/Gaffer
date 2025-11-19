import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Work() {
  const root = useRef(null);

  useEffect(() => {
    const cards = root.current.querySelectorAll(".proj");
    gsap.from(cards, { opacity: 0, y: 30, stagger: 0.14, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 80%" }
    });
  }, []);

  // placeholder projects
  const items = new Array(6).fill(0).map((_,i) => ({ title: `Project ${i+1}`, tag: "Motion" }));

  return (
    <div ref={root} className="max-w-7xl mx-auto px-6 py-24" id="work">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Selected Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it,i) => (
          <div key={i} className="proj bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="h-48 bg-gradient-to-br from-purple-200 via-blue-100 to-pink-100 flex items-center justify-center">
              <div className="w-32 h-20 rounded-xl bg-gradient-to-br from-blue-300 to-orange-200 shadow-xl" />
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-800">{it.title}</div>
              <div className="text-xs text-gray-500 mt-1">{it.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
