export function checkCapacity(vehicleLength: number, racks: any) {
  let usedMeters = 0;
  let hasWindows = false;
  let emptyCount = 0;

  for (const rack of racks) {
    if (rack.status === 'W_TRASIE_PELNY') {
      usedMeters += rack.lengthFull; 
      hasWindows = true;
    } else {
      emptyCount++;
    }
  }

  // Puste stojaki wchodzą jeden w drugi
  if (emptyCount > 0) {
    usedMeters += 1.2 + (emptyCount - 1) * 0.2;
  }

  const freeSpace = vehicleLength - usedMeters;

  // Twoja zasada: Jak szkło, to 2x bufor
  if (hasWindows && freeSpace < 2.4) { 
      return { allowed: false, reason: "Za mało miejsca (wymagany bufor bezpieczeństwa)" };
  }

  if (freeSpace < 1.2) return { allowed: false, reason: "Brak miejsca na aucie" };

  return { allowed: true };
}