<div align="center">
# 🗂️ AssetFlow AI
**An AI-powered asset management platform** — track, allocate, book, and maintain organizational assets from one intelligent dashboard.
</div>

## 📖 About
AssetFlow AI helps organizations track physical and digital assets end-to-end — from registration and booking to maintenance and audit — with AI-assisted insights via a built-in Copilot.
---

## ✨ Features

- 📊 **Dashboard** — real-time overview of assets, activity, and key metrics
- 🗃️ **Asset Directory & Register** — add, browse, and manage assets with digital "asset passports"
- 📅 **Bookings & Allocations** — reserve and assign assets across teams
- 🔧 **Maintenance Tracking** — schedule and log upkeep so nothing falls through the cracks
- 🤖 **AI Copilot** — natural-language assistant for asset queries and insights
- 📈 **Reports & Insights** — visual analytics on usage and utilization
- 🕵️ **Audit Log** — full activity history for accountability
- 🔔 **Notifications** — stay on top of due dates and approvals
- 🏢 **Organization Management** — manage teams, roles, and settings
- 🔐 **Auth** — login / sign-up flows
- 🔍 **Global Search** — find assets, bookings, and records instantly

---

## 🛠️ Tech Stack

| Layer      | Technology                                                  |
|------------|---------------------------------------------------------------|
| Frontend   | React 19, TanStack Start, TanStack Router, TanStack Query     |
| Styling    | Tailwind CSS 4, Radix UI, shadcn-style components              |
| Forms      | React Hook Form + Zod validation                                |
| Charts     | Recharts                                                       |
| Build Tool | Vite 8                                                          |
| Backend    | Node.js + Express *(in progress)*                               |
| Database   | MongoDB Atlas + Mongoose *(in progress)*                        |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm (bundled with Node) — or [Bun](https://bun.sh/), since `bun.lock` is included

```bash
node -v   # confirm v18 or higher
```

### 1. Clone & enter the project
```bash
git clone <repository-url>
cd Website/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the dev server
```bash
npm run dev
```

Vite will print the local URL in your terminal (typically `http://localhost:3000`) — open it in your browser.

> ✅ No environment variables or database setup needed to run the frontend — it works standalone.

### Other useful commands
```bash
npm run build      # production build
npm run preview    # preview the production build
npm run lint        # run ESLint
npm run format      # run Prettier
```

---

## 📁 Project Structure

```
Website/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level views (Dashboard, Bookings, Copilot, etc.)
│   │   ├── routes/        # TanStack Router route definitions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utility functions
│   │   └── data/          # Static/mock data
│   └── public/             # Static assets
└── backend/                 # API + MongoDB layer (in progress)
```

---

## 🗺️ Roadmap

- [x] Frontend UI — dashboard, assets, bookings, maintenance, insights, AI Copilot
- [ ] Backend API (Express + TypeScript)
- [ ] MongoDB Atlas integration
- [ ] Authentication (JWT)
- [ ] Connect frontend to live data

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome — feel free to open a PR or issue.

## 📄 License

MIT — see `LICENSE` for details.

<div align="center">

Built with ❤️ for [Hackathon Name]

</div>
