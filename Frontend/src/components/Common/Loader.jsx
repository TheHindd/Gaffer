import React from "react";

export const BubbleLoading = (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="2" r="0" fill="#000000">
        <animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
    <circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(45 12 12)">
        <animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
    <circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(90 12 12)">
        <animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
    <circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(135 12 12)">
        <animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
    <circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(180 12 12)">
        <animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
    <circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(225 12 12)">
        <animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
    <circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(270 12 12)">
        <animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
    <circle cx="12" cy="2" r="0" fill="#000000" transform="rotate(315 12 12)">
        <animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
    </circle>
</svg>
    )
const Loader = ({ text = "Loading..." }) => {

    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Spinner Icon */}
      <BubbleLoading className=" text-blue-500 w-10 h-10 mb-3" />

      {/* Optional text */}
      <p className="text-gray-600 text-sm font-medium">{text}</p>
    </div>
  );
};

export default Loader;
