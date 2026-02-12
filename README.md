# Plaude Poll 📊

![Plaude Poll Banner](public/logo.png)

> **The Intelligent, Modern Polling Platform.**
> Create, Share, and Analyze polls with the power of AI.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/D0nG4667/online-poll-system-frontend)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)

---

## 📖 Overview

**Plaude Poll** is a robust polling application re-imagined for the modern web. It combines a seamless user experience with powerful backend analytics and AI integrations. Whether you're gathering customer feedback, conducting market research, or making team decisions, Plaude Poll makes data collection effortless.

## ✨ Key Features

-   **📝 Smart Poll Creation**: Intuitive interface for building complex polls with varied question types.
-   **🤖 AI-Powered Insights**: Chat with your data! Use our AI integration to generate summaries and ask questions about your poll results.
-   **🚀 Easy Distribution**:
    -   **SEO-Friendly Slugs**: Shareable, readable links (e.g., `/polls/team-lunch-preferences`).
    -   **QR Codes**: Instant QR generation for physical sharing.
    -   **Social Integration**: One-click sharing to major platforms.
-   **📈 Real-time Analytics**:
    -   Interactive dashboards.
    -   Response rate tracking.
    -   "Top Polls" leaderboard.
-   **🔒 Secure & Robust**:
    -   CSRF protection.
    -   Role-based authentication (Creator vs. Voter).
    -   Pagination support for large datasets.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
-   **State Management**: Redux Toolkit Query (RTK Query)
-   **Icons**: Lucide React

### Backend (Separate Repo)
-   **Framework**: Django REST Framework
-   **Database**: PostgreSQL
-   **Authentication**: Django Allauth / JWT
-   **AI Service**: Integration with LLM providers

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   pnpm (Package Manager)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/D0nG4667/online-poll-system-frontend.git
    cd online-poll-system-frontend
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:
    ```env
    BACKEND_URL=http://localhost:8000
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Run the development server**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Protected Creator Dashboard
│   ├── polls/           # Public Poll Voting Pages
│   └── layout.tsx       # Root Layout
├── components/          # Reusable UI Components
│   ├── ai/              # AI-specific components (Insights, Prompts)
│   ├── analytics/       # Charts and Data Tables
│   ├── polls/           # Poll Management & Display
│   └── ui/              # Base UI primitives (Buttons, Cards, etc.)
├── services/            # API Service Definitions (RTK Query)
├── lib/                 # Utilities (CSRF, formatting, validation)
└── types/               # TypeScript Interfaces
```

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

**Git Flow**:
-   `main`: Production-ready code.
-   `develop`: Integration branch.
-   `feature/*`: New features.

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**.

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License - see the [LICENSE](LICENSE) file for details.

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.

For more details, see the [LICENSE](LICENSE) file.

### **📩 Commercial Inquiries**

For commercial licensing, custom implementations, or collaboration opportunities, please contact the author.

<br>
<hr>
<p align="center">
  <b>Made with ❤️ by <a href="https://linkedin.com/in/dr-gabriel-okundaye" target="_blank">Gabriel Okundaye, Plaude Poll Team</a></b>
  <br>
  🌐 <a href="https://gabcares.xyz" target="_blank">gabcares.xyz</a> &nbsp;|&nbsp; 🐙 <a href="https://github.com/D0nG4667" target="_blank">GitHub</a>
</p>
