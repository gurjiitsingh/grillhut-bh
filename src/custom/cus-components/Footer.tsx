"use client";

import Link from "next/link";
import React from "react";
import { useLanguage } from "@/store/LanguageContext";
import { Cinzel, Lato, Roboto, Abel } from "next/font/google";
import {
  FaFire,
  FaArrowRight,
  FaInstagram,
  FaFacebookF,
  FaPhoneAlt,
} from "react-icons/fa";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const abel = Abel({
  subsets: ["latin"],
  weight: "400",
});

const fonts = {
  Cinzel: cinzel,
  Abel: abel,
  Lato: lato,
  Roboto: roboto,
};

const fontTitle =
  fonts[process.env.NEXT_PUBLIC_FONT_TITLE as keyof typeof fonts] || cinzel;

const fontDescription =
  fonts[process.env.NEXT_PUBLIC_FONT_DESCRIPTION as keyof typeof fonts] ||
  lato;

const fontPrice =
  fonts[process.env.NEXT_PUBLIC_FONT_PRICE as keyof typeof fonts] || roboto;

type FooterLink = {
  href: string;
  name: string;
};

type Props = {
  outlet?: any;
};

export default function Footer({ outlet }: Props) {
  const { TEXT, BRANDING } = useLanguage();

  // =========================================================
  // FALLBACK BRAND
  // =========================================================

  const fallbackBrand = {
    brand_name:
      outlet?.outletName || BRANDING?.brand_name || "Grill Hut Junction",

    poweredBy: BRANDING?.poweredBy || "Powered by",

    poweredByUrl:
      BRANDING?.poweredByUrl || "https://www.gstadeveloper.com",

    copyright: {
      prefix: BRANDING?.copyright?.prefix || "Copyright ©",

      suffix:
        BRANDING?.copyright?.suffix || "All Rights Reserved by",

      company:
        outlet?.outletName ||
        BRANDING?.copyright?.company ||
        "Grill Hut Junction",
    },
  };

  // =========================================================
  // FALLBACK TEXT
  // =========================================================

  const fallbackText = {
    logo_alt: TEXT?.logo_alt || "Restaurant Logo",

    sections: {
      links: {
        title: BRANDING?.sections?.links?.title || "Explore",

        items: BRANDING?.sections?.links?.items || [
          { name: "Home", href: "/" },
          { name: "Menu", href: "/menu" },
          { name: "About Us", href: "/about" },
          { name: "Contact", href: "/contact" },
          { name: "Table Reservation", href: "/reservation" },
          { name: "Allergens", href: "/allergene" },
        ],
      },

      company: {
        title: BRANDING?.sections?.company?.title || "Information",

        items: BRANDING?.sections?.company?.items || [
          { name: "Privacy Policy", href: "/privacy" },
          { name: "Terms of Service", href: "#" },
        ],
      },

      social: {
        title: BRANDING?.sections?.social?.title || "Follow Us",
      },
    },
  };

  // =========================================================
  // COMPANY NAME
  // =========================================================

  const companyName = outlet?.web
    ? new URL(
        outlet.web.startsWith("http")
          ? outlet.web
          : `https://${outlet.web}`
      ).hostname
    : outlet?.outletName || fallbackBrand.brand_name;

  return (
    <footer className="relative bg-[#171310] text-[#FFF3E3] overflow-hidden">

      {/* =====================================================
          TOP ACCENT
      ====================================================== */}

      <div className="h-1 w-full bg-[#F28C28]" />

      {/* =====================================================
          DECORATIVE GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          top-0
          right-0
          w-[420px]
          h-[420px]
          rounded-full
          bg-[#F28C28]/5
          blur-3xl
        "
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ===================================================
            MAIN FOOTER
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 py-16 md:py-20">

          {/* =================================================
              BRAND
          ================================================== */}

          <div className="lg:col-span-1">

            <Link
              href="/"
              className="inline-flex items-center group"
            >
              <div className="relative">

                <div
                  className="
                    absolute
                    -inset-3
                    rounded-full
                    bg-[#F28C28]/10
                    blur-xl
                    opacity-0
                    group-hover:opacity-100
                    transition
                  "
                />

                <img
                  className="
                    relative
                    h-24
                    md:h-28
                    w-auto
                    object-contain
                  "
                  src={outlet?.logo || "/logo.jpg"}
                  alt={fallbackText.logo_alt}
                />

              </div>
            </Link>

            <div className="mt-5">

              <h2
                className={`
                  ${fontTitle.className}
                  text-xl
                  md:text-2xl
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#FFF3E3]
                `}
              >
                {fallbackBrand.brand_name}
              </h2>

              <div className="flex items-center gap-2 mt-3">
                <FaFire className="text-[#F28C28]" />

                <span
                  className={`
                    ${fontDescription.className}
                    text-sm
                    text-[#B9ADA0]
                  `}
                >
                  Fresh from the grill
                </span>
              </div>

            </div>

            {/* Brand statement */}

            <p
              className={`
                ${fontDescription.className}
                mt-5
                max-w-sm
                text-sm
                leading-6
                text-[#9F9388]
              `}
            >
              Big flavours, smoky grills and freshly prepared food made
              to satisfy every craving.
            </p>

            {/* Social icons */}

            <div className="flex items-center gap-3 mt-7">

              <a
                href="#"
                aria-label="Instagram"
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-[#211B17]
                  border
                  border-[#FFF3E3]/10
                  text-[#B9ADA0]
                  hover:bg-[#F28C28]
                  hover:text-[#171310]
                  hover:border-[#F28C28]
                  transition
                "
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-[#211B17]
                  border
                  border-[#FFF3E3]/10
                  text-[#B9ADA0]
                  hover:bg-[#F28C28]
                  hover:text-[#171310]
                  hover:border-[#F28C28]
                  transition
                "
              >
                <FaFacebookF />
              </a>

            </div>

          </div>

          {/* =================================================
              EXPLORE LINKS
          ================================================== */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <span className="w-8 h-[2px] bg-[#F28C28]" />

              <h3
                className={`
                  ${fontTitle.className}
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#FFF3E3]
                `}
              >
                {fallbackText.sections.links.title}
              </h3>

            </div>

            <ul className="space-y-3">

              {fallbackText.sections.links.items.map(
                (item: FooterLink, idx: number) => (
                  <li key={idx}>

                    <Link
                      href={item.href}
                      className={`
                        ${fontDescription.className}
                        group
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-[#B9ADA0]
                        hover:text-[#F28C28]
                        transition
                      `}
                    >
                      <span
                        className="
                          w-0
                          h-[1px]
                          bg-[#F28C28]
                          group-hover:w-3
                          transition-all
                        "
                      />

                      {item.name}
                    </Link>

                  </li>
                )
              )}

            </ul>

          </div>

          {/* =================================================
              INFORMATION
          ================================================== */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <span className="w-8 h-[2px] bg-[#F28C28]" />

              <h3
                className={`
                  ${fontTitle.className}
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#FFF3E3]
                `}
              >
                {fallbackText.sections.company.title}
              </h3>

            </div>

            <ul className="space-y-3">

              {fallbackText.sections.company.items.map(
                (item: FooterLink, idx: number) => (
                  <li key={idx}>

                    <a
                      rel="noopener noreferrer"
                      href={item.href}
                      className={`
                        ${fontDescription.className}
                        group
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-[#B9ADA0]
                        hover:text-[#F28C28]
                        transition
                      `}
                    >
                      <span
                        className="
                          w-0
                          h-[1px]
                          bg-[#F28C28]
                          group-hover:w-3
                          transition-all
                        "
                      />

                      {item.name}
                    </a>

                  </li>
                )
              )}

            </ul>

          </div>

          {/* =================================================
              SOCIAL / CTA
          ================================================== */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <span className="w-8 h-[2px] bg-[#F28C28]" />

              <h3
                className={`
                  ${fontTitle.className}
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                  text-[#FFF3E3]
                `}
              >
                {fallbackText.sections.social.title}
              </h3>

            </div>

            <p
              className={`
                ${fontDescription.className}
                text-sm
                leading-6
                text-[#9F9388]
                mb-6
              `}
            >
              Hungry? Discover our menu and get your favourite grilled
              dishes on the table.
            </p>

            <Link
              href="/menu"
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#F28C28]
                px-6
                py-3
                text-sm
                font-bold
                uppercase
                tracking-wide
                text-[#171310]
                transition
                hover:bg-[#FF9F3D]
                hover:gap-4
              "
            >
              Explore Menu
              <FaArrowRight />
            </Link>

            {/* Contact */}

            {outlet?.phone && (
              <div className="flex items-center gap-3 mt-7">

                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#211B17]
                    border
                    border-[#FFF3E3]/10
                    flex
                    items-center
                    justify-center
                    text-[#F28C28]
                  "
                >
                  <FaPhoneAlt className="text-xs" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#857A71]">
                    Call Us
                  </p>

                  <a
                    href={`tel:${outlet.phone}`}
                    className="
                      text-sm
                      text-[#FFF3E3]
                      hover:text-[#F28C28]
                      transition
                    "
                  >
                    {outlet.phone}
                  </a>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          FOOTER BOTTOM
      ====================================================== */}

      <div className="border-t border-[#FFF3E3]/10 bg-[#0F0C0A]">

        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            sm:px-8
            lg:px-12
            py-5
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-3
          "
        >

          <p
            className={`
              ${fontDescription.className}
              text-xs
              text-[#857A71]
              text-center
              md:text-left
            `}
          >
            {fallbackBrand.copyright.prefix}{" "}
            {new Date().getFullYear()}{" "}
            {fallbackBrand.copyright.suffix}{" "}
            <span className="text-[#B9ADA0]">
              {companyName}
            </span>
          </p>

          <p
            className={`
              ${fontDescription.className}
              text-xs
              text-[#857A71]
            `}
          >
            {fallbackBrand.poweredBy}{" "}

            <a
              href={fallbackBrand.poweredByUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-[#B9ADA0]
                hover:text-[#F28C28]
                transition
              "
            >
              {new URL(fallbackBrand.poweredByUrl).hostname}
            </a>
          </p>

        </div>

      </div>

    </footer>
  );
}
 
