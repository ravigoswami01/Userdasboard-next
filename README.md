# Users Dashboard

This project is a single-page Users Dashboard built with Next.js, TypeScript, and Tailwind CSS. It provides a user-friendly interface to manage and view user data.

## Features

- Client-side pagination
- Search functionality for users by name or email
- Filter users by status (Active/Inactive)
- Sort users by name in ascending or descending order
- Responsive design for various screen sizes

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd users-dashboard
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Running the Application

To start the development server, run:

```
npm run dev
```

The application will be available at `http://localhost:3000`.

### Project Structure

- `src/app/layout.tsx`: Main layout of the application.
- `src/app/page.tsx`: Entry point for the Users Dashboard.
- `src/components/`: Contains all the UI components.
- `src/hooks/`: Custom hooks for managing state and logic.
- `src/types/`: TypeScript interfaces for user data.
- `src/utils/`: Utility functions for data manipulation.
- `public/users.json`: Local JSON file containing user data.

### Usage

Once the application is running, you can:

- Search for users using the search bar.
- Filter users by their status.
- Sort users by name.
- Navigate through pages of users using pagination controls.

## License

This project is licensed under the MIT License.