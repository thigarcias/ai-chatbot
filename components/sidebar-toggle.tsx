import { useSidebar } from '@/components/ui/sidebar'

import { SidebarLeftIcon } from './icons'
import { Button } from './ui/button'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      onClick={toggleSidebar}
      variant="outline"
      className="md:px-2 md:h-fit"
    >
      <SidebarLeftIcon size={16} />
    </Button>
  )
}
