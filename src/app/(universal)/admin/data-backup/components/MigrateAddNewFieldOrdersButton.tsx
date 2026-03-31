"use client";


import { migrateOrderMaster2 } from "@/app/(universal)/action/dbUpdates/dbOperation";
import { useState } from "react";


export default function MigrateAddNewFieldOrdersButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleMigration = async () => {
    setLoading(true);
    setMsg("Running migration...");

    try {
      const res = await migrateOrderMaster2();

      if (res.migrated > 0) {
        setMsg(`✅ Migrated ${res.migrated} orders`);
      } else {
        setMsg(res.message || "Nothing migrated");
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Migration failed");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleMigration}
        disabled={loading}
        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
      >
        {loading ? "Migrating..." : "Run Order Migration"}
      </button>

      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </div>
  );
}