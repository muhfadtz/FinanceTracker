# evvoFinance

**evvoFinance** is a modern, responsive personal finance management web application designed to help users track their income, expenses, manage multiple wallets, and achieve their financial goals. It's built with React, TypeScript, and Tailwind CSS, and uses Firebase for real-time data synchronization and authentication.

![evvoFinance App Preview](https://i.imgur.com/gA9mD1H.png)

## ✨ Features

- **Authentication**: Secure sign-up and login with Email/Password or Google Sign-In.
- **Dashboard**: A comprehensive overview of your total balance, recent transactions, and financial summaries.
- **Wallet Management**:
    - Create, edit, and delete multiple wallets (e.g., Cash, Bank Account, E-Wallet).
    - Drag-and-drop reordering of wallets.
    - Each wallet has its own balance and icon.
- **Transaction Tracking**:
    - Add income and expense transactions with details like amount, category, date, and description.
    - View a list of recent transactions on the home screen.
- **Goal Setting**: Create financial goals with target amounts and track your progress.
- **Debt & Receivable Management**: Keep track of money you owe (payable) and money owed to you (receivable).
- **User Profile**:
    - Customize your profile with a name and a selection of pre-generated avatars.
    - View a financial summary including total balance, debts, and receivables.
- **Personalization**:
    - **Dark/Light Mode**: Switch between themes for comfortable viewing.
    - **Multi-language**: Supports English and Indonesian (Bahasa Indonesia).
    - **Multi-currency**: Supports IDR, USD, and EUR.
- **Responsive Design**: A mobile-first design that works beautifully on all screen sizes.

## 🛠️ Tech Stack

- **Frontend**:
    - [**React**](https://reactjs.org/) (v18) with Hooks
    - [**TypeScript**](https://www.typescriptlang.org/)
    - [**Tailwind CSS**](https://tailwindcss.com/) for styling
- **Backend & Database**:
    - [**Firebase**](https://firebase.google.com/)
        - **Firestore**: For real-time database management.
        - **Firebase Authentication**: For user management.
- **Module Loading**: ES Modules with `importmap` for a build-less development experience.

## 🚀 Getting Started

This project is set up to run without a complex build process, making it easy to get started.

### Prerequisites

- A modern web browser (like Chrome, Firefox, or Edge).
- A simple local web server. The [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code is a great option.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/evvofinance.git
    cd evvofinance
    ```

2.  **Configure Firebase:**
    - Go to the Firebase Console and create a new project.
    - Enable **Firestore** and **Firebase Authentication** (with Email/Password and Google providers).
    - In your project settings, add a new Web App.
    - Firebase will provide you with a `firebaseConfig` object. Copy these credentials.
    - Open `services/firebase.ts` and replace the placeholder `firebaseConfig` with your own.

    ```typescript
    // services/firebase.ts
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID" // Optional
    };
    ```

3.  **Run the application:**
    - If you are using the VS Code Live Server extension, right-click on `index.html` and select "Open with Live Server".
    - Alternatively, you can use any simple HTTP server. For example, with Python:
        ```bash
        python -m http.server
        ```
    - Open your browser and navigate to the local address provided (e.g., `http://localhost:8000`).

## 📁 Project Structure

```
.
├── README.md
├── index.html          # Main HTML entry point with importmap
├── index.tsx           # React root renderer
├── App.tsx             # Main application component, handles routing
├── metadata.json       # App metadata
├── i18n.ts             # Internationalization (translations)
├── types.ts            # TypeScript type definitions
├── utils/
│   └── helpers.ts      # Utility functions (e.g., date formatting)
├── services/
│   └── firebase.ts     # Firebase initialization and configuration
├── screens/
│   ├── main/           # Screens for the authenticated user (Home, Wallet, etc.)
│   ├── AddTransactionModal.tsx
│   ├── AuthLayout.tsx
│   ├── Login.tsx
│   ├── MainApp.tsx     # Main layout after login
│   ├── Settings.tsx
│   ├── SignUp.tsx
│   └── Welcome.tsx
├── context/
│   ├── AuthContext.tsx # Handles user authentication state
│   ├── DataContext.tsx # Manages Firestore data (wallets, transactions)
│   └── SettingsContext.tsx # Manages theme, language, and currency
└── components/
    ├── BottomNav.tsx   # The main navigation bar
    ├── Icons.tsx       # SVG icon components
    └── Spinner.tsx     # Loading spinner components
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
