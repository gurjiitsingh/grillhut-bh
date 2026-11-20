"use client";

import { useEffect, useMemo } from "react";
import { UseSiteContext } from "@/SiteContext/SiteContext";
import { ProductType } from "@/lib/types/productType";
import { addOnType } from "@/lib/types/addOnType";
import { cartProductType } from "@/lib/types/cartDataType";
import { formatCurrencyNumber } from "@/utils/formatCurrency";
 
import Image from "next/image";
import { useState } from "react";
import type { TnewModifierItemSchema } from "@/lib/types/modifierItemType";
import { IoClose } from "react-icons/io5";
import CartButtonAdd from "@/components/AddToCart/CartButtonAdd";
export default function Card({
  product,
  variants,
  allAddOns,
  modifierGroups,
  productModifiers,
}: {
  product: ProductType;
  variants: ProductType[];
  allAddOns: addOnType[];
  modifierGroups: any[];
  productModifiers: any[];

}) {

  type ModifierItem = TnewModifierItemSchema & {
  id: string;
};
  const { settings } = UseSiteContext();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductType | null>(null);

  const [selectedModifiers, setSelectedModifiers] = useState<{
    [groupId: string]: any[];
  }>({});



  const shouldOpenPopup =
    product.hasVariants || product.hasModifier;

   


  const [simpleNoteOpen, setSimpleNoteOpen] = useState(false);


  const [popupNote, setPopupNote] = useState("");
  const [quickNote, setQuickNote] = useState("");

  //  FILTER VARIANTS FOR THIS PRODUCT
  const productVariants = useMemo(() => {
    if (!product.hasVariants) return [];
    return variants
      .filter((v) => v.parentId === product.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [product.id, product.hasVariants, variants]);
  const [modifiersLoaded, setModifiersLoaded] = useState(false);

  const productGroupIds = useMemo(() => {
    return productModifiers
      .filter((pm) => pm.productId === product.id)
      .map((pm) => pm.groupId);
  }, [product.id, productModifiers]);

  const productModifierGroups = useMemo(() => {
    return modifierGroups.filter((g) =>
      productGroupIds.includes(g.group.id)
    );
  }, [modifierGroups, productGroupIds]);

  useEffect(() => {
    if (!productModifierGroups.length) return;

    console.log("🍕 Product:", product.name);
    console.log("🔥 FULL GROUPS:", productModifierGroups);
  }, [productModifierGroups]);



  useEffect(() => {
    if (isOpen) {
      setSelectedModifiers({});
      setPopupNote(""); // ✅ reset properly

      if (productVariants.length > 0) {
        setSelectedVariant(productVariants[0]);
      }
    }
  }, [isOpen]);

  // ---------------- PRICE ----------------
  const priceRegular = formatCurrencyNumber(
    product.price ?? 0,
    settings.currency as string,
    settings.locale as string
  );

  const priceTarget =
    product.discountPrice && product.discountPrice > 0
      ? product.discountPrice
      : product.price ?? 0;

  const priceDiscounted =
    product.discountPrice && product.discountPrice > 0
      ? formatCurrencyNumber(
        product.discountPrice,
        settings.currency as string,
        settings.locale as string
      )
      : null;

  const cartProduct: cartProductType = {
    id: product.id,
    uniqueKey:
      product.id.toString() +
      "_" +
      (quickNote?.trim() || ""),
    note: quickNote,
    quantity: 1,
    currentStock: product.currentStock!,
    price: priceTarget,
    basePrice: priceTarget,
    name: product.name,
    image: product.image,
    categoryId: product.categoryId,
    productCat: product.productCat!,
    taxRate: product.taxRate,
    taxType: product.taxType,

  };

  const modifiersFlat = Object.values(selectedModifiers).flat();



  const uniqueKey =
    (selectedVariant?.id ?? product.id) +
    "_" +
    modifiersFlat.map((m) => m.id).sort().join("_") +
    "_" +
    (popupNote?.trim() || "");

  useEffect(() => {
    if (isOpen && productVariants.length > 0) {
      setSelectedVariant(productVariants[0]);
    }
  }, [isOpen, productVariants]);

  const selectedProduct = selectedVariant ?? product;

  const modifiersTotal = Object.values(selectedModifiers)
    .flat()
    .reduce((sum, item) => sum + (item.price ?? 0), 0);

  const basePrice = selectedProduct.price ?? 0;

  const finalPrice = basePrice + modifiersTotal;


  const isValidSelection = productModifierGroups.every((groupData) => {
    const selected = selectedModifiers[groupData.group.id] || [];

    return (
      selected.length >= groupData.group.minSelection &&
      selected.length <= groupData.group.maxSelection
    );
  });

  // ---------------- UI ----------------
return (
  <>
    {/* PRODUCT CARD */}
    <div className="flex flex-col gap-2 bg-[#211B17] w-full md:w-[49%] rounded-2xl border border-[#FFF3E3]/10 shadow-lg shadow-black/10 p-3">

      {/* PRODUCT HEADER */}
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#171310] border border-[#FFF3E3]/10 shrink-0">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#FFF3E3]">
            {product.name}
          </h3>

          <p className="text-sm text-[#B9ADA0]">
            {product.productDesc}
          </p>

          {shouldOpenPopup ? (
            <div className="flex justify-between items-center mt-2">
              <div>
                {priceDiscounted ? (
                  <>
                    <span className="font-bold text-[#F28C28]">
                      {priceDiscounted}
                    </span>
                    <span className="line-through ml-2 text-sm text-[#B9ADA0]">
                      {priceRegular}
                    </span>
                  </>
                ) : (
                  <span className="text-[#FFF3E3] font-semibold">
                    {priceRegular}
                  </span>
                )}
              </div>

              <div className="bg-[#171310] p-1 rounded-lg border border-[#FFF3E3]/10">
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-[70px] px-1 py-1 rounded-lg bg-[#F28C28] text-[#171310] font-bold flex items-center justify-center hover:bg-[#FF9F3D] transition"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2 gap-2">
              <div>
                {priceDiscounted ? (
                  <>
                    <span className="font-bold text-[#F28C28]">
                      {priceDiscounted}
                    </span>
                    <span className="line-through ml-2 text-sm text-[#B9ADA0]">
                      {priceRegular}
                    </span>
                  </>
                ) : (
                  <span className="text-[#FFF3E3] font-semibold">
                    {priceRegular}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Note */}
                <button
                  onClick={() => {
                    setQuickNote("");
                    setSimpleNoteOpen(true);
                  }}
                  className="text-[#B9ADA0] text-xs hover:text-[#FF9F3D] transition"
                >
                  + Note
                </button>

                {/* Add */}
                <CartButtonAdd
                  cartProduct={{
                    ...cartProduct,
                    note: "",
                    uniqueKey: product.id.toString(),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* VARIANT / MODIFIER POPUP */}
    {isOpen && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4">

        <div className="bg-[#211B17] border border-[#FFF3E3]/10 w-full max-w-[400px] max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden">

          {/* POPUP HEADER */}
          <div className="px-4 pt-4 pb-3 border-b border-[#FFF3E3]/10">
            <h2 className="text-lg font-bold text-[#FFF3E3]">
              {product.name}
            </h2>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="overflow-y-auto p-4 flex-1">

            {/* VARIANTS */}
            {productVariants.map((variant) => (
              <label
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`flex justify-between items-center p-3 mb-2 rounded-lg cursor-pointer border transition ${
                  selectedVariant?.id === variant.id
                    ? "bg-[#33271F] border-[#F28C28]"
                    : "bg-[#171310] border-[#FFF3E3]/10 hover:border-[#F28C28]/40"
                }`}
              >
                <div className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedVariant?.id === variant.id}
                    onChange={() => setSelectedVariant(variant)}
                    className="accent-[#F28C28]"
                  />

                  <span className="text-[#FFF3E3] text-sm font-medium">
                    {variant.name}
                  </span>
                </div>

                <span className="text-sm font-semibold text-[#F28C28]">
                  {formatCurrencyNumber(variant.price ?? 0)}
                </span>
              </label>
            ))}

            {/* MODIFIERS */}
            {productModifierGroups.length > 0 && (
              <div className="mb-4 mt-4">
                {productModifierGroups.map((groupData) => (
                  <div
                    key={groupData.group.id}
                    className="mb-4 border-t border-[#FFF3E3]/10 pt-3"
                  >
                    <p className="font-semibold text-[#FFF3E3]">
                      {groupData.group.name}
                    </p>

                    <p className="text-xs text-[#B9ADA0] mt-1 mb-2">
                      Min: {groupData.group.minSelection} | Max:{" "}
                      {groupData.group.maxSelection}
                    </p>

                    {groupData.items.map((item: ModifierItem) => {
                      const selectedItems =
                        selectedModifiers[groupData.group.id] || [];

                      const isChecked = selectedItems.some(
                        (i) => i.id === item.id
                      );

                      const handleChange = () => {
                        setSelectedModifiers((prev) => {
                          const prevItems =
                            prev[groupData.group.id] || [];

                          let updated = [...prevItems];

                          if (groupData.group.maxSelection === 1) {
                            updated = [item];
                          } else {
                            const exists = prevItems.some(
                              (i) => i.id === item.id
                            );

                            if (exists) {
                              updated = prevItems.filter(
                                (i) => i.id !== item.id
                              );
                            } else if (
                              prevItems.length <
                              groupData.group.maxSelection
                            ) {
                              updated.push(item);
                            }
                          }

                          return {
                            ...prev,
                            [groupData.group.id]: updated,
                          };
                        });
                      };

                      return (
                        <label
                          key={item.id}
                          className="flex justify-between items-center py-2 border-b border-[#FFF3E3]/5 cursor-pointer"
                        >
                          <span className="text-sm text-[#FFF3E3]">
                            {item.name}
                          </span>

                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#F28C28]">
                              +{item.price}
                            </span>

                            <input
                              type={
                                groupData.group.maxSelection === 1
                                  ? "radio"
                                  : "checkbox"
                              }
                              checked={isChecked}
                              onChange={handleChange}
                              className="accent-[#F28C28]"
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* POPUP FOOTER */}
          <div className="p-4 border-t border-[#FFF3E3]/10 bg-[#1B1511]">

            {/* NOTE INPUT */}
            <div>
              <label className="text-sm font-medium text-[#FFF3E3]">
                Add Note (optional)
              </label>

              <textarea
                value={popupNote}
                onChange={(e) => setPopupNote(e.target.value)}
                placeholder="e.g. less spicy, no onion..."
                className="w-full mt-2 p-2.5 bg-[#171310] border border-[#FFF3E3]/15 text-[#FFF3E3] placeholder:text-[#8D8175] rounded-lg text-sm focus:outline-none focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20 resize-none"
                rows={2}
              />
            </div>

            <p className="font-semibold text-right text-[#FFF3E3] mt-3">
              Total:{" "}
              <span className="text-[#F28C28]">
                {formatCurrencyNumber(finalPrice)}
              </span>
            </p>

            <div className="flex items-center justify-between my-2 gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-[#33271F] text-[#FFF3E3] border border-[#FFF3E3]/10 hover:bg-[#443328] transition"
              >
                <IoClose size={20} />
              </button>

              <div>
                <CartButtonAdd
                  cartProduct={{
                    id: selectedVariant?.id ?? product.id,
                    uniqueKey: uniqueKey,
                    price: finalPrice,
                    basePrice:
                      selectedVariant?.price ?? product.price ?? 0,
                    name: selectedVariant?.name ?? product.name,

                    quantity: 1,
                    currentStock:
                      selectedVariant?.currentStock ??
                      product.currentStock!,

                    image: product.image,
                    categoryId: product.categoryId,
                    productCat: product.productCat!,

                    taxRate: selectedProduct.taxRate,
                    taxType: selectedProduct.taxType,

                    parentProductId: product.id,

                    modifiers: Object.values(selectedModifiers).flat(),

                    note: popupNote,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* QUICK NOTE POPUP */}
    {simpleNoteOpen && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-[#211B17] border border-[#FFF3E3]/10 w-full max-w-[350px] rounded-2xl p-5 shadow-2xl">

          {/* TITLE */}
          <h2 className="font-semibold text-lg mb-3 text-[#FFF3E3]">
            {product.name}
          </h2>

          {/* TEXTAREA */}
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="e.g. no onion, less spicy..."
            className="w-full bg-[#171310] border border-[#FFF3E3]/15 text-[#FFF3E3] placeholder:text-[#8D8175] rounded-lg p-2.5 h-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C28]/30 focus:border-[#F28C28]"
          />

          {/* BUTTONS */}
          <div className="flex justify-between items-center mt-5 gap-3">
            <button
              onClick={() => {
                setSimpleNoteOpen(false);
                setQuickNote("");
              }}
              className="border border-[#FFF3E3]/15 hover:bg-[#33271F] text-[#FFF3E3] px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <IoClose />
            </button>

            <div>
              <CartButtonAdd
                cartProduct={{
                  ...cartProduct,
                  note: quickNote,
                  uniqueKey:
                    product.id.toString() + "_" + quickNote,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
}
