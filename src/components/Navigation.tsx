import Link from 'next/link'

export default function Navigation() {
  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/conversiones', label: 'Conversiones' },
    { href: '/signados', label: 'Signados' },
    { href: '/booleana', label: 'Booleana' },
    { href: '/errores', label: 'Errores' },
    { href: '/simulador', label: 'Simulador' },
  ]

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-8 py-4">
          <Link href="/" className="text-accent font-bold text-lg">
            Proyecto F
          </Link>
          
          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted hover:text-accent transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
