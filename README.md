# AssetPro — AI-Powered Property Management

<div align="center">

![AssetPro Banner](https://img.shields.io/badge/AssetPro-AI%20Property%20Management-6366f1?style=for-the-badge)

**A modern, intelligent platform for real estate investors and property managers.**

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Genkit](https://img.shields.io/badge/Genkit-AI%20Integration-purple)](https://github.com/firebase/genkit)

</div>

---

## Overview

AssetPro is a full-stack, AI-powered real estate and property management platform built to help modern property owners make smarter investment decisions. From managing tenants and leases to generating AI-driven price predictions and portfolio analytics — AssetPro brings everything under one roof.

---

## Features

### 🏠 Property Management
Manage your entire real estate portfolio from a single dashboard. Track properties, handle tenant records, and oversee lease agreements with ease.

### 🤖 AI Assistant
Leverage AI-driven insights powered by Genkit to get accurate price estimations, investment recommendations, and automated support — so you can act on data, not guesswork.

### 📊 Smart Analytics & Reports
Visualize your portfolio's performance with interactive Recharts-powered graphs. Generate comprehensive reports covering income, expenses, occupancy rates, and more.

### ⚡ Dynamic Dashboard
Get an at-a-glance view of your active properties, pending tasks, expense summaries, and key metrics — all updated in real time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Backend & Database** | [Firebase](https://firebase.google.com/) — Firestore & Authentication |
| **AI Integration** | [Genkit](https://github.com/firebase/genkit) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase](https://firebase.google.com/) project with Firestore and Authentication enabled
- A Genkit-compatible AI provider configured (e.g. Google AI / Vertex AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/I-MZN-I/Miza.git
   cd assetpro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory and add your Firebase and AI credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   GOOGLE_GENAI_API_KEY=your_genai_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

```
assetpro/
├── app/                  # Next.js App Router pages & layouts
├── components/           # Reusable UI components
├── lib/                  # Firebase config, utilities, helpers
├── ai/                   # Genkit AI flows and prompts
├── public/               # Static assets
└── ...
```

> Update this section to reflect your actual folder structure.

---

## Roadmap

- [ ] Multi-user roles (Owner, Manager, Tenant)
- [ ] Automated rent collection & payment tracking
- [ ] Maintenance request workflow
- [ ] AI-generated lease drafting
- [ ] Mobile app (React Native)

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change, then submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request


---

<div align="center">
  Built with ❤️ using Next.js, Firebase & Genkit
</div>