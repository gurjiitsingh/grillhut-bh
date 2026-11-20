"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { UseSiteContext } from "@/SiteContext/SiteContext";
import { Lato, Poppins } from "next/font/google";

//  Category type definition
export type CategoryType = {
  id: string;
  name: string;
  desc?: string;
  productDesc?: string;
  slug?: string;
  image?: string;
  isFeatured?: boolean | string;
  sortOrder?: number;
  disablePickupDiscount?: boolean;
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function CategorySlider() {
  const [categoryData, setCategoryData] = useState<CategoryType[]>([]);
  const [displayCategory, setDisplayCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    productCategoryIdG,
    setProductCategoryIdG,
    setDisablePickupCatDiscountIds,
    settings,
  } = UseSiteContext();

  //  Handle displayCategory selection


useEffect(() => {
  if (!productCategoryIdG) {
   setDisplayCategory(settings.display_category?.toString() ?? null);
  } else {
    setDisplayCategory(productCategoryIdG);
  }
}, [settings, productCategoryIdG]);

  //  Fetch categories
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/categories");
      const categories: CategoryType[] = await res.json();

      categories.sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));

      const featured = categories.filter(
        (category) => category.isFeatured !== "no"
      );
      setCategoryData(featured);

      const disablePickupCategoryIds = categories
        .filter((category) => category.disablePickupDiscount === true)
        .map((category) => category.id);

      setDisablePickupCatDiscountIds(disablePickupCategoryIds);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };



  fetchData();
}, []);


  //  Scroll handler
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
  <div
    id="order_now"
    className="scroll-mt-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 my-6"
  >
    {/* Left Arrow */}
    <button
      onClick={() => scroll("left")}
      className="
        absolute opacity-90 left-1 sm:left-2 top-[37%]
        -translate-y-1/2 z-10
        bg-[#F28C28]
        text-[#171310]
        p-2 sm:p-3
        rounded-full
        shadow-lg shadow-black/20
        hover:bg-[#FF9F3D]
        transition
      "
      aria-label="Scroll Left"
    >
      <FaChevronLeft className="text-sm sm:text-base" />
    </button>

    {/* Right Arrow */}
    <button
      onClick={() => scroll("right")}
      className="
        absolute opacity-90 right-1 sm:right-2 top-[37%]
        -translate-y-1/2 z-10
        bg-[#F28C28]
        text-[#171310]
        p-2 sm:p-3
        rounded-full
        shadow-lg shadow-black/20
        hover:bg-[#FF9F3D]
        transition
      "
      aria-label="Scroll Right"
    >
      <FaChevronRight className="text-sm sm:text-base" />
    </button>

    {/* Category Scroll Area */}
    <div
      ref={scrollRef}
      className="
        flex
        gap-3 sm:gap-4
        overflow-x-auto
        scroll-smooth
        snap-x snap-mandatory
        scrollbar-hide
        justify-start
        px-1
        py-2
      "
    >
      {categoryData.length > 0 ? (
        categoryData.map((category) => {
          const isActive = displayCategory === category.id;

          return (
            <div
              key={category.id}
              className="flex-shrink-0 snap-start"
            >
              <button
                onClick={() => setProductCategoryIdG(category.id)}
                className={`
                  group
                  w-[120px] sm:w-[140px]
                  h-[170px]
                  rounded-xl
                  transition-all duration-300 ease-in-out
                  flex flex-col items-center justify-start gap-3
                  border
                  ${
                    isActive
                      ? "bg-[#33271F] border-[#F28C28]/70 shadow-lg shadow-black/20"
                      : "bg-[#211B17] border-[#FFF3E3]/10 hover:border-[#F28C28]/40 hover:bg-[#2A211B]"
                  }
                `}
              >
                {/* Category Image */}
                <div
                  className={`
                    relative
                    w-full
                    h-[100px] sm:h-[110px]
                    rounded-xl
                    overflow-hidden
                    bg-[#171310]
                    ${
                      isActive
                        ? "border-2 border-[#F28C28]"
                        : "border border-[#FFF3E3]/10"
                    }
                  `}
                >
                  <img
                    src={category.image || "/com.jpg"}
                    alt={category.name || "Category"}
                    className="
                      w-full h-full
                      object-cover
                      transition-transform duration-300
                      group-hover:scale-105
                    "
                  />

                  {isActive && (
                    <div className="absolute inset-0 bg-[#F28C28]/10 pointer-events-none" />
                  )}
                </div>

                {/* Category Name */}
                <span
                  className={`
                    text-center
                    text-[14px]
                    font-bold
                    leading-tight
                    px-2
                    transition-colors
                    ${
                      isActive
                        ? "text-[#F28C28]"
                        : "text-[#FFF3E3] group-hover:text-[#FF9F3D]"
                    }
                  `}
                >
                  {category.name}
                </span>
              </button>
            </div>
          );
        })
      ) : (
        /* Skeleton Loader */
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="
              w-[130px] h-[150px]
              bg-[#211B17]
              border border-[#FFF3E3]/10
              animate-pulse
              rounded-xl
              flex-shrink-0
              snap-start
            "
          />
        ))
      )}
    </div>
  </div>
);
}
