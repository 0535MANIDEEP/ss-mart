// app/layout.js




import '../styles/globals.css';
import './styles/hero-scrollbar.css';
import Providers from './providers';
import AppShell from './AppShell';


/**
 * RootLayout: Provides a fixed header, sidebar, and footer for the entire app.
 * - Header: fixed at the top, always visible, contains logo/title/nav.
 * - Sidebar: fixed/collapsible, only one per screen, never overlaps content.
 * - Footer: fixed at the bottom, minimal content.
 * - Main content (hero): scrolls independently, never hidden by header/footer/sidebar.
 * - All navigation is handled in Sidebar and Header, never duplicated.
 * - All styles use Tailwind CSS for consistency and maintainability.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans text-gray-900 bg-gray-50">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FreshMart Grocery Store</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className="w-full bg-gray-50 font-sans">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
