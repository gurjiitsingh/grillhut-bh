import React from "react";
import { formatCurrencyNumber } from "@/utils/formatCurrency";
import { UseSiteContext } from "@/SiteContext/SiteContext";

type TRow = {
  label: string; // month OR date
  orderCount: number;
  totalSales: number; // AFTER discount
  totalSalesBeforeDiscount: number; // BEFORE discount
  totalDiscount: number;
};

type TableRowProps = {
  row: TRow;
};

export default function TableRows({ row }: TableRowProps) {
  const { settings } = UseSiteContext();

  const formattedFinal = formatCurrencyNumber(
    Number(row.totalSales) ?? 0,
    settings.currency as string,
    settings.locale as string
  );

  const formattedBeforeDiscount = formatCurrencyNumber(
    Number(row.totalSalesBeforeDiscount) ?? 0,
    settings.currency as string,
    settings.locale as string
  );

  const formattedDiscount = formatCurrencyNumber(
    Number(row.totalDiscount) ?? 0,
    settings.currency as string,
    settings.locale as string
  );

  return (
    <tr className="hover:bg-gray-50">
      <td className="border px-4 py-2">{row.label}</td>

      <td className="border px-4 py-2">{row.orderCount}</td>

      {/* Final Sales */}
      <td className="border px-4 py-2 font-semibold text-green-600">
        {formattedFinal}
      </td>

      {/* Before Discount */}
      <td className="border px-4 py-2 text-gray-700">
        {formattedBeforeDiscount}
      </td>

      {/* Discount */}
      <td className="border px-4 py-2 text-red-500">
        {formattedDiscount}
      </td>
    </tr>
  );
}