# Bokra: AI-Powered HR Management System

An AI-powered Human Resources Management System designed for modern businesses, compliant with Egyptian law. This initial version features the employee dashboard and an AI HR assistant.

## Features

-   **Employee Self-Service**:
    -   Personal Dashboard with key stats and recent activities.
    -   Attendance tracking, leave requests, and payslip viewing.
    -   Profile management and document storage.
    -   Onboarding/Offboarding task management.
-   **Manager Tools**:
    -   Team Dashboard for quick overview of team status.
    -   Team Analytics for in-depth employee data exploration.
    -   Reporting and performance management tools.
    -   AI-powered Turnover Risk Analysis.
-   **HR & Admin Management**:
    -   System-wide employee management.
    -   Organizational structure management (Branches, Job Titles).
    -   Policy management for Attendance, Leave, and Overtime.
    -   Recruitment pipeline and candidate tracking.
    -   Learning & Development module management.
    -   Asset and Document management.
-   **AI Assistant**:
    -   An intelligent chatbot integrated for employees to ask HR-related questions based on Egyptian labor law and their personal data.
    -   AI-assisted feedback generation for performance reviews.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Integration**: Google Gemini API (`@google/genai`)
-   **Charting**: Recharts
-   **Build Tool**: The project uses ES modules and is likely set up with a modern build tool like Vite or Parcel.

## Project Structure

The project is structured with a focus on modularity and context-based state management.

```
/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── contexts/     # React Context providers for state management
│   │   └── icons/        # SVG icon components
│   ├── services/         # API service integrations (e.g., Gemini)
│   ├── App.tsx           # Main application component, handles routing and layout
│   ├── index.tsx         # Application entry point
│   ├── types.ts          # TypeScript type definitions
│   ├── constants.tsx     # Mock data and configuration constants
│   └── translations.ts   # Language translations (i18n)
├── index.html          # Main HTML entry file
├── metadata.json       # Project metadata
└── README.md           # You are here!
```

### State Management

The application uses React Context for global state management. This approach centralizes state logic for different domains of the application, making it easier to manage and pass data through the component tree.

Key contexts include:
-   `UserContext`: Manages all employee data and user-related actions.
-   `CompanyStructureContext`: Manages branches and job titles.
-   `PoliciesContext`: Manages all HR policies (attendance, leave, etc.).
-   `RequestContext`: Manages all types of employee requests.
-   `LanguageContext`: Handles internationalization (i18n).

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Environment Variables

The application requires an API key for the Google Gemini API to function.

1.  Create a `.env` file in the root of the project.
2.  Add your API key to the file:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```
    The application is configured to read this key from `process.env.API_KEY`. **Do not hardcode the key anywhere in the source code.**

### Running the Application

Once the dependencies are installed and the environment variables are set, you can start the development server:

```bash
npm start
```

This will typically start the application on `http://localhost:3000` or a similar port.

## Key Concepts

-   **Lazy Loading**: Page components are lazy-loaded using `React.lazy()` and `Suspense` in `App.tsx` to improve initial load performance.
-   **Custom Hooks**: The `useStickyState` hook is used in `App.tsx` to persist user preferences (like theme and sidebar state) in `localStorage`.
-   **Styling**: The project uses Tailwind CSS for utility-first styling, with custom theme configurations defined in `index.html`.
-   **AI Integration**: The `services/geminiService.ts` file contains all the logic for interacting with the Gemini API, including the chatbot functionality, contract generation, and feedback assistance.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/my-new-feature`).
3.  Make your changes and commit them with clear, descriptive messages.
4.  Push your changes to your fork (`git push origin feature/my-new-feature`).
5.  Create a pull request to the main repository.