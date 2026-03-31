"use client";

import { exportOrdersToCSV } from "@/app/(universal)/action/dbUpdates/dbOperation";
import { useState } from "react";


export default function DownloadOrdersCSV() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setMsg("Preparing orders CSV...");

    try {
      const res = await exportOrdersToCSV();

      if (res.success) {
        setMsg(`✅ Exported ${res.totalOrders} orders`);
      } else {
        setMsg("❌ Export failed");
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Error exporting orders");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Exporting..." : "Download Orders CSV"}
      </button>

      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </div>
  );
}