'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AuditPage() {
  const { data, isLoading, error } = useSWR('/api/admin/audit', fetcher, { refreshInterval: 30000 });

  if (error) return <p role="alert">İşlem kayıtları yüklenemedi.</p>;
  if (isLoading) return <p>Yükleniyor...</p>;

  return (
    <section aria-labelledby="audit-title">
      <h1 id="audit-title" className="mb-4 text-2xl font-bold">
        İşlem Kayıtları
      </h1>
      <ul className="space-y-2">
        {(data?.items || []).map((item: any) => (
          <li key={item.id} className="rounded border bg-white p-3">
            <p className="font-medium">{item.action}</p>
            <p className="text-sm text-gray-600">Varlık: {item.entity}</p>
            <p className="text-sm text-gray-600">Aktör: {item.actor}</p>
            <time className="text-xs text-gray-500" dateTime={item.at}>
              {new Date(item.at).toLocaleString('tr-TR')}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
