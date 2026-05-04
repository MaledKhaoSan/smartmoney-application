"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "ภาพรวม",
      href: "/organization",
      icon: LayoutDashboard,
      active: pathname === "/organization" || pathname.startsWith("/organization/stats"),
    },
    {
      title: "ลูกหนี้",
      href: "/organization/members",
      icon: Users,
      active: pathname.startsWith("/organization/members"),
    },
    {
      title: "การเงิน",
      href: "/organization/transactions",
      icon: CreditCard,
      active: pathname.startsWith("/organization/transactions"),
    },
    {
      title: "ตั้งค่า",
      href: "/organization/settings",
      icon: Settings,
      active: pathname.startsWith("/organization/settings"),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 backdrop-blur-md px-4 pb-safe md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-200",
              item.active ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        )
      })}
    </div>
  )
}
