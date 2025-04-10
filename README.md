# 🚀 Project Setup Guide

Welcome to the project! This guide will help you set up the development environment and follow best practices for collaboration.

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hirokr/education-hub.git
   cd education-hub
   ```

2. Install the project dependencies using:
   ```bash
   npm install
   ```

---

## 💠 Running the Development Server

To start the development server, you can use either:

```bash
npm run dev
# or
bun run dev
```

---

## 🔐 Environment Configuration

1. Create a `.env` file in the root directory.
2. Fill it with appropriate values using the `.env.example` file as a reference.

```bash
cp .env.example .env
```

Make sure to update the `.env` file with your environment-specific variables.

---

## 🤝 Collaborator Guidelines

- Always create a new branch for your feature or bug fix:
  ```bash
  git checkout -b your-feature-branch
  ```

- Once your feature is complete and tested, merge it into the `development` branch for integration testing:
  ```bash
  git switch development
  git merge your-feature-branch
  ```

- Do **not** push directly to the `main` branch. All features should be tested via the `development` branch first.

---

## 💪 Testing & QA

Make sure to test your changes locally before merging. You may also write unit or integration tests depending on the scope of your contribution.

---

## 📬 Questions?

If you encounter any issues or have questions, feel free to open an issue or contact.

---

Happy coding! 🎉