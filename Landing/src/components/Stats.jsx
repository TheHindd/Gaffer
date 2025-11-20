// Stats.jsx
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const setRef = (el) => {
    if (el) cardsRef.current.push(el);
  };

  useEffect(() => {
    ScrollTrigger.refresh();

    cardsRef.current.forEach((card) => {
      const numberEl = card.querySelector(".stat-number");
      const finalValue = Number(numberEl.dataset.value);
      const suffix = numberEl.dataset.suffix || "";
      const proxy = { value: 0 };

      gsap.to(proxy, {
        value: finalValue,
        duration: 1.8,
        ease: "power1.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          numberEl.textContent = Math.floor(proxy.value) + suffix;
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const stats = [
    { number: 50, label: "Clients", suffix: "+" },
    { number: 100, label: "Satisfied Customers", suffix: "+" },
    { number: 30, label: "Increase in Sales ", suffix: "%", },
    { number: 150, label: "Projects ", suffix: "+", },
    { number: 20, label: "employee ", suffix: "+", },
  ];

  return (
    <section className="w-full py-10 ">
      <div className="max-w-7xl mx-auto px-6 md:px-12 bg-black ">
        <div className="flex flex-wrap justify-center ">
          {stats.map((s, i) => (
            <div
              key={i}
              ref={setRef}
              className="relative flex-1 max-w-[87px] md:min-w-[220px] max-w-[3%] "
            >
              {/* STATIC FILM FRAME (no animation) */}
              <img
                src="/filmframe2.jpg"
                alt="film frame"
                className="w-full h-auto object-cover block "
                width="489"
                height="435"
              />

              {/* CENTER CONTENT */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <h1
                  className="stat-number text-md md:text-5xl font-extrabold leading-none"
                  data-value={s.number}
                  data-suffix={s.suffix}
                >
                  0
                </h1>
                <p className="text-xs md:text-xl md:font-semibold mt-1 md:mt-2 text-yellow-600">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
