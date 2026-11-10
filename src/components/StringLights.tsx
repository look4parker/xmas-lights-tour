const BULB_COUNT = 40

export function StringLights() {
  return (
    <div className="string-lights" aria-hidden="true">
      {Array.from({ length: BULB_COUNT }, (_, index) => (
        <span className="bulb" key={index} />
      ))}
    </div>
  )
}
