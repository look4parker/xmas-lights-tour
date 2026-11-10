import { content } from '../content'

export function Intro() {
  return (
    <header className="intro">
      <p className="kicker">{content.kicker}</p>
      <h1>{content.title}</h1>
      {content.greeting.map((paragraph) => (
        <p className="greeting" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </header>
  )
}
