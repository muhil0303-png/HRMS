import { useLocation } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import './Placeholder.css'

interface PlaceholderProps {
  title?: string
  description?: string
}

function Placeholder({ title }: PlaceholderProps): JSX.Element {
  const location = useLocation()

  const derivedTitle = title ?? deriveTitle(location.pathname)

  return (
    <div className="placeholder-page">
      <Header />
      <main className="placeholder-content" role="main" aria-label={`${derivedTitle} page`}>
        <div className="placeholder-container">
          <div className="placeholder-icon" aria-hidden="true">
            🚧
          </div>
          <h1 className="placeholder-title">{derivedTitle}</h1>
          <p className="placeholder-message">Coming Soon</p>
          <p className="placeholder-description">
            This section is currently under development. Check back later for updates.
          </p>
          <div className="placeholder-divider" />
          <p className="placeholder-note">
            In the meantime, you can navigate to the{' '}
            <a href="/" className="placeholder-link">
              Dashboard
            </a>{' '}
            to view available features.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function deriveTitle(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean).pop()
  if (!segment) {
    return 'Page'
  }
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default Placeholder