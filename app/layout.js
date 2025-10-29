import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "GirlHype Events",
  description: "Empowering young women through digital skills and innovation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-body">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
