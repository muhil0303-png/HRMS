import { Link } from 'react-router-dom';
import './Footer.css';

interface FooterLink {
  label: string;
  path: string;
}

const quickLinks: FooterLink[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Employees', path: '/employees' },
  { label: 'Departments', path: '/departments' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
];

const supportLinks: FooterLink[] = [
  { label: 'Help Center', path: '/help' },
  { label: 'Contact Support', path: '/support' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
];

function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-content">
        <div className="footer-section footer-branding">
          <h3 className="footer-logo">HRMS</h3>
          <p className="footer-description">
            Human Resource Management System — streamlining workforce management
            with modern tools for employee tracking, department oversight, and
            organizational reporting.
          </p>
        </div>

        <div className="footer-section footer-quick-links">
          <h4 className="footer-section-title">Quick Links</h4>
          <nav aria-label="Footer quick links">
            <ul className="footer-link-list">
              {quickLinks.map((link) => (
                <li key={link.path} className="footer-link-item">
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-section footer-support">
          <h4 className="footer-section-title">Support</h4>
          <nav aria-label="Footer support links">
            <ul className="footer-link-list">
              {supportLinks.map((link) => (
                <li key={link.path} className="footer-link-item">
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-section footer-contact">
          <h4 className="footer-section-title">Contact</h4>
          <address className="footer-address">
            <p className="footer-contact-item">
              <span className="footer-contact-label">Email:</span>
              <a
                href="mailto:support@hrms.com"
                className="footer-link"
                aria-label="Send email to support"
              >
                support@hrms.com
              </a>
            </p>
            <p className="footer-contact-item">
              <span className="footer-contact-label">Phone:</span>
              <a
                href="tel:+18005551234"
                className="footer-link"
                aria-label="Call support"
              >
                +1 (800) 555-1234
              </a>
            </p>
            <p className="footer-contact-item">
              <span className="footer-contact-label">Hours:</span>
              <span>Mon–Fri, 9:00 AM – 6:00 PM EST</span>
            </p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; {currentYear} HRMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;