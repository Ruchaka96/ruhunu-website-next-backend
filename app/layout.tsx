import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import "quill/dist/quill.snow.css";


export const metadata = {
    title: 'Admin - Ruhunu Hospital',
    icons: {
      icon: "/favicon.png",
    },
    description:
      'Ruhunu Hospital admin dashboard.'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col bg-white">
        {children}
        <Toaster />
      </body>
      {/* <Analytics /> */}
    </html>
  );
}
