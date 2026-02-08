# 🏨 Booking App - Front End

A modern, fast, and scalable booking application built with **React 19**, **TypeScript**, and **Vite**. This project uses **SWC** (Speedy Web Compiler) for ultra-fast development and build times.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Compiler:** [SWC](https://swc.rs/) (Speedy Web Compiler)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Linting:** [ESLint 9+](https://eslint.org/) (Flat Config)
- **Styling:** Recommended with Tailwind CSS

## 📁 Project Structure

This project follows a feature-driven architecture for better scalability:

```text
src/
├── assets/          # Static assets like images and icons
├── components/      # Shared UI components (Buttons, Inputs, etc.)
├── features/        # Feature-based modules (Auth, Booking, Hotels)
├── hooks/           # Global custom hooks
├── layouts/         # Layout wrappers for different pages
├── pages/           # Page entry points
├── services/        # API integration and services
├── store/           # State management (Zustand/Redux)
├── types/           # Global TypeScript definitions
└── utils/           # Helper functions (formatting, validation)
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18.0 or higher
- **Package Manager**: npm, yarn, or pnpm

### Installation

1. **Clone the repository:**

  ```text
  git clone https://github.com/your-username/booking-app-fe.git
  ```

2. **Navigate to the project folder:**

  ```text
  cd booking-app-fe
  ```

3. **Install dependencies:**
  ```text
  npm install
  ```

### Development

Run the development server:

```text
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

Build for production:

```text
npm run build
```

The output will be in the `dist/` folder.

## 🌐 Environment Variables

Create a `.env` file in the root directory and add your API configuration:

```env
VITE_API_BASE_URL=https://api.yourbookingapp.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## ⚙️ Configuration Notes

- **SWC Integration**: Using \`@vitejs/plugin-react-swc\` for faster HMR.
- **TypeScript**: Strict mode is enabled to ensure type safety.
- **ESLint**: Configured with the latest Flat Config standard.

## 📝 License

This project is licensed under the MIT License.
