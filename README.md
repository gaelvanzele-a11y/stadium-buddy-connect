# Mijnstadion - Stadium Buddy Connect

A bilingual mobile-first web application for the Mijnstadion hub, connecting the UHasselt community with the Mijnstadion Beringen stadium facilities. Users can book workspaces, shared mobility, carpool, purchase event tickets, participate in energy sharing initiatives, and provide community feedback.

## 📱 Live Deployment

**Production URL:** https://stadium-buddy-connect.lovable.app

## 🛠 Technologies Used

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **UI Components** | shadcn/ui + Radix UI primitives |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM |
| **Icons** | Lucide React |
| **State Management** | React Context + localStorage |
| **Testing** | Vitest + Playwright |
| **Charts** | Recharts |

## 🚀 How to Run the Prototype

### Prerequisites
- Node.js (v18 or later)
- bun package manager

### Local Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# The app will be available at http://localhost:8080
```

### Build for Production
```bash
bun run build
```

### Run Tests
```bash
# Unit tests (Vitest)
bun run test

# E2E tests (Playwright)
npx playwright test
```

## 🔑 Login Credentials for Testers

### Pre-configured Demo Accounts
| Account | Username | Password | Role |
|---------|----------|----------|------|
| **Hub Manager** | `hub manager` or `hubmanager` | `1234` | Administrator |
| **Sample User** | `robyn van rompaey` | `4321` | Standard User |

### Creating New Accounts
Users can register new accounts through the **Sign Up** button on the landing page. New accounts are stored locally in the browser and persist across sessions on the same device.

## ✨ Main Features

### 🏢 Workspace Booking (Werkplekken)
- Browse available rooms (Meeting Room, Workshop, Podcast Studio)
- Book by date and time slot
- Directions from **UHasselt Building D, Diepenbeek** (Agoralaan, 3590)
- Digital QR key generated upon booking confirmation

### 🚗 Parking & Mobility
- **Bike Sharing**: Reserve shared bicycles
- **Car Sharing**: Book electric/shared cars by the hour
- **Carpool**: Offer or request rides to/from the stadium
- 24-hour cancellation policy with €5 late fee

### ⚡ Energy Sharing
- View real-time renewable energy production
- Virtual battery participation and "Sales" revenue tracking
- Energy community dashboard with production insights

### 🎫 Ticket Shop
- Browse upcoming sports events
- Select seats and sections
- View match details (opponents, time, sport type)
- Digital ticket delivery

### 💳 Consumption Card
- Virtual wallet for stadium purchases
- Top-up functionality
- Transaction history with color-coded entries:
  - **Green (+€X)**: Top-ups and credits
  - **Red (-€X)**: Fees, purchases, and penalties
- Late cancellation fee: €5 (charged when cancelling within 24 hours)

### 🗣️ Community Feedback
- Submit concerns across categories: Facilities, Mobility, Energy, Safety
- Vote/like existing concerns
- View community-driven priority rankings

### 🤖 Bilingual Chatbot
- FAQ-style assistance in Dutch and English
- Context-aware responses about stadium services

### 📊 Governance Dashboard (Manager Only)
- KPI monitoring for stakeholders
- User engagement analytics
- Energy production statistics
- Community sentiment tracking

## ⚠️ Known Limitations

| Limitation | Details |
|------------|---------|
| **Authentication** | LocalStorage-based auth with hardcoded demo accounts. Not suitable for production without server-side backend. |
| **Booking Data** | Bookings persist only in browser memory (localStorage). No central database. |
| **Concurrent Users** | Multiple users cannot see each other's bookings in real-time (no sync mechanism). |
| **Payment Processing** | Mock payment flow — no actual financial transactions processed. |
| **QR Codes** | Static QR generation for demonstration; not linked to physical access control systems. |
| **Carpool Matching** | No real-time matching algorithm; rides are stored locally. |
| **Energy Data** | Simulated renewable production data for demonstration purposes. |

## 🎯 Project Context

This is a **prototype/stakeholder demo** built for the Mijnstadion Beringen stadium management to showcase the digital hub concept. The application demonstrates the user experience and feature set intended for the production platform.

### Routing Note
All navigation directions originate from **UHasselt Building D, Diepenbeek** (Agoralaan, 3590) to Mijnstadion Beringen, as per the core use case of connecting university users with stadium facilities.

### Language Support
- **Default**: Dutch (Nederlands)
- **Secondary**: English
- Persistent language preference stored per session

---

*Built with Lovable ❤️*
