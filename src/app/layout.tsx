// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Nav from "@/components/Nav";

export const metadata = { 
  title: "Quiz Platform",
  description: "Student/Teacher quiz platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          <main style={{ padding: 20 }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
