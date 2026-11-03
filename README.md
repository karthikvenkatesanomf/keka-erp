# Keka ERP

## About This Project

This project is a proof of concept (POC) built with Angular to explore core concepts such as services, signals, routing, and reusable components. The app provides employee and task management with Firebase integration.

## Start the Project

Install dependencies and run the local development server:

```bash
npm install
npm start
```

Open `http://localhost:4200/` in your browser. To create a production build, run `npm run build`.

## Project Structure

```text
src/
	app/
		components/       Shared UI components
		firebase/          Firebase app and client configuration
		guards/            Route guards
		layout/            Main application layout
		models/            Employee and task models
		pages/             Dashboard, login, employee, and task pages
		services/          Authentication, Firestore, and feature services
		validators/        Form validators
	environments/        Firebase environment configuration
public/                Static assets
screenshots/            Project screenshots
```

## Screenshots

Screenshots are stored in [`screenshots/`](./screenshots/). They are scaled below for readability; open the files directly for full resolution.

### Login

<img src="./screenshots/login.png" alt="Keka ERP login screen" width="900" />

### Dashboard

<img src="./screenshots/dashboard.png" alt="Keka ERP dashboard" width="900" />

### Employee List

<img src="./screenshots/employee-list.png" alt="Employee list" width="900" />

### Create Employee

<img src="./screenshots/employee-create.png" alt="Create employee form" width="900" />

### Task List

<img src="./screenshots/task.png" alt="Task list" width="900" />

### Create Task

<img src="./screenshots/task-create.png" alt="Create task form" width="900" />

## Firebase Implementation

Add your Firebase configuration values in `src/environments/index.ts`:

```typescript
export const environment = {
	API_KEY: 'YOUR_API_KEY',
	AUTH_DOMAIN: 'YOUR_AUTH_DOMAIN',
	PROJECT_ID: 'YOUR_PROJECT_ID',
	STORAGE_BUCKET: 'YOUR_STORAGE_BUCKET',
	MESSAGING_SENDER_ID: 'YOUR_MESSAGING_SENDER_ID',
	APP_ID: 'YOUR_APP_ID',
	MEASUREMENT_ID: 'YOUR_MEASUREMENT_ID',
};
```

- Hosted on Firebase: [https://keka-erp.web.app](https://keka-erp.web.app)
- Firebase Authentication: Email/Password sign-in.
- Cloud Firestore: Stores employee and task information.
