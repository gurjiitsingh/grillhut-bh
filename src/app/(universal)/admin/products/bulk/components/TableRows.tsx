"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaSave } from "react-icons/fa";
import { updateProductField } from "@/app/(universal)/action/products/dbOperation";
import { ProductType } from "@/lib/types/productType";
import { useState } from "react";
import { categoryType } from "@/lib/types/categoryType";

function TableRows({
  product,
  categoryData = [],
}: {
  product: ProductType;
  categoryData?: categoryType[];
}) {
  const [isSaving, setIsSaving] = useState(false);

  const [editData, setEditData] = useState({
    searchCode: product.searchCode ?? "",
    name: product.name ?? "",
    categoryId: product.categoryId ?? "",
    price: product.price ?? 0,
    discountPrice: product.discountPrice ?? 0,
    taxRate: product.taxRate ?? 0,
    taxType: product.taxType ?? "inclusive",
    stockQty: product.stockQty ?? 0,
    sortOrder: product.sortOrder ?? 0,
  });

  async function handleSave() {
    setIsSaving(true);

    try {
      // ✅ Ensure categoryId is always present (even if empty)
      const payload = {
        ...editData,
        name: editData.name.trim(),
        categoryId: editData.categoryId || product.categoryId || "",
      };

      console.log("🟢 Updating:", product.id, payload);

      const result = await updateProductField(product.id!, payload);

      if (!result.success) {
        alert(result.error || "Failed to update product");
      } else {
        console.log("✅ Product updated:", result);
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      alert("Error saving product changes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <TableRow
      key={product.id}
      className="
        whitespace-nowrap 
        transition 
        rounded-xl 
        text-slate-600
        hover:bg-green-50 
        dark:hover:bg-zinc-100
      "
    >
      {/* 🔹 Search Code */}
      <TableCell>
        <input
          className="border rounded-md px-2 py-1 w-24 text-sm"
          value={editData.searchCode}
          onChange={(e) =>
            setEditData({ ...editData, searchCode: e.target.value })
          }
        />
      </TableCell>

      {/* 🔹 Sort Order */}
      <TableCell>
        <input
          type="number"
          className="border rounded-md px-2 py-1 w-16 text-sm"
          value={editData.sortOrder}
          onChange={(e) =>
            setEditData({ ...editData, sortOrder: Number(e.target.value) })
          }
        />
      </TableCell>

      {/* 🔹 Product Name */}
      <TableCell>
        <input
          className="border rounded-md px-2 py-1 w-48 text-sm"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />
      </TableCell>

      {/* 🔹 Category */}
      <TableCell>
        <select
          className="border rounded-md px-2 py-1 text-sm"
          value={editData.categoryId || product.categoryId || ""}
          onChange={(e) =>
            setEditData({ ...editData, categoryId: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {(categoryData || []).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </TableCell>

      {/* 🔹 Price */}
      <TableCell>
        <input
          type="number"
          className="border rounded-md px-2 py-1 w-20 text-sm"
          value={editData.price}
          onChange={(e) =>
            setEditData({ ...editData, price: Number(e.target.value) })
          }
        />
      </TableCell>

      {/* 🔹 Discount */}
      <TableCell>
        <input
          type="number"
          className="border rounded-md px-2 py-1 w-20 text-sm"
          value={editData.discountPrice}
          onChange={(e) =>
            setEditData({
              ...editData,
              discountPrice: Number(e.target.value),
            })
          }
        />
      </TableCell>

      {/* 🔹 Stock Qty */}
      <TableCell>
        <input
          type="number"
          className="border rounded-md px-2 py-1 w-16 text-sm"
          value={editData.stockQty}
          onChange={(e) =>
            setEditData({ ...editData, stockQty: Number(e.target.value) })
          }
        />
      </TableCell>

      {/* 🔹 Tax */}
      <TableCell>
        <div className="flex flex-col">
          <input
            type="number"
            className="border rounded-md px-2 py-1 w-20 text-sm mb-1"
            value={editData.taxRate}
            onChange={(e) =>
              setEditData({ ...editData, taxRate: Number(e.target.value) })
            }
          />
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={editData.taxType ?? "inclusive"}
            onChange={(e) =>
              setEditData({
                ...editData,
                taxType: e.target.value as "inclusive" | "exclusive",
              })
            }
          >
            <option value="inclusive">Inclusive</option>
            <option value="exclusive">Exclusive</option>
          </select>
        </div>
      </TableCell>

      {/* 🔹 Save Button */}
      <TableCell>
        <Button
          size="sm"
          disabled={isSaving}
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0 transition"
        >
          {isSaving ? "Saving..." : <FaSave size={16} />}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default TableRows;
