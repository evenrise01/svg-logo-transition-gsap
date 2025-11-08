import { Nav } from "@/components/Nav";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import PageTransitionSignature from "@/components/PageTransistionSignature";
import { DM_Sans } from "next/font/google";
const dm = DM_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dm.variable}
      >
        <PageTransitionSignature>
      <Nav/>
        {children}
        </PageTransitionSignature>
      </body>
    </html>
  );
}
