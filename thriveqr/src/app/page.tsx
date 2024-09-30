'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface QRCode {
  id: string;
  // Add other fields from your t_qrcodes table
}

function QRCodeContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('i');
  const [qrCode, setQRCode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/qrcode?i=${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch QR code');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          if (data.url) {
            // Redirect to the URL if it exists
            window.location.href = data.url;
          } else {
            setQRCode(data);
            setError(null);
          }
        })
        .catch(err => {
          console.error('Error fetching QR code:', err);
          setError('Failed to load QR code data');
          setQRCode(null);
          window.location.href = 'https://app.sparkthrive.com/feed'
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {qrCode && (
        <div>
          <h1 className="text-2xl font-bold mb-4">QR Code Details</h1>
          <p>ID: {qrCode.id}</p>
          {/* Add more fields from your QR code data */}
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<p>Loading...</p>}>
        <QRCodeContent />
      </Suspense>
    </div>
  );
}
