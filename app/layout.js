import './globals.css'

export const metadata = {
  title: 'HypeChat - Connect with friends',
  description: 'A GirlHype social media platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}