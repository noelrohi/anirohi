"use client";

import Carousel from "nuka-carousel";

export default function CarouselSlider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Carousel
      autoplay
      pauseOnHover
      dragging
      className="hover: cursor-grab"
      defaultControlsConfig={{
        nextButtonClassName: "hidden",
        prevButtonClassName: "hidden",
      }}
    >
      {children}
    </Carousel>
  );
}
