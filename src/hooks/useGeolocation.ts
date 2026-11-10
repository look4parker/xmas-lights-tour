import { useCallback, useEffect, useRef, useState } from 'react'

export interface UserPosition {
  lat: number
  lng: number
  accuracy: number
}

export type LocationStatus = 'idle' | 'locating' | 'active' | 'error'

interface LocationState {
  status: LocationStatus
  position: UserPosition | null
  message: string | null
}

const IDLE: LocationState = { status: 'idle', position: null, message: null }

// The position stays in this hook. It is never stored or sent to a server of ours.
export function useGeolocation() {
  const [state, setState] = useState<LocationState>(IDLE)
  const watchId = useRef<number | null>(null)
  const hasFix = useRef(false)

  const clearWatch = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    hasFix.current = false
  }, [])

  const fail = useCallback(
    (message: string) => {
      clearWatch()
      setState({ status: 'error', position: null, message })
    },
    [clearWatch],
  )

  const start = useCallback(() => {
    if (!window.isSecureContext) {
      fail('Location only works when the site is loaded over https.')
      return
    }
    if (!('geolocation' in navigator)) {
      fail("This browser can't share your location.")
      return
    }

    clearWatch()
    setState({ status: 'locating', position: null, message: null })

    watchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        hasFix.current = true
        setState({
          status: 'active',
          position: { lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy },
          message: null,
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          fail('Location is turned off for this site. You can allow it in your browser settings.')
        } else if (!hasFix.current) {
          fail("We couldn't find your location. Please try again.")
        }
        // A brief signal loss after a fix keeps the last known dot on the map.
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    )
  }, [clearWatch, fail])

  const stop = useCallback(() => {
    clearWatch()
    setState(IDLE)
  }, [clearWatch])

  useEffect(() => clearWatch, [clearWatch])

  return { ...state, start, stop }
}
