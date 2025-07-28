"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AnimatedBG() {
  const images = ["/bg/bg3.jpg", "/bg/bg2.jpg", "/bg/bg1.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageLoad = (src: string) => {
    setLoadedImages((prev) => new Set([...prev, src]));
  };

  const isLoading = loadedImages.size < images.length;

  return (
    <div className="absolute inset-0 h-full w-full">
      {images.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 h-full w-full"
          style={{
            zIndex: index === currentImageIndex ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt={`Koh Phangan Landscape ${index + 1}`}
            fill
            className={`object-cover transition-all duration-[2000ms] ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
            quality={90}
            sizes="100vw"
            onLoad={() => handleImageLoad(src)}
          />
        </div>
      ))}
      {isLoading && <div className="absolute inset-0 z-20 bg-gray-900 transition-opacity duration-500" />}
    </div>
  );
}
