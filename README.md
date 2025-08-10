# ExpenseSplitter

ExpenseSplitter is a lightweight React application designed to simplify expense splitting among groups. Users can add participants, track expenses, and view optimized settlement suggestions to determine who owes what. The app features a responsive UI with a mobile-friendly sidebar and tab bar, built with React, Tailwind CSS, and Lucide icons.

## Features

- **Participant Management**: Add or remove participants in the expense group.
- **Expense Tracking**: Record expenses with descriptions, amounts, and payers, automatically splitting costs equally among all participants.
- **Settlement Calculations**: View individual balances and optimized transactions for settling debts.
- **Responsive Design**: Seamless experience on desktop and mobile with a sidebar and tab bar for navigation.
- **Local Storage**: Persists participant and expense data in the browser’s local storage.
- **Interactive UI**: Includes smooth animations and gradient backgrounds for an engaging experience.

## Navigation Implementation

### Active Tab Method

The app uses a state-based active tab method for navigation, implemented with a single `activeTab` state variable in the `ExpenseSplitter` component. This state determines which view (`home`, `participants`, `expenses`, `results`) is rendered. The navigation is handled as follows:

- **State Management**: The `activeTab` state (e.g., `'home'`, `'participants'`) is managed using React’s `useState` hook. Clicking a tab button (in the desktop nav, mobile sidebar, or tab bar) updates `activeTab` via `setActiveTab`, triggering a re-render of the corresponding component.

- **Conditional Rendering**: The main content area uses conditional logic to render the appropriate component based on `activeTab`. For example:

  ```jsx
  {activeTab === 'home' && (expenses.length === 0 ? <Welcome /> : <Results {...props} />)}
  {activeTab === 'participants' && <Participants {...props} />}
  ```

- **UI Integration**: The desktop navigation, mobile sidebar, and tab bar highlight the active tab using conditional Tailwind CSS classes (e.g., `bg-white/20` for the active tab). The sidebar and tab bar are toggled with additional state (`sidebarOpen`) for mobile responsiveness.

- **Animations**: A loading animation is applied using `isLoaded` state and Tailwind classes to transition content opacity and position when switching tabs.

### Why Not Use React Router?

I chose the active tab method over React Router for the following reasons:

- **Simplicity**: The app has only four tabs, making state-based navigation simpler than setting up React Router’s `BrowserRouter`, `Route`, and `Link` components. The active tab method requires minimal code and no external dependencies.
- **Small Scope**: With a limited number of views and no need for nested routes or complex navigation, React Router’s features (e.g., URL-based navigation, browser history) are unnecessary.
- **No URL Requirement**: The app’s workflow (adding participants, tracking expenses, viewing results) is linear and session-based, so URL-based navigation or deep linking isn’t needed.
- **Bundle Size**: Avoiding React Router keeps the app lightweight by reducing bundle size and eliminating the need for additional dependency management.
- **UI Control**: The active tab method integrates seamlessly with the custom UI (e.g., animated sidebar, tab bar, gradient effects) without needing to adapt to React Router’s routing conventions.

This approach ensures a straightforward, maintainable codebase tailored to the app’s basic requirements while delivering a smooth user experience.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm 
- A modern web browser

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dhusyanth2005/ExpenseSplitter.git
   cd expense-splitter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```


3. Run the app:

   ```bash
   npm start
   ```


   Access the app at `http://localhost:3000`.

## Project Structure

```
expense-splitter/
├── public/
│   ├── index.html
├── src/
│   ├── components/
│   │   ├── DesktopNav.jsx
│   │   ├── Expenses.jsx
│   │   ├── mobHeader.jsx
│   │   ├── Participants.jsx
│   │   ├── Results.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TabBar.jsx
│   │   ├── Welcome.jsx
│   ├── ExpenseSplitter.jsx
│   ├── index.js
├── package.json
├── README.md
```

## Usage

1. **Home**: View the welcome screen or results if expenses exist.
2. **Participants**: Add or remove participants by entering names.
3. **Expenses**: Add expenses with details (description, amount, payer). Expenses are split equally among all participants.
4. **Results**: View individual balances and optimized settlement transactions. Use the “Clear All” button to reset data.
5. **Navigation**: Use the desktop navigation bar, mobile sidebar, or tab bar to switch between tabs.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

MIT License. See LICENSE for details.


## Contact

For questions, open an issue on GitHub or email sdhusyanth@example.com.

---

Simplify your group expenses with ExpenseSplitter! 💸