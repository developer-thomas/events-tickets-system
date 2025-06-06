export function estimateTravelTime(distanceKm: number, speedKmH: number = 50): string {
    if (!distanceKm || distanceKm <= 0) return '0min';
  
    const timeInHours = distanceKm / speedKmH;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
  
    if (hours === 0) return `${minutes}min`;

    return `${hours}h ${minutes}min`;
}