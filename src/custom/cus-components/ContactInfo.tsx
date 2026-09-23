"use client";

import {
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ContactInfo({ outlet, schedule }: any) {
  if (!outlet) return null;

  return (
    <section className="relative bg-[#211B17] text-[#FFF3E3] py-16 md:py-24 px-6 overflow-hidden">

      {/* Subtle warm glow */}
      <div
        className="
          pointer-events-none
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[250px]
          rounded-full
          bg-[#F28C28]/5
          blur-3xl
        "
      />

      <div className="relative max-w-6xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-12 md:mb-16">

          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-10 h-[2px] bg-[#F28C28]" />

            <span className="text-[#F28C28] text-xs uppercase tracking-[0.25em] font-bold">
              Find Us
            </span>

            <span className="w-10 h-[2px] bg-[#F28C28]" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-[#FFF3E3]">
            Visit Grill Hut Junction
          </h2>

          <p className="mt-3 text-sm md:text-base text-[#B9ADA0]">
            Come hungry. Leave happy.
          </p>

        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

          {/* Address */}
          <div
            className="
              group
              bg-[#171310]
              border
              border-[#FFF3E3]/10
              rounded-2xl
              p-7
              text-center
              transition
              hover:border-[#F28C28]/40
              hover:-translate-y-1
            "
          >
            <div
              className="
                w-14
                h-14
                mx-auto
                mb-5
                rounded-full
                bg-[#211B17]
                border
                border-[#F28C28]/20
                flex
                items-center
                justify-center
                text-[#F28C28]
                group-hover:bg-[#F28C28]
                group-hover:text-[#171310]
                transition
              "
            >
              <FaMapMarkedAlt className="w-6 h-6" />
            </div>

            <h3 className="uppercase text-xs tracking-[0.2em] font-bold mb-4 text-[#FFF3E3]">
              Address
            </h3>

            <div className="space-y-1 text-sm text-[#B9ADA0] leading-6">
              <p className="text-[#FFF3E3] font-semibold">
                {outlet.outletName}
              </p>

              <p>{outlet.addressLine1}</p>

              {outlet.addressLine2 && (
                <p>{outlet.addressLine2}</p>
              )}

              <p>{outlet.city}</p>
            </div>
          </div>

          {/* Phone */}
          <div
            className="
              group
              bg-[#171310]
              border
              border-[#FFF3E3]/10
              rounded-2xl
              p-7
              text-center
              transition
              hover:border-[#F28C28]/40
              hover:-translate-y-1
            "
          >
            <div
              className="
                w-14
                h-14
                mx-auto
                mb-5
                rounded-full
                bg-[#211B17]
                border
                border-[#F28C28]/20
                flex
                items-center
                justify-center
                text-[#F28C28]
                group-hover:bg-[#F28C28]
                group-hover:text-[#171310]
                transition
              "
            >
              <FaPhoneAlt className="w-5 h-5" />
            </div>

            <h3 className="uppercase text-xs tracking-[0.2em] font-bold mb-4 text-[#FFF3E3]">
              Phone
            </h3>

            <div className="space-y-2 text-sm text-[#B9ADA0]">

              {outlet.phone ? (
                <a
                  href={`tel:${outlet.phone}`}
                  className="block hover:text-[#F28C28] transition"
                >
                  {outlet.phone}
                </a>
              ) : (
                <p>-</p>
              )}

              {outlet.phone2 && (
                <a
                  href={`tel:${outlet.phone2}`}
                  className="block hover:text-[#F28C28] transition"
                >
                  {outlet.phone2}
                </a>
              )}

            </div>
          </div>

          {/* Email */}
          <div
            className="
              group
              bg-[#171310]
              border
              border-[#FFF3E3]/10
              rounded-2xl
              p-7
              text-center
              transition
              hover:border-[#F28C28]/40
              hover:-translate-y-1
            "
          >
            <div
              className="
                w-14
                h-14
                mx-auto
                mb-5
                rounded-full
                bg-[#211B17]
                border
                border-[#F28C28]/20
                flex
                items-center
                justify-center
                text-[#F28C28]
                group-hover:bg-[#F28C28]
                group-hover:text-[#171310]
                transition
              "
            >
              <FaEnvelope className="w-5 h-5" />
            </div>

            <h3 className="uppercase text-xs tracking-[0.2em] font-bold mb-4 text-[#FFF3E3]">
              Email
            </h3>

            {outlet.email ? (
              <a
                href={`mailto:${outlet.email}`}
                className="
                  text-sm
                  text-[#B9ADA0]
                  break-words
                  hover:text-[#F28C28]
                  transition
                "
              >
                {outlet.email}
              </a>
            ) : (
              <p className="text-sm text-[#B9ADA0]">-</p>
            )}
          </div>

          {/* Timing */}
          <div
            className="
              group
              bg-[#171310]
              border
              border-[#FFF3E3]/10
              rounded-2xl
              p-7
              text-center
              transition
              hover:border-[#F28C28]/40
              hover:-translate-y-1
            "
          >
            <div
              className="
                w-14
                h-14
                mx-auto
                mb-5
                rounded-full
                bg-[#211B17]
                border
                border-[#F28C28]/20
                flex
                items-center
                justify-center
                text-[#F28C28]
                group-hover:bg-[#F28C28]
                group-hover:text-[#171310]
                transition
              "
            >
              <FaCalendarAlt className="w-5 h-5" />
            </div>

            <h3 className="uppercase text-xs tracking-[0.2em] font-bold mb-4 text-[#FFF3E3]">
              Opening Hours
            </h3>

            <div className="text-sm text-[#B9ADA0] space-y-1 leading-6">
              {schedule?.length ? (
                schedule.map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))
              ) : (
                <p>-</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
 
