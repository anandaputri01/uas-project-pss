export function getPublicUrl() {
  return localStorage.getItem('helmet_public_url') || '';
}

export function setPublicUrl(url) {
  localStorage.setItem('helmet_public_url', url);
}

export function generatePublicLink() {
  const customUrl = getPublicUrl();
  if (customUrl) {
    const url = `${customUrl}/?mode=guest`;
    navigator.clipboard.writeText(url);
    alert(`Link ONLINE (Paket Data) berhasil disalin!\n\n${url}\n\nSiap dibagikan ke pelanggan.`);
    return;
  }

  const origin = window.location.origin;
  if (origin.includes('netlify.app')) {
    const url = `${origin}/?mode=guest`;
    navigator.clipboard.writeText(url);
    alert(`Link ONLINE (Netlify) berhasil disalin!\n\n${url}\n\nSiap dibagikan ke pelanggan.`);
    return;
  }

  const port = window.location.port || '5173';
  const ipAddress = '192.168.1.12';
  const publicUrl = `http://${ipAddress}:${port}/?mode=guest`;
  navigator.clipboard.writeText(publicUrl);
  alert(`Link LOKAL (WiFi) berhasil disalin!\n\n${publicUrl}\n\n(Hanya bisa dibuka jika satu WiFi). Untuk akses Paket Data, isi 'Konfigurasi Akses Publik' di bawah.`);
}
