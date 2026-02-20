export const formatPrice = (price: number): string => {
  if (price >= 1_000_000)
    return `Rp ${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}Jt`;
  if (price >= 1_000) return `Rp ${Math.round(price / 1_000)}K`;
  return `Rp ${price}`;
};

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }) + " WIB";

  
export const fullFormatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);