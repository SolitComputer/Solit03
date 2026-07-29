// Hitung di posisi mana (setelah artikel ke berapa, 1-indexed) iklan disisipkan.
// Dipisah dari isi iklan itu sendiri supaya pool iklan desktop & mobile bisa
// dipasangkan di slot yang sama meski salah satu pool kosong.
export function getAdSlotPositions(itemCount, interval = 6) {
  const positions = [];
  for (let i = interval; i <= itemCount; i += interval) positions.push(i);
  return positions;
}
