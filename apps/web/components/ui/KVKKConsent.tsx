export default function KVKKConsent({ onAccept }: { onAccept: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kvkk-title"
      className="fixed bottom-4 left-4 right-4 z-50 rounded border bg-white p-4 shadow-xl md:right-auto md:w-96"
    >
      <h2 id="kvkk-title" className="mb-2 font-bold">
        Veri ve Çerez Tercihleri
      </h2>
      <p className="mb-3 text-sm">
        KVKK ve GDPR kapsamında kişisel verileriniz işlenmektedir. Detaylar için{' '}
        <a href="/privacy" className="underline">
          gizlilik politikası
        </a>
        .
      </p>
      <div className="flex gap-2">
        <button onClick={onAccept} className="rounded bg-primary px-3 py-1.5 text-white">
          Kabul Et
        </button>
        <button onClick={() => (window.location.href = '/preferences')} className="rounded border px-3 py-1.5">
          Tercihleri Yönet
        </button>
      </div>
    </div>
  );
}
