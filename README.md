# PICTIAP

PICTIAP is a modern learning platform built with Next.js and Firebase. It provides a seamless experience for both students and teachers.

## Features

- **Dual User Roles**: Separate authentication and dashboards for Students and Teachers using Firebase Auth.
- **Teacher Dashboard**: Teachers can create quizzes, view student submissions, and track class performance.
- **Student Dashboard**: Students can take available quizzes, track their own progress, and view detailed performance analysis.
- **Dynamic Quiz Creation**: An intuitive interface for teachers to build quizzes with various question types.
- **Interactive Quiz Taking**: An engaging experience for students to take quizzes and receive immediate feedback.
- **AI-Powered Recommendations**: A GenAI feature that analyzes a student's performance and suggests relevant quizzes to help them improve.

## Getting Started

### 1. Install Dependencies

First, install the necessary packages:

```bash
npm install
```

### 2. Set Up Firebase

This project uses Firebase for authentication and will be used for database storage in the future.

1.  Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  In your project, go to **Project settings** > **General**.
3.  Under "Your apps", create a new Web App.
4.  You will be given a `firebaseConfig` object. You'll need these values.
5.  Create a new file named `.env.local` in the root of your project.
6.  Copy the contents of `.env.local.example` into `.env.local` and fill in the values from your Firebase project's `firebaseConfig`.

For more detailed instructions, see `FIREBASE_SETUP.md`.

### 3. Run the Development Server

Now, you can run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
