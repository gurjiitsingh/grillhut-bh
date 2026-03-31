"use server";

import { adminDb } from "@/lib/firebaseAdmin";



import { fetchCategories } from "@/app/(universal)/action/category/dbOperations";

export async function updateAllProductsWithCategoryName() {
  try {
    console.log("🔹 Fetching categories...");
    const categories = await fetchCategories();

    // Convert category list to a Map for faster lookup
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    console.log("🔹 Fetching all products...");
    const productsSnapshot = await adminDb.collection("products").get();

    if (productsSnapshot.empty) {
      console.log("⚠️ No products found in the database.");
      return { updated: 0, skipped: 0, message: "No products to update." };
    }

    let updatedCount = 0;
    let skippedCount = 0;

    const batch = adminDb.batch();

    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      const categoryId = data.categoryId;

      if (!categoryId || !categoryMap.has(categoryId)) {
        skippedCount++;
        return;
      }

      const categoryName = categoryMap.get(categoryId);

      // Only update if different or missing
      if (data.productCat !== categoryName) {
        const productRef = adminDb.collection("products").doc(doc.id);
        batch.update(productRef, {
          productCat: categoryName,
          updatedAt: new Date().toISOString(),
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    });

    // Commit all batched updates
    if (updatedCount > 0) {
      await batch.commit();
    }

    console.log(` Updated ${updatedCount} products. Skipped ${skippedCount}.`);

    return {
      updated: updatedCount,
      skipped: skippedCount,
      message: `Updated ${updatedCount} products successfully.`,
    };
  } catch (error) {
    console.error("❌ Failed to update product categories:", error);
    return { updated: 0, skipped: 0, message: "Error updating products" };
  }
}


import admin from "firebase-admin";

export async function migrateOrderMasterCreatedAt() {
  try {
    console.log("🔹 Fetching orders from orderMaster...");

    const snapshot = await adminDb.collection("orderMaster").get();

    if (snapshot.empty) {
      console.log("⚠️ No orders found.");
      return { migrated: 0, message: "No orders found." };
    }

    let migratedCount = 0;
    let batch = adminDb.batch();
    let batchCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      let createdAt = data.createdAt;

      // -------------------------------------------------
      // Convert createdAt if stored as number (Long)
      // -------------------------------------------------
      if (typeof createdAt === "number") {
        createdAt = admin.firestore.Timestamp.fromMillis(createdAt);
      }

      // If missing createdAt
      if (!createdAt) {
        createdAt = admin.firestore.FieldValue.serverTimestamp();
      }

      const newData = {
        ...data,
        createdAt: createdAt,
      };

      const newRef = adminDb.collection("backUporderMaster").doc(doc.id);

      batch.set(newRef, newData);

      migratedCount++;
      batchCount++;

      // -------------------------------------------------
      // Firestore batch limit protection
      // -------------------------------------------------
      if (batchCount === 400) {
        await batch.commit();
        console.log(`✅ Migrated ${migratedCount} orders...`);

        batch = adminDb.batch();
        batchCount = 0;
      }
    }

    // commit remaining
    if (batchCount > 0) {
      await batch.commit();
    }

    console.log(`🎉 Migration complete: ${migratedCount} orders migrated.`);

    return {
      migrated: migratedCount,
      message: `Migrated ${migratedCount} orders successfully.`,
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    return {
      migrated: 0,
      message: "Migration failed",
    };
  }
}









import fs from "fs";
import path from "path";

export async function exportOrdersToCSV() {
  try {
    console.log("🔹 Fetching orders from Firestore...");

    const snapshot = await adminDb.collection("orderMaster").get();

    if (snapshot.empty) {
      return {
        success: false,
        message: "No orders found",
      };
    }

    const orders: any[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : "";

      orders.push({
        id: doc.id,
        srno: data.srno || "",
        customerName: data.customerName || "",
        customerPhone: data.customerPhone || "",
        orderType: data.orderType || "",
        paymentMethod: data.paymentMethod || "",
        itemTotal: data.itemTotal || 0,
        taxTotal: data.taxTotal || 0,
        discountTotal: data.discountTotal || 0,
        grandTotal: data.grandTotal || 0,
        createdAt,
      });
    });

    // ---------------------------
    // CSV HEADER
    // ---------------------------
    const headers = [
      "id",
      "srno",
      "customerName",
      "customerPhone",
      "orderType",
      "paymentMethod",
      "itemTotal",
      "taxTotal",
      "discountTotal",
      "grandTotal",
      "createdAt",
    ];

    const csvRows = [];

    csvRows.push(headers.join(","));

    for (const order of orders) {
      const row = headers.map((header) => {
        const value = order[header] ?? "";
        return `"${String(value).replace(/"/g, '""')}"`;
      });

      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");

    // ---------------------------
    // SAVE FILE
    // ---------------------------
    const fileName = `orders-${Date.now()}.csv`;
    const exportDir = path.join(process.cwd(), "exports");

    fs.mkdirSync(exportDir, { recursive: true });

    const filePath = path.join(exportDir, fileName);

    fs.writeFileSync(filePath, csvContent);

    console.log("✅ CSV Export Complete:", filePath);

    return {
      success: true,
      filePath,
      totalOrders: orders.length,
    };
  } catch (error) {
    console.error("❌ Export failed:", error);

    return {
      success: false,
      message: "Export failed",
    };
  }
}




export async function migrateOrderMaster2() {
  try {
    console.log("🔹 Fetching orderMaster1...");

    const snapshot = await adminDb.collection("orderMaster1").get();

    if (snapshot.empty) {
      return { migrated: 0, skipped: 0, message: "No orders found" };
    }

    let migrated = 0;
    let skipped = 0;
    let batch = adminDb.batch();
    let batchCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Skip if already migrated
      if (data.orderDate) {
        skipped++;
        continue;
      }

      const createdAt = data.createdAt;

      if (!createdAt) {
        skipped++;
        continue;
      }

      // Convert Timestamp → JS Date
      const dateUTC = createdAt.toDate();

      // Convert to Indian time
      const indiaDate = new Date(
        dateUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const createdAtMillis = indiaDate.getTime();

      const year = indiaDate.getFullYear();
      const month = String(indiaDate.getMonth() + 1).padStart(2, "0");
      const day = String(indiaDate.getDate()).padStart(2, "0");

      const orderDate = `${year}-${month}-${day}`;
      const orderMonth = `${year}-${month}`;
      const orderYear = year;

      const newData = {
        ...data,
        createdAtMillis,
        orderDate,
        orderMonth,
        orderYear,
      };

      const ref = adminDb.collection("orderMaster3").doc(doc.id);

      batch.set(ref, newData);

      batchCount++;
      migrated++;

      // Firestore batch limit safety
      if (batchCount === 400) {
        await batch.commit();
        batch = adminDb.batch();
        batchCount = 0;

        console.log(`Migrated ${migrated} orders...`);
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    console.log(`✅ Migration complete`);

    return {
      migrated,
      skipped,
      message: `Migrated ${migrated}, skipped ${skipped}`,
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);

    return {
      migrated: 0,
      skipped: 0,
      message: "Migration failed",
    };
  }
}