import "./globals.css";

export const metadata = {
  title: "Auth App",
  description: "Login y registro con Next.js + Express",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
