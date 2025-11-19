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
  ];

  return (
    <section className="w-full py-20 ">
      <div className="max-w-7xl mx-auto px-6 md:px-12 ">
        <div className="flex flex-wrap justify-center ">
          {stats.map((s, i) => (
            <div
              key={i}
              ref={setRef}
              className="relative flex-1 min-w-[220px] max-w-[32%] "
            >
              {/* STATIC FILM FRAME (no animation) */}
              <img
                src="/filmframe.png"
                alt="film frame"
                className="w-full h-auto object-cover block "
                width="602"
                height="536"
              />

              {/* CENTER CONTENT */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <h1
                  className="stat-number text-4xl md:text-5xl font-extrabold leading-none"
                  data-value={s.number}
                  data-suffix={s.suffix}
                >
                  0
                </h1>
                <p className="text-sm md:text-lg mt-2 text-gray-700">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
