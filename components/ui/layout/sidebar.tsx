"use client"

import { useIxApiClient } from "@/hooks/useIxApiClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Icon } from "../icon";
import { Button, buttonVariants } from "../button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const selectedSidebarItemClasses = [""]
const enum SidebarItemType {
  TASKS, LOGBOOK, LISTS
}

export function Sidebar() {
  const ixApiClient = useIxApiClient()
  const pathname = usePathname()
  const hours = new Date().getHours()
  const greeting = hours < 12 ? "Good morning" : (hours < 18 ? "Good afternoon" : "Good evening")
  const [selectedItem, setSelectedItem] = useState(SidebarItemType.LISTS)

  useEffect(() => {
    if (pathname.includes('/tasks')) {
      setSelectedItem(SidebarItemType.TASKS)
    } else if (pathname.includes('/logbook')) {
      setSelectedItem(SidebarItemType.LOGBOOK)
    } else if (pathname.includes('/lists/')) {
      setSelectedItem(SidebarItemType.LISTS)
    }
  }, [pathname])

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['user'],
    queryFn: ixApiClient.getLoggedInUser
  })

  return (
    <div className="flex flex-col p-4 bg-background-secondary h-full gap-6">
      <div className="flex items-center gap-12">
        <span className="text-lg font-semibold">{greeting}!</span>
        <Button variant="ghost" size="icon">
          <Icon icon="ph:sidebar-simple" className="size-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <SidebarItem name="Tasks" href="/tasks" selected={selectedItem == SidebarItemType.TASKS} />
          <SidebarItem name="Logbook" href="/logbook" selected={selectedItem == SidebarItemType.LOGBOOK} />
          <SidebarItem name="Settings" href="/settings" selected={false} />
        </div>
        <div className="flex flex-col">
          <SidebarItem name="Lists" href="/" selected={selectedItem == SidebarItemType.LISTS} />
        </div>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  name: string;
  href: string;
  selected: boolean;
}

function SidebarItem({ name, href, selected }: SidebarItemProps) {
  return (
    <>
      <Link href={href} className={cn(selected ? "bg-gray-200 bg-opacity-50" : "", "flex items-center gap-2 rounded px-2 py-1")}>
        {/* <Icon icon="octicon:settings-24" className="size-5" /> */}
        <span>{name}</span>
      </Link>
    </>
  )
}

// tasks
// logbook
// settings (open popup instead?)
// logout
// help
// lists