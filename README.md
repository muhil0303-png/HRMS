hrms-dashboard/
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration entry
├── tsconfig.app.json             # TypeScript configuration for the app
├── tsconfig.node.json            # TypeScript configuration for Vite/Node
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── index.html                    # HTML entry point
├── README.md                     # Project documentation
└── src/
    ├── types.ts                  # Shared TypeScript interfaces and types
    ├── index.css                 # Global styles and Tailwind directives
    ├── main.tsx                  # Application entry point
    ├── App.tsx                   # Central State Hub and Layout
    ├── mockData.ts               # Initial mock data for seed state
    └── components/
        ├── Modals.tsx            # Modals for Add Employee, Request Leave, Post Job
        ├── EmployeeDirectory.tsx # Employee list, search, filter, and management
        ├── LeaveManagement.tsx   # Leave requests table and approval actions
        └── DashboardCharts.tsx   # SVG-based data visualizations