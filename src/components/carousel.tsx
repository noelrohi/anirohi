"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
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
      adaptiveHeight
      className="rounded-lg"
      defaultControlsConfig={{
        nextButtonText: <ArrowRightIcon />,
        prevButtonText: <ArrowLeftIcon />,
        pagingDotsClassName: "hidden",
      }}
    >
      {children}
    </Carousel>
  );
}
