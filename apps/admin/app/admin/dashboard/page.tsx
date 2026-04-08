'use client';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const KPI_CARDS = [
  { key: 'dailyRevenue', label: 'Günlük Ciro', unit: '₺', color: 'text-green-600' },
  { key: 'conversionRate', label: 'Dönüşüm Oranı', unit: '%', color: 'text-blue-600' },
  { key: 'pendingOrders', label: 'Bekleyen Sipariş', unit: 'adet', color: 'text-amber-600' },
  { key: 'lowStockItems', label: 'Kritik Stok (<5)', unit: 'SKU', color: 'text-red-600' },
];

export default function Dashboard() {
  const { data, error, isLoading } = useSWR('/api/admin/metrics', fetcher, { refreshInterval: 30000 });

  if (error) return <p role="alert" className="text-red-600">Veri yüklenirken hata oluştu. Lütfen yenileyin.</p>;
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
      </div>
    );
  }

  return (
    <section aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="mb-4 text-2xl font-bold">Yönetim Gösterge Paneli</h1>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.key} className="rounded-lg border bg-white p-4 shadow-sm" role="status" aria-live="polite">
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>
              {data[kpi.key]?.toFixed(2) ?? '0'} {kpi.unit}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">HEART Mutluluk Skoru (CSAT)</h2>
        <div
          className="h-3 w-full rounded-full bg-gray-200"
          role="progressbar"
          aria-valuenow={data?.csat || 0}
          aria-valuemin={0}
          aria-valuemax={5}
        >
          <div className="h-3 rounded-full bg-primary" style={{ width: `${(((data?.csat as number) || 0) / 5) * 100}%` }} />
        </div>
        <p className="mt-1 text-sm text-gray-600">{data?.csat?.toFixed(1) ?? '0'} / 5.0</p>
      </div>
    </section>
  );
}
