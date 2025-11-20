import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import ClientInit from "@/components/ClientInit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roxana - Developer Network",
  description: "Connect with developers and find internships",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" 
          integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" 
          crossOrigin="anonymous"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <ClientInit />
          <ToastContainer
            position="top-right"
            autoClose={500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
