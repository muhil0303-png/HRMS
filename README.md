hrms-dashboard/
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript project configuration
├── tsconfig.app.json            # TypeScript configuration for application code
├── tsconfig.node.json           # TypeScript configuration for Vite/Node environment
├── vite.config.ts               # Vite configuration with React plugin
├── tailwind.config.js           # Tailwind CSS theme and color extensions
├── postcss.config.js            # PostCSS configuration for Tailwind processing
├── index.html                   # Application entry point HTML
└── src/
    ├── main.tsx                 # React application bootstrapper
    ├── index.css                # Global styles, scrollbars, and Tailwind directives
    ├── types.ts                 # Shared TypeScript interfaces and type definitions
    ├── App.tsx                  # Main layout, state management, and orchestration
    └── components/
        ├── Sidebar.tsx          # Collapsible navigation sidebar
        ├── Header.tsx           # Top navigation bar with user profile and search
        ├── StatCard.tsx         # Individual metric display card
        ├── LeaveRequests.tsx    # Leave request approval queue
        ├── EmployeeList.tsx     # Searchable, filterable employee directory & modal
        └── RecentActivity.tsx   # Chronological HR audit log