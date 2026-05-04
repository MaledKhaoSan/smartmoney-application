"use client"

import * as React from "react"
import { LayoutDashboard, Users, CreditCard, Settings, Building2, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useAppStore()
  const pathname = usePathname()

  if (!currentUser) return null

  // All users now see the main organization management structure in Thai
  const items = [
    {
      title: "ภาพรวม",
      url: "/organization",
      icon: LayoutDashboard,
      isActive: pathname.startsWith("/organization") && !pathname.includes("members") && !pathname.includes("transactions") && !pathname.includes("settings"),
      items: [
        { title: "แดชบอร์ด", url: "/organization" },
        { title: "สถิติรายวัน", url: "/organization/stats" },
      ]
    },
    {
      title: "ลูกหนี้",
      url: "/organization/members",
      icon: Users,
      isActive: pathname.includes("members"),
      items: [
        { title: "ภาพรวมลูกหนี้", url: "/organization/members" },
        { title: "เพิ่มลูกหนี้ใหม่", url: "/organization/members/new" },
      ]
    },
    {
      title: "การเงิน",
      url: "/organization/transactions",
      icon: CreditCard,
      isActive: pathname.includes("transactions"),
      items: [
        { title: "รายการธุรกรรม", url: "/organization/transactions" },
        { title: "ประวัติการชำระ", url: "/organization/transactions/history" },
      ]
    },
    {
      title: "ตั้งค่า",
      url: "/organization/settings",
      icon: Settings,
      isActive: pathname.includes("settings"),
    },
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">SmartMoney</span>
                  <span className="text-xs text-muted-foreground">ระบบจัดการเงินกู้</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}



