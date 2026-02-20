"use client";
import React, { useRef, useEffect, useState } from "react";

export const ContainerScroll = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
        setScrollY(scrollProgress);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate transform values based on scroll
  const scale = Math.max(0.7, 1 - scrollY * 0.3);
  const rotate = scrollY * -10;
  const translateY = scrollY * 50;

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div className="py-10 md:py-40 w-full relative">
        <Header translate={translateY} titleComponent={titleComponent} />
        <Card 
          rotate={rotate} 
          translate={translateY} 
          scale={scale} 
          className="max-w-5xl mx-auto h-[30rem] md:h-[40rem] w-full"
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <div
      style={{
        transform: `translateY(${translate}px)`,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </div>
  );
};

export const Card = ({ rotate, scale, translate, children, className }) => {
  return (
    <div
      style={{
        transform: `rotateX(${rotate}deg) scale(${scale}) translateY(${translate}px)`,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
      className={`${className} border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl`}
    >
      <div className="bg-gray-100 h-full w-full rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
};
