import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import Navigation from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Proyecto F - Matemática Discreta & Diseño Lógico",
  description: "Plataforma educativa interactiva para la Tecnicatura Universitaria en Desarrollo de Software",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-bg text-text`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
