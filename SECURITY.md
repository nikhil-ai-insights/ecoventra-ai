<div align="center">

# 🔒 Security Policy

**The security of Ecoventra and its users is a top priority.**

We appreciate responsible disclosure and take every report seriously.

</div>

---

## 🛡️ Supported Versions

| Version | Status |
|---------|--------|
| Latest Release | ✅ Supported |
| Development Branch | ✅ Supported |
| Older Releases | ❌ Not Supported |

---

## 🚨 Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

> Publicly disclosing a vulnerability before it's been reviewed puts all users at risk. We ask that you report responsibly and privately.

### ❌ Please Avoid
- Opening public GitHub issues for security bugs
- Disclosing vulnerabilities before they are reviewed
- Sharing exploit details in public channels

---

## 📬 How to Report

When reporting, please include as much of the following as possible:

**1. Vulnerability Summary**
A clear, concise description of the issue.

**2. Steps to Reproduce**
Step-by-step instructions to reproduce the vulnerability.

**3. Impact Assessment**
Describe the potential impact. For example:
- Unauthorized access
- Data exposure
- Authentication bypass
- API abuse
- Privilege escalation

**4. Proof of Concept**
Screenshots, logs, or code snippets if available.

---

## ⏱️ Response Timeline

| Action | Timeline |
|--------|----------|
| Initial Acknowledgement | Within 48 hours |
| Vulnerability Assessment | Within 7 days |
| Fix Development | Depends on severity |
| Public Disclosure | After fix is released |

---

## ✅ Security Best Practices

Guidelines all contributors should follow:

### 🔑 Authentication
- Never hardcode credentials
- Use Firebase Authentication securely
- Always validate authentication state server-side

### 🗝️ API Keys
- Store all secrets in environment variables
- Never commit API keys to version control
- Never expose Gemini API keys publicly

### 👤 User Data
- Minimize data collection
- Follow least-privilege principles
- Secure sensitive information at rest and in transit

### 🗄️ Database Security
- Use Firestore Security Rules
- Validate all client-side inputs
- Restrict unauthorized read/write access

### 🌐 Frontend Security
- Sanitize all user-generated content
- Avoid unsafe HTML rendering (`dangerouslySetInnerHTML`)
- Protect against XSS attacks

---

## 🎯 Security Scope

The following areas are **in scope** for vulnerability reports:

- Authentication & Authorization
- User Data Protection
- Firestore Security Rules
- Gemini API Integrations
- File Uploads & Storage
- Dashboard Access Control
- Session Management

---

## 🚫 Out of Scope

The following are generally **not considered** valid reports:

- Social engineering attacks
- Physical device access
- Third-party service outages (Firebase, Gemini)
- Denial of service testing
- Vulnerabilities requiring a pre-compromised user account

---

## 📦 Dependency Management

Regularly audit dependencies for known vulnerabilities:

```bash
npm audit
```

Keep dependencies up to date — many security patches arrive via routine version bumps.

---

## 🤝 Responsible Disclosure

We deeply appreciate security researchers and contributors who help make Ecoventra safer.

Please allow us reasonable time to investigate and resolve a vulnerability **before** any public disclosure. We will credit researchers appropriately once a fix is released.

---

<div align="center">

**Ecoventra is committed to protecting user data, following secure development practices, and addressing vulnerabilities promptly.**

<br/>

🌍 Security First · 🔒 Privacy Matters · 🚀 Build Responsibly

</div>
