"use client";

import Image from "next/image";
import Link from "next/link";
import { Chicle } from "next/font/google";
import { FaFire, FaArrowRight } from "react-icons/fa";

const chicle = Chicle({
  subsets: ["latin"],
  weight: "400",
});

export default function GrillHutHero() {
  return (
    <section className="relative min-h-[720px] md:min-h-[820px] overflow-hidden bg-[#171310] text-[#FFF3E3]">

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/grill-hero.jpg"
          alt="Freshly grilled food from Grill Hut Junction"
          fill
          priority
          className="object-cover"
        />

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Warm grill glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_55%,rgba(242,140,40,0.25),transparent_45%)]" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#171310] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-[720px] md:min-h-[820px] px-6 sm:px-8 lg:px-12 flex items-center">

        <div className="max-w-3xl pt-16 md:pt-10">

          {/* Small Label */}
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F28C28] text-[#171310]">
              <FaFire />
            </span>

            <span className="uppercase tracking-[0.25em] text-sm font-semibold text-[#F28C28]">
              Straight From The Grill
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`
              ${chicle.className}
              text-6xl
              sm:text-7xl
              md:text-8xl
              lg:text-9xl
              leading-[0.88]
              uppercase
              text-[#FFF3E3]
              drop-shadow-2xl
            `}
          >
            GrillHut 
            <br />

            <span className="text-[#F28C28]">
             Junction.
            </span>
             <span className="text-[#F28C28] text-xl">
             Love it.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-base md:text-lg leading-7 text-[#E4D8CC]">
            Juicy & smoky grills, loaded sides and bold flavours —
            made fresh and served hot at Grill Hut Junction.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-9">

            <Link
              href="/menu"
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#F28C28]
                px-7
                py-4
                text-[#171310]
                font-bold
                uppercase
                tracking-wide
                shadow-lg
                shadow-orange-950/30
                transition
                hover:bg-[#FF9F3D]
                hover:scale-[1.02]
              "
            >
              Order Now
              <FaArrowRight />
            </Link>

            <Link
              href="/menu"
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-[#FFF3E3]/40
                bg-white/5
                backdrop-blur-sm
                px-7
                py-4
                text-[#FFF3E3]
                font-semibold
                uppercase
                tracking-wide
                transition
                hover:bg-[#FFF3E3]
                hover:text-[#171310]
              "
            >
              Explore Menu
            </Link>

          </div>

          {/* Bottom Highlights */}
          <div className="flex flex-wrap gap-6 mt-12 text-sm text-[#C9BDB1]">
            <div>
              <span className="text-[#F28C28] font-bold">🔥</span>{" "}
              Freshly Grilled
            </div>

            <div>
              <span className="text-[#F28C28] font-bold">●</span>{" "}
              Made To Order
            </div>

            <div>
              <span className="text-[#F28C28] font-bold">★</span>{" "}
              Big Flavours
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
 
