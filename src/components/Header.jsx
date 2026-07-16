import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Employees', to: '/employees' },
  { label: 'Payroll', to: '/payroll' },
  { label: 'Leave', to: '/leave' },
  { label: 'Reports', to: '/reports' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'John Doe submitted a leave request', time: '5m ago', read: false },
  { id: 2, text: 'Payroll processing completed for June', time: '1h ago', read: false },
  { id: 3, text: 'New employee onboarding: Sarah Kim', time: '3h ago', read: true },
  { id: 4, text: 'Performance review cycle starts Monday', time: '1d ago', read: true },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef(null);
  const menuRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleMarkRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
    setNotifOpen(false);
  }

  function toggleNotif() {
    setNotifOpen((prev) => !prev);
    setMenuOpen(false);
  }

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        {/* Branding */}
        <div className="header__brand">
          <span className="header__logo-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="var(--color-primary)" />
              <path d="M7 9h14M7 14h14M7 19h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="header__brand-name">HRMS Portal</span>
        </div>

        {/* Desktop Nav */}
        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.to} className="header__nav-item">
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'header__nav-link header__nav-link--active' : 'header__nav-link'
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Controls */}
        <div className="header__controls">
          {/* Notification Bell */}
          <div className="header__notif-wrapper" ref={notifRef}>
            <button
              className="header__icon-btn"
              onClick={toggleNotif}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={notifOpen}
              aria-haspopup="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="header__notif-badge" aria-hidden="true">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="header__notif-dropdown" role="dialog" aria-label="Notifications panel">
                <div className="header__notif-header">
                  <span className="header__notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="header__notif-mark-all" onClick={handleMarkAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <ul className="header__notif-list" role="list">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`header__notif-item${notif.read ? '' : ' header__notif-item--unread'}`}
                    >
                      <button
                        className="header__notif-item-btn"
                        onClick={() => handleMarkRead(notif.id)}
                        aria-label={notif.read ? notif.text : `Unread: ${notif.text}`}
                      >
                        <span className="header__notif-dot" aria-hidden="true" />
                        <span className="header__notif-content">
                          <span className="header__notif-text">{notif.text}</span>
                          <span className="header__notif-time">{notif.time}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {notifications.length === 0 && (
                  <p className="header__notif-empty">No notifications</p>
                )}
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="header__user" aria-label="Logged in as Alex Morgan">
            <div className="header__avatar" aria-hidden="true">AM</div>
            <span className="header__user-name">Alex Morgan</span>
          </div>

          {/* Hamburger */}
          <div ref={menuRef} className="header__hamburger-wrapper">
            <button
              className="header__hamburger"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <span className={`header__hamburger-icon${menuOpen ? ' header__hamburger-icon--open' : ''}`}>
                <span />
                <span />
                <span />
              </span>
            </button>

            {menuOpen && (
              <nav
                id="mobile-nav"
                className="header__mobile-nav"
                aria-label="Mobile navigation"
              >
                <ul className="header__mobile-nav-list" role="list">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to} className="header__mobile-nav-item">
                      <NavLink
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                          isActive
                            ? 'header__mobile-nav-link header__mobile-nav-link--active'
                            : 'header__mobile-nav-link'
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}