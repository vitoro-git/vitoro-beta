"use client";

import Lottie from "lottie-react";
import animationData from "./vito.json";

interface VitoAnimationProps {
  size?: number;
  className?: string;
}

export default function VitoAnimation({
  size = 300,
  className = "",
}: VitoAnimationProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Lottie
        animationData={animationData}
        style={{ width: size }}
        loop={true}
        autoplay={true}
      />
    </div>
  );
}
