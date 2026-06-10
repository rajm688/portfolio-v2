import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rajkumar-portfolio.com'),
  title: "Rajkumar Murugesan | Full Stack Software Engineer",
  description: "Interactive 3D portfolio of Rajkumar Murugesan, a Full Stack Software Engineer specializing in scalable web apps, AI integration, and 3D experiences.",
  keywords: ["Rajkumar Murugesan", "Software Engineer", "Full Stack Developer", "Portfolio", "3D Web", "React", "Next.js"],
  authors: [{ name: "Rajkumar Murugesan" }],
  openGraph: {
    title: "Rajkumar Murugesan | Full Stack Software Engineer",
    description: "Interactive 3D portfolio of Rajkumar Murugesan, a Full Stack Software Engineer specializing in scalable web apps, AI integration, and 3D experiences.",
    url: "https://rajkumar-portfolio.com",
    siteName: "Rajkumar Murugesan Portfolio",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
        alt: "Rajkumar Murugesan Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajkumar Murugesan | Full Stack Software Engineer",
    description: "Interactive 3D portfolio of Rajkumar Murugesan, a Full Stack Software Engineer specializing in scalable web apps, AI integration, and 3D experiences.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.className} antialiased transition-colors duration-500`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
