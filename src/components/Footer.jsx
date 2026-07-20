import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const QUICK_LINKS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Employees', to: '/employees' },
  { label: 'Payroll', to: '/payroll' },
  { label: 'Leave', to: '/leave' },
  { label: 'Reports', to: '/reports' },
];

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo" aria-label="HRMS Portal">
            <svg
              className="footer__logo-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.85" />
              <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.55" />
              <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.55" />
              <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.85" />
            </svg>
            HRMS Portal
          </span>
          <p className="footer__tagline">
            Empowering HR teams with real-time workforce insights.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer quick links">
          <ul className="footer__links" role="list">
            {QUICK_LINKS.map((link) => (
              <li key={link.to} className="footer__link-item">
                <Link to={link.to} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__contact">
          <p className="footer__contact-heading">Support</p>
          <a
            href="mailto:hr-support@company.com"
            className="footer__contact-link"
            aria-label="Email HR support"
          >
            hr-support@company.com
          </a>
          <a
            href="tel:+18005550100"
            className="footer__contact-link"
            aria-label="Call HR support"
          >
            +1 (800) 555-0100
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {CURRENT_YEAR} Acme Corporation. All rights reserved.
        </p>
        <div className="footer__legal-links">
          <a href="#privacy" className="footer__legal-link">Privacy Policy</a>
          <span className="footer__legal-sep" aria-hidden="true">·</span>
          <a href="#terms" className="footer__legal-link">Terms of Use</a>
          <span className="footer__legal-sep" aria-hidden="true">·</span>
          <a href="#accessibility" className="footer__legal-link">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;