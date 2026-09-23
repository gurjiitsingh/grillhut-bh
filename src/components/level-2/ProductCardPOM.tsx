"use client";

import { UseSiteContext } from "@/SiteContext/SiteContext";
import React from "react";

import { cartProductType } from "@/lib/types/cartDataType";
import { ProductType } from "@/lib/types/productType";
import { formatCurrencyNumber } from "@/utils/formatCurrency";

import { Lato } from "next/font/google";
import {
  Flame,
  Leaf,
} from "lucide-react";

import {
  FaFireAlt,
  FaHeart,
  FaLeaf,
  FaSmile,
} from "react-icons/fa";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export default function ProductCardPrductOfMonth({
  product,
}: {
  product: ProductType;
}) {
  const { settings } = UseSiteContext();

  // =========================================================
  // PRICE
  // =========================================================

  const priceRegular = formatCurrencyNumber(
    product.price ?? 0,
    settings.currency as string,
    settings.locale as string
  );

  let priceDiscounted;
  let priceTarget = product.price ?? 0;

  if (product.discountPrice && product.discountPrice > 0) {
    priceTarget = product.discountPrice;

    priceDiscounted = formatCurrencyNumber(
      product.discountPrice,
      settings.currency as string,
      settings.locale as string
    );
  }

  // =========================================================
  // CART PRODUCT
  // =========================================================

  const cartProduct: cartProductType = {
    id: product.id,
    quantity: 1,
    currentStock: product.currentStock!,
    price: priceTarget,
    name: product.name,
    image: product.image,
    categoryId: product.categoryId,
    productCat: product.productCat!,
    taxRate: product.taxRate,
    taxType: product.taxType,
  };

  // =========================================================
  // TIME RESTRICTION
  // =========================================================

  const isCartDisabled = (() => {
    if (product.categoryId !== "2vvuGl0pgbvvyEPc7o83") {
      return false;
    }

    const berlinTime = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Berlin",
    });

    const berlinHour = new Date(berlinTime).getHours();

    return !(berlinHour >= 11 && berlinHour < 16);
  })();

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      key={product.id}
      className="
        w-[240px]
        sm:min-w-[280px]
        md:min-w-[300px]
        flex-shrink-0
        snap-center
      "
    >
      {/* Main Card */}
      <div
        className="
          relative
          bg-[#171310]
          border
          border-[#FFF3E3]/10
          rounded-2xl
          overflow-hidden
          transition
          duration-300
          hover:border-[#F28C28]/40
          hover:-translate-y-1
        "
      >
        <button className="text-left w-full px-4 pt-4 pb-3">

          {/* Product Name */}
          <h3
            className={`
              ${lato.className}
              w-full
              text-lg
              sm:text-xl
              font-bold
              text-[#FFF3E3]
              mb-2
              line-clamp-2
            `}
          >
            {product.name}
          </h3>

          {/* Food Indicators */}
          <div className="flex items-center gap-3 text-[#F28C28] text-xs mb-2">
            <span className="flex items-center gap-1">
              <FaFireAlt />
              Grilled
            </span>

            <span className="flex items-center gap-1">
              <FaLeaf />
              Fresh
            </span>

            <span>🌶️</span>
          </div>

          {/* Description */}
          <p
            className="
              w-full
              h-[60px]
              text-[#B9ADA0]
              text-xs
              sm:text-[13px]
              leading-snug
              mb-2
              overflow-hidden
            "
          >
            {product.productDesc ||
              "Delicious grilled favourite from Grill Hut Junction."}
          </p>

          {/* Price */}
          <div className="w-full flex justify-end">

            {product.discountPrice !== undefined &&
            product.discountPrice > 0 ? (
              <div className="text-base font-bold text-[#F28C28] flex items-center gap-2">

                <div className="line-through text-[#857A71] text-sm">
                  {priceRegular}
                </div>

                <div className="text-base font-bold text-[#F28C28]">
                  {priceDiscounted}
                </div>

              </div>
            ) : (
              <div className="text-base font-bold text-[#F28C28]">
                {priceRegular}
              </div>
            )}

          </div>
        </button>
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-3 px-2 mt-[-1px] text-xs sm:text-sm">

        <span
          className="
            flex
            items-center
            gap-1
            text-[#B9ADA0]
            bg-[#171310]
            border-x
            border-b
            border-[#FFF3E3]/10
            px-2
            py-1
            rounded-b-lg
          "
        >
          <FaHeart className="text-[#F28C28]" />
          41
        </span>

        <span
          className="
            flex
            items-center
            gap-1
            text-[#B9ADA0]
            bg-[#171310]
            border-x
            border-b
            border-[#FFF3E3]/10
            px-2
            py-1
            rounded-b-lg
          "
        >
          <FaSmile className="text-[#F28C28]" />
          13
        </span>

      </div>
    </div>
  );
}
 
