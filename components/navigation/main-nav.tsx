"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Activity, TestTube, Settings, Brain } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "System Status",
    href: "/status",
    icon: Activity,
  },
  {
    name: "Simulations",
    href: "/simulation",
    icon: TestTube,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-1">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">SentinelAI</span>
          <span className="text-sm text-muted-foreground">4.0</span>
        </Link>

        {navigation.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href

          return (
            <Button key={item.name} variant={isActive ? "default" : "ghost"} size="sm" asChild>
              <Link href={item.href} className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </Button>
          )
        })}
      </div>

      <div className="flex items-center">
        <ConnectButton />
      </div>
    </nav>
  )
}
