hrms-dashboard/
├── public/
│   └── vite.svg                        # Vite default favicon/logo
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx              # Reusable header with navigation
│   │   │   └── Header.css              # Header styles
│   │   └── Footer/
│   │       ├── Footer.tsx              # Reusable footer component
│   │       └── Footer.css              # Footer styles
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx           # Main dashboard page
│   │   │   └── Dashboard.css           # Dashboard styles
│   │   └── Placeholder/
│   │       ├── Placeholder.tsx         # "Coming Soon" placeholder page
│   │       └── Placeholder.css         # Placeholder styles
│   ├── App.tsx                         # Root component with route definitions
│   ├── App.css                         # App-level layout styles
│   ├── main.tsx                        # Application entry point with BrowserRouter
│   ├── index.css                       # Global styles and CSS custom properties
│   └── vite-env.d.ts                   # Vite client type declarations
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration (app)
├── tsconfig.node.json                  # TypeScript configuration (Vite/Node)
├── vite.config.ts                      # Vite build configuration
└── README.md                           # Project documentation (this file)