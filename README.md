hrms-dashboard/
├── index.html                   # HTML entry point — mounts #root, sets page title
├── package.json                 # Project metadata, dependencies, and scripts
├── vite.config.js               # Vite configuration (React plugin, dev server, build)
├── README.md                    # This file
└── src/
    ├── main.jsx                 # React DOM entry — renders <App> into #root
    ├── App.jsx                  # Root component — Router, layout shell (Header + Outlet + Footer)
    ├── App.css                  # Global CSS custom properties (design tokens), resets, base styles
    ├── components/
    │   ├── Header.jsx           # Reusable top navigation bar with branding and user avatar
    │   ├── Header.css           # Header-scoped styles
    │   ├── Footer.jsx           # Reusable footer with copyright and metadata
    │   └── Footer.css           # Footer-scoped styles
    └── pages/
        ├── Dashboard.jsx        # Main dashboard page — KPI cards, charts, progress, activity feed
        └── Dashboard.css        # Dashboard-scoped styles