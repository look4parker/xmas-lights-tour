import { useEffect, useMemo, useRef } from 'react'
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  APIProvider,
  Circle,
  Map,
  useMap,
} from '@vis.gl/react-google-maps'
import type { House } from '../houses'
import { useGeolocation } from '../hooks/useGeolocation'

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'
const USER_ZOOM = 15
// Keeps pins off the map edge and gives a single house a sensible zoom.
const BOUNDS_MARGIN_DEGREES = 0.005

function getBounds(houses: House[]): google.maps.LatLngBoundsLiteral {
  const lats = houses.map((house) => house.lat)
  const lngs = houses.map((house) => house.lng)
  return {
    north: Math.max(...lats) + BOUNDS_MARGIN_DEGREES,
    south: Math.min(...lats) - BOUNDS_MARGIN_DEGREES,
    east: Math.max(...lngs) + BOUNDS_MARGIN_DEGREES,
    west: Math.min(...lngs) - BOUNDS_MARGIN_DEGREES,
  }
}

interface MapViewProps {
  houses: House[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

function MapView({ houses, selectedId, onSelect }: MapViewProps) {
  const map = useMap()
  const location = useGeolocation()
  const { position, status, message } = location
  const userLatLng = useMemo(() => (position ? { lat: position.lat, lng: position.lng } : null), [position])
  const bounds = useMemo(() => (houses.length > 0 ? getBounds(houses) : undefined), [houses])
  const centeredOnUser = useRef(false)

  // Center once when location starts, then leave the map free to explore.
  useEffect(() => {
    if (!userLatLng) {
      centeredOnUser.current = false
      return
    }
    if (!map || centeredOnUser.current) return
    centeredOnUser.current = true
    map.panTo(userLatLng)
    if ((map.getZoom() ?? 0) < USER_ZOOM) map.setZoom(USER_ZOOM)
  }, [map, userLatLng])

  useEffect(() => {
    const house = houses.find((candidate) => candidate.id === selectedId)
    if (map && house) map.panTo({ lat: house.lat, lng: house.lng })
  }, [map, houses, selectedId])

  function centerOnUser() {
    if (!map || !userLatLng) return
    map.panTo(userLatLng)
    if ((map.getZoom() ?? 0) < USER_ZOOM) map.setZoom(USER_ZOOM)
  }

  return (
    <>
      <div className="map-toolbar">
        {status === 'active' ? (
          <>
            <button type="button" className="button" onClick={centerOnUser}>
              Center on me
            </button>
            {bounds && (
              <button type="button" className="button button-quiet" onClick={() => map?.fitBounds(bounds)}>
                Show all houses
              </button>
            )}
            <button type="button" className="button button-quiet" onClick={location.stop}>
              Stop
            </button>
          </>
        ) : (
          <button type="button" className="button" onClick={location.start} disabled={status === 'locating'}>
            {status === 'locating' ? 'Finding you…' : 'Show my location'}
          </button>
        )}
        <p className="map-status" role="status">
          {message ?? (status === 'active' ? 'Your location stays on your phone.' : '')}
        </p>
      </div>

      <div className="map-frame">
        <Map
          mapId={MAP_ID}
          colorScheme="DARK"
          defaultBounds={bounds}
          defaultCenter={bounds ? undefined : { lat: 39.8283, lng: -98.5795 }}
          defaultZoom={bounds ? undefined : 4}
          mapTypeControl={false}
          streetViewControl={false}
          onClick={() => onSelect(null)}
        >
          {houses.map((house, index) => (
            <AdvancedMarker
              key={house.id}
              position={{ lat: house.lat, lng: house.lng }}
              anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
              title={`Stop ${index + 1}: ${house.name}`}
              zIndex={house.id === selectedId ? 10 : 1}
              onClick={() => onSelect(house.id)}
            >
              <span className={house.id === selectedId ? 'pin pin-selected' : 'pin'}>{index + 1}</span>
            </AdvancedMarker>
          ))}

          {position && userLatLng && (
            <>
              <Circle
                center={userLatLng}
                radius={position.accuracy}
                clickable={false}
                fillColor="#4da3ff"
                fillOpacity={0.15}
                strokeColor="#4da3ff"
                strokeOpacity={0.4}
                strokeWeight={1}
              />
              <AdvancedMarker
                position={userLatLng}
                anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                title="You are here"
                zIndex={20}
              >
                <span className="user-dot" />
              </AdvancedMarker>
            </>
          )}
        </Map>
      </div>
    </>
  )
}

interface HouseMapProps extends MapViewProps {
  apiKey: string
}

export function HouseMap({ apiKey, ...mapViewProps }: HouseMapProps) {
  return (
    <APIProvider apiKey={apiKey}>
      <MapView {...mapViewProps} />
    </APIProvider>
  )
}
