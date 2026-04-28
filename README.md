# NumeriX — Numerical Analysis Virtual Lab

> Solve, visualize, and master every numerical method. From root-finding races to 3D convergence trajectories — numerical analysis reimagined.

![NumeriX](https://img.shields.io/badge/NumeriX-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)

## ✨ Features

| Feature | Description |
|---|---|
| **Solver Lab** | Step-by-step execution of 9 numerical methods |
| **Race Mode** | Run all root-finding methods simultaneously |
| **3D Visualizer** | Animated convergence trajectories |
| **Error Geometry** | Interactive error visualization lab |
| **Learn Hub** | Per-method deep dives with live sliders |
| **Quiz Mode** | Test your numerical analysis knowledge |
| **Whiteboard** | Freehand drawing for working out problems |
| **Newton Fractals** | Explore fractal basins of attraction |
| **PDF Export** | Generate professional solution sheets |

## 🏗 Architecture

**Frontend-only React application** — no backend server required.

```
numerix/
├── src/                    # React + TypeScript frontend
│   ├── components/         # Reusable UI components
│   │   ├── solver/         # Solver lab components
│   │   ├── learn/          # Learning hub components
│   │   ├── layout/         # Navbar, Footer, PageShell
│   │   └── ui/             # Base UI components
│   ├── pages/              # Route pages
│   │   ├── Landing.tsx     # Home page
│   │   ├── Solver.tsx      # Solver lab
│   │   ├── LearnHub.tsx    # Learning hub
│   │   ├── CompareLab.tsx  # Race mode
│   │   ├── Quiz.tsx        # Quiz mode
│   │   ├── Whiteboard.tsx  # Drawing board
│   │   ├── Developer.tsx   # Developer page
│   │   └── ...
│   ├── lib/                # Utilities & numerical methods
│   │   └── numerical/      # Root-finding, linear algebra
│   └── state/              # App context
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── index.html              # Entry point
└── vite.config.ts          # Vite configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** (comes with Node.js)

### Install & Run

```bash
# Clone repository
git clone https://github.com/your-org/numerix.git
cd numerix

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

Output goes to `dist/` folder.

## 🏭 Production Deployment

### Option 1: Netlify (Recommended)

1. Connect your Git repository at [netlify.com](https://app.netlify.com)
2. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Deploy — automatic deploys on every push

### Option 2: Vercel

1. Import project at [vercel.com](https://vercel.com)
2. Framework preset: `Vite`
3. Deploy — automatic preview deploys for PRs

### Option 3: Cloudflare Pages

1. Connect repository at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Build configuration:
   - **Build command:** `npm run build`
   - **Build output:** `/dist`
3. Deploy

### Option 4: Traditional Hosting

```bash
# Build locally
npm ci
npm run build

# Upload dist/ folder contents to your web server
# Ensure server is configured for SPAs (serve index.html for all routes)
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name numerix.example.com;
    root /var/www/numerix/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📦 Project Structure

### Key Files
| File | Purpose |
|---|---|
| `vite.config.ts` | Vite build configuration, path aliases |
| `tailwind.config.ts` | Tailwind CSS theme customization |
| `tsconfig.json` | TypeScript compiler options |
| `package.json` | Dependencies and scripts |

### Available Scripts

```bash
npm run dev          # Development server (port 8080)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
npm test             # Run tests
```

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint
```

## � Customization

### Adding New Methods

Edit `src/lib/numerical/methods.ts` to add new numerical methods to the solver.

### Theming

Colors are defined in `tailwind.config.ts` and `src/index.css`.

### SEO

Update meta tags in `index.html` for your deployment.

## 📝 Notes

- **No backend required** — All computation runs client-side
- **No database** — State is managed in React context
- **No environment variables required** — Pure static frontend
- **SPA routing** — Configure your host to serve `index.html` for all routes

## 📄 License

MIT © NumeriX Team
