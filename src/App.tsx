import { Intro } from './components/Intro'
import { Playlist } from './components/Playlist'
import { StringLights } from './components/StringLights'
import { Tour } from './components/Tour'
import { content } from './content'

export default function App() {
  return (
    <>
      <StringLights />
      <main className="page">
        <Intro />
        <Tour />
        <Playlist />
        <footer className="sign-off">{content.signOff}</footer>
      </main>
    </>
  )
}
