# Employee Sphere

**Employee Sphere** is a comprehensive employee management application built using React and Redux. It provides a range of features to enhance employee engagement and productivity. Designed to integrate seamlessly within Microsoft Teams, it adapts to Teams' themes using Fluent UI for a consistent and visually appealing experience.

## Features

### 1. **Referral Portal**
- Employees can refer candidates for open positions.
- Tracks referral statuses.

### 2. **HR Queries**
- Submit and manage HR-related queries.
- Query tracking and resolution system.

### 3. **Newsroom**
- Stay updated with the latest company news and announcements.
- Rich text and multimedia support for articles.

### 4. **Food Ordering Portal**
- Browse and order meals from the cafeteria menu.
- Real-time menu updates and order tracking.

### 5. **Admin Portal**
- Manage users, permissions, and application configurations.
- View and analyze employee activity statistics.

## Technology Stack

- **Frontend Framework**: React
- **State Management**: Redux
- **UI Library**: Fluent UI (for seamless integration with Microsoft Teams)

## Key Features

1. **Microsoft Teams Compatibility**:
   - The application can be accessed within Microsoft Teams as a custom tab.
   - Automatically adapts to Teams’ dark and light themes for a native look.

2. **Responsive Design**:
   - Ensures compatibility across devices (desktop, tablet, mobile).

3. **Customizable**:
   - Admins can modify settings to align with company-specific requirements.

## Installation

### Prerequisites
- Node.js (>=14.x)
- npm (>=6.x) or Yarn
- Microsoft Teams setup (optional for Teams integration)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/shubham51919/EmployeeSphere.git
   ```

2. Navigate to the project directory:
   ```bash
   cd employee-sphere
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Access the application in your browser:
   ```

   http://localhost:3000
   ```

## Deployment

To deploy the application, follow these steps:
1. Build the production-ready files:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the `build` folder to your preferred hosting provider.

## Usage in Microsoft Teams

1. **Add as a Custom Tab**:
   - Deploy the application to a web hosting service with HTTPS.
   - Configure the Teams app manifest to include the hosted URL.

2. **Theme Adaptation**:
   - The app dynamically adjusts its UI based on Teams’ current theme (light, dark, high contrast).

## Folder Structure
```
employee-sphere/
├── public/         # Static assets
├── src/
│   ├── components/ # Reusable component
│   ├── hooks/      # Custom hooks specific to components and logic
│   ├── redux/      # State management files
│   ├── utils/      # Utility functions
│   └── App.js      # Root component
├── package.json    # Project dependencies and scripts
└── README.md       # Documentation
```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.


---
Enjoy using **Employee Sphere**! Empower your workforce with a seamless and engaging application.

