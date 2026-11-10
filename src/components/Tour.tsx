import { useRef, useState } from 'react'
import { content } from '../content'
import { directionsUrl, houses } from '../houses'
import { HouseMap } from './HouseMap'
import { MapErrorBoundary } from './MapErrorBoundary'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export function Tour() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const mapArea = useRef<HTMLDivElement>(null)

  function selectFromList(id: string) {
    setSelectedId(id)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    mapArea.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' })
  }

  return (
    <section className="section" aria-labelledby="map-heading">
      <h2 id="map-heading">{content.mapHeading}</h2>
      <p className="section-intro">{content.mapIntro}</p>

      <div ref={mapArea}>
        {API_KEY ? (
          <MapErrorBoundary>
            <HouseMap apiKey={API_KEY} houses={houses} selectedId={selectedId} onSelect={setSelectedId} />
          </MapErrorBoundary>
        ) : (
          <div className="placeholder placeholder-map">The map will appear here once a Google Maps API key is added.</div>
        )}
      </div>

      <ol className="stops">
        {houses.map((house, index) => (
          <li key={house.id} className={house.id === selectedId ? 'stop stop-selected' : 'stop'}>
            <button type="button" className="stop-main" onClick={() => selectFromList(house.id)}>
              <span className="pin" aria-hidden="true">
                {index + 1}
              </span>
              <span className="stop-text">
                <span className="stop-name">{house.name}</span>
                <span className="stop-address">{house.address}</span>
                {house.note && <span className="stop-note">{house.note}</span>}
              </span>
            </button>
            <a
              className="text-link stop-directions"
              href={directionsUrl(house)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Directions to ${house.name}`}
            >
              Directions
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
