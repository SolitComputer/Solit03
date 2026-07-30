/**
 * Helper untuk mengecek apakah tanggal pembuatan produk/item masih dalam rentang X hari (default: 3 hari).
 * Tag "NEW" / "BARU" akan otomatis bernilai false (hilang sendiri) setelah 3 hari.
 * 
 * @param {string|Date|number} dateInput - Tanggal buat item / produk
 * @param {number} daysThreshold - Jumlah hari batas (default 3 hari)
 * @returns {boolean}
 */
export const isNewProduct = (dateInput, daysThreshold = 30) => {
  if (!dateInput) return false;
  const createdDate = new Date(dateInput).getTime();
  if (isNaN(createdDate)) return false;
  const now = Date.now();
  const diffInMs = now - createdDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays >= 0 && diffInDays <= daysThreshold;
};
