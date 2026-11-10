import { Component, type ReactNode } from 'react'

declare global {
  interface Window {
    gm_authFailure?: () => void
  }
}

interface Props {
  children: ReactNode
}

// A map problem, such as a rejected API key, should not take down the greeting, stops or playlist.
export class MapErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  handleAuthFailure = () => this.setState({ failed: true })

  componentDidMount() {
    // Google calls this global when it rejects the API key.
    window.gm_authFailure = this.handleAuthFailure
  }

  componentWillUnmount() {
    delete window.gm_authFailure
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="placeholder placeholder-map">
          The map couldn't load right now. The directions links below still work.
        </div>
      )
    }
    return this.props.children
  }
}
