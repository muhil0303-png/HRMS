├── .env.example                # Environment variables template
├── README.md                   # Setup and run instructions (this file)
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript compiler configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── main.tsx                # Application entry point
│   ├── App.tsx                 # Root application component
│   ├── index.css               # Global styles and Tailwind directives
│   ├── types/
│   │   └── hrms.ts             # Frozen domain type definitions
│   ├── lib/
│   │   └── utils.ts            # Class merging utility (cn)
│   ├── utils/
│   │   └── formatters.ts       # Currency, percentage, and number formatters
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Card.tsx        # Reusable Card component
│   │   │   ├── ProgressBar.tsx # Reusable Progress Bar component
│   │   │   ├── badge.tsx       # Reusable Badge component
│   │   │   ├── button.tsx      # Reusable Button component
│   │   │   └── input.tsx       # Reusable Input component
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Global navigation header
│   │   │   └── Footer.tsx      # Standardized footer
│   │   └── dashboard/
│   │       ├── KpiCard.tsx     # KPI metric display card
│   │       ├── ChartsSection.tsx # Recharts data visualization
│   │       └── InsightsSection.tsx # AI/Rule-based HR insights
│   └── pages/
│       └── Dashboard.tsx       # Main HRMS Dashboard page