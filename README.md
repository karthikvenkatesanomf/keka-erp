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
```

## Screenshots

### Login

<img width="900" alt="Keka ERP login screen" src="https://github.com/user-attachments/assets/5656d12a-c2af-4a90-bef3-00ab916081ff" />

### Dashboard

<img width="900" alt="Keka ERP dashboard" src="https://github.com/user-attachments/assets/30fc03d6-afde-4dc2-8847-2c30a8cd3c02" />

### Employee List

<img width="900" alt="Employee list" src="https://github.com/user-attachments/assets/00a36c28-b022-4506-9aa1-7481ac067b28" />

### Create Employee

<img width="900" alt="Create employee form" src="https://github.com/user-attachments/assets/1c8d9073-400a-4cd9-82e2-08ceead7d9f8" />

### Task List

<img width="900" alt="Task list" src="https://github.com/user-attachments/assets/55e9bffa-6aa1-48f8-ae7e-fc4df7e3452b" />

### Create Task

<img width="900" alt="Create task form" src="https://github.com/user-attachments/assets/a31edcad-cb48-4f31-a986-dc47980efb12" />

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
