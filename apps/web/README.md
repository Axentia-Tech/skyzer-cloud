# Skyzer Cloud Frontend

Modern Game Hosting Platform Frontend, gebaut mit **Next.js**, **React**, **TypeScript**, **Tailwind CSS** und **Zustand**.

## 🚀 Quick Start

```bash
# Dependencies installieren
pnpm install

# Development Server starten
pnpm dev

# Production Build
pnpm build
pnpm start

# Lint
pnpm lint
```

## 📁 Struktur

```
src/
├── pages/                 # Next.js Pages
│   ├── index.tsx         # Landing Page
│   ├── pricing.tsx       # Pricing Plans
│   ├── dashboard.tsx     # User Dashboard
│   ├── _app.tsx          # App Wrapper
│   └── api/              # API Routes (optional)
├── components/           # React Components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   └── ...
├── store/                # State Management (Zustand)
│   └── auth.ts
├── lib/                  # Utilities
│   └── api.ts            # API Client
├── styles/               # Global Styles
│   └── globals.css
└── public/               # Static Files
```

## 🎨 Design System

### Colors
- **Primary**: `#E11D2B` (Skyzer Red)
- **Dark**: `#0B0B0B`
- **Card**: `#121212`
- **Text**: `#EDEDED`
- **Accent**: `#FF6B6B`

### Typography
- Headings: Bold, Poppins/Inter
- Body: Regular, Poppins/Inter
- Mono: Console/logs

## 🔧 Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📦 Dependencies

- **Next.js** - React Framework
- **Tailwind CSS** - Styling
- **daisyUI** - Component Library
- **Zustand** - State Management
- **SWR** - Data Fetching
- **React Hook Form** - Form Management
- **Axios** - HTTP Client

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov
```

## 📱 Responsive Design

- Mobile first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons and inputs

## 🔗 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing Page |
| `/pricing` | Pricing Plans |
| `/dashboard` | User Dashboard |
| `/auth/login` | Login Page |
| `/auth/register` | Registration Page |

## 🎯 Future Features

- [ ] Auth Pages (Login/Register/Reset)
- [ ] Product Detail Pages
- [ ] Server Management UI
- [ ] Billing & Invoice View
- [ ] Settings Page
- [ ] Dark/Light Mode Toggle
- [ ] i18n Support (EN/DE/FR)

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [daisyUI](https://daisyui.com/)

## 🐛 Troubleshooting

### Port already in use
```bash
# Change port
pnpm dev -- -p 3001
```

### Build fails
```bash
# Clear build cache
rm -rf .next
pnpm build
```

### API not responding
```bash
# Check NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_API_URL

# Ensure API is running
curl http://localhost:3001/api/products
```

## 📝 License

MIT
