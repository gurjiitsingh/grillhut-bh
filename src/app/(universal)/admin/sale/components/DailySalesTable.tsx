'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { orderMasterDataT } from '@/lib/types/orderMasterType';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import TableRows from './TableRows';

type DailySales = {
  date: string;
  totalSales: number;          // AFTER discount (final)
  totalSalesBeforeDiscount: number; // BEFORE discount
  totalDiscount: number;       // total discount
  orderCount: number;
};

function getCreatedAtDate(value: any): Date | null {
  if (!value) return null;

  // Firestore Timestamp
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  // Firestore serialized timestamp (rare case)
  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  // Long / number (from POS)
  if (typeof value === 'number') {
    return new Date(value);
  }

  return null;
}


export default function DailySalesTable() {
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailySales();
  }, []);

  const fetchDailySales = async () => {
    try {
      const ref = collection(db, 'orderMaster');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const salesMap: Record<string, DailySales> = {};

     snapshot.docs.forEach((doc) => {
  const data = doc.data() as orderMasterDataT;
  const createdAt = getCreatedAtDate(data.createdAt);

  if (!createdAt || data.orderStatus !== 'COMPLETED') return;

  const discount = data.discountTotal || 0;

  const saleWithDiscount = data.grandTotal || 0; // final paid
  const saleWithoutDiscount = saleWithDiscount + discount; // original price

  const dateKey = `${createdAt.getFullYear()}-${String(
    createdAt.getMonth() + 1
  ).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')}`;

  if (!salesMap[dateKey]) {
    salesMap[dateKey] = {
      date: dateKey,
      totalSales: 0,
      totalSalesBeforeDiscount: 0,
      totalDiscount: 0,
      orderCount: 0,
    };
  }

  salesMap[dateKey].totalSales += saleWithDiscount;
  salesMap[dateKey].totalSalesBeforeDiscount += saleWithoutDiscount;
  salesMap[dateKey].totalDiscount += discount;
  salesMap[dateKey].orderCount += 1;
});

      const sorted = Object.values(salesMap).sort((a, b) =>
        a.date < b.date ? 1 : -1
      );

      setDailySales(sorted);
    } catch (error) {
      console.error('Error fetching daily sales:', error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Daily Sales Summary</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Chart */}
          <div className="w-full h-80 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSales" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
  <tr>
    <th className="border px-4 py-2 text-left">Date</th>
    <th className="border px-4 py-2 text-left">Orders</th>
    <th className="border px-4 py-2 text-left">Sales (Final)</th>
    <th className="border px-4 py-2 text-left">Sales (Before Discount)</th>
    <th className="border px-4 py-2 text-left">Total Discount</th>
  </tr>
</thead>
            <tbody>
             {dailySales.map((row, i) => (
 <TableRows
  key={i}
  row={{
    label: row.date,
    orderCount: row.orderCount,
    totalSales: row.totalSales,
    totalSalesBeforeDiscount: row.totalSalesBeforeDiscount,
    totalDiscount: row.totalDiscount,
  }}
/>
))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
