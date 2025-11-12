# Firebase Setup Guide for QuizVerse

This guide will walk you through setting up a Firebase project and connecting it to your QuizVerse application.

## Step 1: Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on **"Add project"** or **"Create a project"**.
3.  Give your project a name (e.g., "QuizVerse") and follow the on-screen instructions to create the project. You can disable Google Analytics for this demo if you wish.

## Step 2: Create a Web App in Firebase

1.  Once your project is created, you'll land on the project dashboard.
2.  Click on the Web icon (`</>`) to add a new web application.
3.  Give your app a nickname (e.g., "QuizVerse Web") and click **"Register app"**.
4.  You don't need to add the Firebase SDK scripts to your code, as this project handles it via `npm`.
5.  After registering, Firebase will show you a `firebaseConfig` object. It will look something like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "AIzaSy...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:...",
      measurementId: "G-..."
    };
    ```

    Keep this information handy. You'll need it for the next step.

## Step 3: Configure Environment Variables

1.  In your QuizVerse project folder, create a new file named `.env.local`.
2.  Copy the contents of the `.env.local.example` file into your new `.env.local` file.
3.  Fill in the values using the keys from the `firebaseConfig` object you got in the previous step.

    Your `.env.local` file should look like this, but with your actual project keys:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
    NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...
    ```

    **Important:** The `NEXT_PUBLIC_` prefix is required for these variables to be accessible in the browser.

## Step 4: Enable Authentication Methods

For this application, you need to enable Email/Password sign-in.

1.  In the Firebase Console, go to the **Authentication** section from the left-hand menu.
2.  Click on the **"Sign-in method"** tab.
3.  Select **"Email/Password"** from the list of providers.
4.  Enable it and click **"Save"**.

That's it! Your QuizVerse application is now configured to use Firebase for authentication. When you run `npm run dev`, the app will use these credentials to connect to your Firebase project.
