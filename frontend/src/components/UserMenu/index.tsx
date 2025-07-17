import { User } from "@/types/User"
import Link from "next/link"

type UserMenuProps = {
  handleLogout?: () => void
  user?: User
}

type TMenuItem = {
  label: string,
  href: string,
  condition?: (userRole: string) => boolean
}

export default function UserMenu (props : UserMenuProps) {
  const {
    handleLogout,
    user = null
  } = props

  const menu: TMenuItem[] = [
    {
      label: 'Ofertas',
      href: '/',
    },
    {
      label: 'Historial de transacciones',
      href: '/transactions'
    }
  ]

  return (
    <div className="absolute right-0 mt-2 w-60 bg-surface-primary text-primary shadow-theme-lg rounded border border-theme z-50">
      {
        menu.map((menuItem: TMenuItem, index: number) => (
          <Link 
            key={`user-menu-item-${index}`} 
            href={menuItem.href} 
          >
            <div
              className="w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-surface-secondary transition-colors"
            >
              {menuItem.label}
            </div>
          </Link>
        ))
      }

      {
        handleLogout &&
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-600 px-4 py-2 text-sm hover:bg-surface-secondary transition-colors"
          >
            Cerrar sesión
          </button>
      }
    </div>
  )
}