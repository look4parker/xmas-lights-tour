import housesJson from './data/houses.json'

export interface House {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  note?: string
}

// The annotation makes `npm run build` fail on a malformed entry instead of deploying a broken map.
export const houses: House[] = housesJson

export function directionsUrl(house: House): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(house.address)}`
}
