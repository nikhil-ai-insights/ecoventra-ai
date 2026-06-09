<div align="center">

# 🌍 Contributing to Ecoventra

**Sustainability is a collective effort — and so is building Ecoventra.**

Whether you're fixing a bug, improving docs, or building something new,
your contribution helps move us closer to a greener future. Thank you. 🙏

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Ways to Contribute](#-ways-to-contribute)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Branch Naming](#-branch-naming-convention)
- [Commit Messages](#-commit-message-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)
- [Coding Standards](#-coding-standards)
- [Security](#-security)
- [Recognition](#-recognition)

---

## 🤝 Code of Conduct

By participating, you agree to:

- Be respectful and inclusive
- Welcome diverse perspectives
- Provide constructive feedback
- Focus on improving the project
- Maintain a positive environment

> Harassment, discrimination, or inappropriate behavior will not be tolerated.

---

## 💡 Ways to Contribute

| Type | Examples |
|------|----------|
| 🐛 **Bug Fixes** | Resolve issues, fix UI inconsistencies, improve performance |
| ✨ **Features** | Sustainability tools, AI capabilities, dashboard improvements |
| 📚 **Documentation** | README updates, tutorials, setup guides, API docs |
| 🎨 **UI/UX** | Accessibility, mobile responsiveness, UX optimization |
| 🧪 **Testing** | Unit, integration, and manual testing |

---

## ⚙️ Development Setup

### 1. Fork & Clone

Click **Fork** on GitHub, then:

```bash
git clone https://github.com/YOUR_USERNAME/ecoventra.git
cd ecoventra
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start the Dev Server

```bash
npm run dev
```

App will be live at **`http://localhost:5173`** 🚀

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Route-level page components
├── services/         # API & Firebase service layers
├── hooks/            # Custom React hooks
├── context/          # Global state / React context
├── utils/            # Helper functions
├── types/            # TypeScript type definitions
├── assets/           # Images, icons, static files
├── routes/           # App routing configuration
└── App.tsx           # Root component
```

---

## 🌿 Branch Naming Convention

Use clear, descriptive branch names:

```
feature/carbon-dashboard
feature/gemini-chat
feature/bill-analyzer

bugfix/login-validation
bugfix/mobile-navbar

docs/readme-update
```

---

## ✍️ Commit Message Guidelines

Follow this format: `type: short description`

```
feat: add carbon footprint calculator
feat: integrate Gemini AI coach

fix: resolve authentication issue
fix: improve mobile responsiveness

docs: update setup instructions
refactor: optimize dashboard components
```

---

## 🔃 Pull Request Process

### ✅ Pre-submission Checklist

- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Responsive design verified
- [ ] Feature tested locally
- [ ] Documentation updated if needed

### 📝 PR Description Template

```
## Summary
Brief description of what this PR does.

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How you verified the changes work (desktop/mobile/browsers).

## Related Issue
Closes #ISSUE_NUMBER
```

> **Tip:** Include screenshots for any UI changes — it speeds up reviews significantly.

---

## 🐛 Reporting Bugs

Before opening an issue, please search existing issues first.

Use this format:

```
**Bug Description:**
A clear description of what the bug is.

**Steps To Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Environment:**
- Browser:
- Device:
- OS:

**Screenshots:** (if applicable)
```

---

## 🚀 Suggesting Features

```
**Problem:**
What problem does this solve?

**Proposed Solution:**
Describe your idea.

**Expected Benefits:**
How would this improve the experience?

**Additional Notes:**
Any mockups, references, or context.
```

**Example:**
> **Problem:** Users can't compare emissions month-to-month.
> **Solution:** Add a month-over-month comparison view to the dashboard.
> **Benefit:** Better visibility into long-term progress.

---

## 🧑‍💻 Coding Standards

### TypeScript
- Use **strict typing** — avoid `any` whenever possible
- Prefer `interface` over `type` for object shapes

### React
- **Functional components only**
- Keep components small and reusable
- Use proper state management patterns

### Styling
- **Tailwind CSS** utility classes
- **Mobile-first** responsive design
- Consistent use of the design system

### Accessibility
- Semantic HTML elements
- Full keyboard navigation support
- Proper ARIA labels
- WCAG color contrast compliance

---

## 🧪 Testing Before Submitting

Run both commands and make sure they pass clean:

```bash
npm run build
npm run lint
```

Verify: no build errors · no linting errors · no runtime crashes.

---

## 🔒 Security

**Never commit:**
- API keys or secrets
- Firebase credentials
- Sensitive user data

Please report security vulnerabilities **privately** — do not open a public issue.

---

## 🏅 Recognition

Every contributor will be recognized — regardless of contribution size.

Code · Documentation · Design · Testing · Ideas

**All of it matters. All of it counts.**

---

<div align="center">

**Together, we're building technology that makes sustainable living measurable and actionable.**

<br/>

🌱 Build Sustainably · 🌍 Think Globally · 🚀 Innovate Responsibly

<br/>

*Thank you for being part of Ecoventra.*

</div>
