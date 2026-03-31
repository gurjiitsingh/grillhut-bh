'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp
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
  CartesianGrid
} from 'recharts';
import TableRows from './TableRows';

// ---------------- DATE PARSER ----------------
function getCreatedAtDate(value: any): Date | null {
  if (!value) return null;

  if (value instanceof Timestamp) return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  if (typeof value === 'number') return new Date(value);

  return null;
}

// ---------------- TYPE ----------------
type MonthlySales = {
  month: string;
  totalSales: number; // AFTER discount
  totalSalesBeforeDiscount: number; // BEFORE discount
  totalDiscount: number;
  orderCount: number;
};

// ---------------- COMPONENT ----------------
export default function MonthlySalesTable() {
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  const fetchMonthlySales = async () => {
    try {
      const ref = collection(db, 'orderMaster');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const salesMap: Record<string, MonthlySales> = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as orderMasterDataT;
        const createdAt = getCreatedAtDate(data.createdAt);

        if (!createdAt || data.orderStatus !== 'COMPLETED') return;

        const discount = data.discountTotal || 0;

        // ✅ IMPORTANT FIX (correct math)
        const saleAfterDiscount = data.grandTotal || 0; // final
        const saleBeforeDiscount = saleAfterDiscount + discount;

        const monthKey = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        if (!salesMap[monthKey]) {
          salesMap[monthKey] = {
            month: monthKey,
            totalSales: 0,
            totalSalesBeforeDiscount: 0,
            totalDiscount: 0,
            orderCount: 0,
          };
        }

        salesMap[monthKey].totalSales += saleAfterDiscount;
        salesMap[monthKey].totalSalesBeforeDiscount += saleBeforeDiscount;
        salesMap[monthKey].totalDiscount += discount;
        salesMap[monthKey].orderCount += 1;
      });

      const sorted = Object.values(salesMap).sort((a, b) =>
        a.month < b.month ? 1 : -1
      );

      setMonthlySales(sorted);
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Monthly Sales Summary</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Chart (Final Sales only) */}
          <div className="w-full h-80 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSales" fill="#4CAF50" name="Final Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Month</th>
                <th className="border px-4 py-2 text-left">Orders</th>
                <th className="border px-4 py-2 text-left">Sales (Final)</th>
                <th className="border px-4 py-2 text-left">Sales (Before Discount)</th>
                <th className="border px-4 py-2 text-left">Discount</th>
              </tr>
            </thead>
            <tbody>
              {monthlySales.map((row, i) => (
                <TableRows
                  key={i}
                  row={{
                    label: row.month,
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