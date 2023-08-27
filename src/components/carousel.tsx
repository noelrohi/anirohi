"use client";

import Carousel from "nuka-carousel";
import { Icons } from "./icons";

export default function CarouselSlider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Carousel
      autoplay
      pauseOnHover
      adaptiveHeight
      defaultControlsConfig={{
        nextButtonText: <Icons.right />,
        prevButtonText: <Icons.left />,
        pagingDotsClassName: "hidden",
      }}
    >
      {children}
    </Carousel>
  );
}
