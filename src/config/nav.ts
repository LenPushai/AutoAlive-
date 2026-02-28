export interface NavItem {
  label: string
  href: string
}

export const publicNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const adminNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Inventory', href: '/dashboard/inventory' },
  { label: 'Leads', href: '/dashboard/leads' },
  { label: 'Sales', href: '/dashboard/sales' },
  { label: 'Users', href: '/dashboard/users' },
  { label: 'Settings', href: '/dashboard/settings' },
]
