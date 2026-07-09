import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Employees', path: '/employees' },
  { label: 'Departments', path: '/departments' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
];

function Header(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = useCallback((): void => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback((): void => {
    setMenuOpen(false);
  }, []);

  return (
    <header className="header" role="banner">
      <div className="header__container">
        <div className="header__brand">
          <NavLink to="/" className="header__logo-link" onClick={closeMenu} aria-label="HRMS Home">
            <span className="header__logo-icon" aria-hidden="true">
              &#9670;
            </span>
            <span className="header__app-name">HRMS</span>
          </NavLink>
        </div>

        <button
          className={`header__hamburger ${menuOpen ? 'header__hamburger--active' : ''}`}
          type="button"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="header-nav"
        >
          <span className="header__hamburger-line" />
          <span className="header__hamburger-line" />
          <span className="header__hamburger-line" />
        </button>

        <nav
          id="header-nav"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="header__nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="header__nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }): string =>
                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                  }
                  onClick={closeMenu}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {menuOpen && (
          <div
            className="header__overlay"
            onClick={closeMenu}
            onKeyDown={(e): void => {
              if (e.key === 'Enter' || e.key === ' ') {
                closeMenu();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close navigation menu"
          />
        )}
      </div>
    </header>
  );
}

export default Header;