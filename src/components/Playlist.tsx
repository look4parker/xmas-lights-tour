import { content } from '../content'

export function Playlist() {
  const id = content.spotifyPlaylistId

  return (
    <section className="section" aria-labelledby="playlist-heading">
      <h2 id="playlist-heading">{content.playlistHeading}</h2>
      <p className="section-intro">{content.playlistIntro}</p>

      {id ? (
        <>
          <iframe
            className="playlist-embed"
            title="Spotify playlist"
            src={`https://open.spotify.com/embed/playlist/${id}?theme=0`}
            height="352"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
          <a className="text-link" href={`https://open.spotify.com/playlist/${id}`} target="_blank" rel="noreferrer">
            Open in Spotify
          </a>
        </>
      ) : (
        <div className="placeholder">The playlist will appear here once its ID is added.</div>
      )}
    </section>
  )
}
