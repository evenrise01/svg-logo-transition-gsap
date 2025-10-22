import { Nav } from "@/components/Nav";
import "./globals.css";
import PageTransition from "@/components/PageTransition";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <PageTransition>
      <Nav/>
        {children}
        </PageTransition>
      </body>
    </html>
  );
}
