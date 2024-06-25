"use client"

import { useIxApiClient } from "@/hooks/useIxApiClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Icon } from "../icon";
import { Button } from "../button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { IxList } from "@/lib/models/index/IxList";
import { Spinner } from "../spinner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../sheet";

const enum SidebarSelection {
  TASKS, LOGBOOK, LISTS, LIST
}

export function Sidebar() {
  const ixApiClient = useIxApiClient()
  const pathname = usePathname()
  const hours = new Date().getHours()
  const greeting = hours < 5 ? "Good night" : (hours < 12 ? "Good morning" : (hours < 18 ? "Good afternoon" : "Good evening"))
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState(SidebarSelection.LISTS)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  useEffect(() => {
    setMobileOpen(false)

    if (pathname.includes('/tasks')) {
      setSelectedItem(SidebarSelection.TASKS)
    } else if (pathname.includes('/logbook')) {
      setSelectedItem(SidebarSelection.LOGBOOK)
    } else if (pathname.includes('/lists/')) {
      setSelectedItem(SidebarSelection.LIST)
      setSelectedListId(pathname.split('/').pop()!)
    } else if (pathname == "/") {
      setSelectedItem(SidebarSelection.LISTS)
    }
  }, [pathname])

  const { isPending, data, error } = useQuery({
    queryKey: ['lists'],
    queryFn: ixApiClient.getLists
  })

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden absolute z-10 bg-background m-4"
          >
            <Icon icon="ph:sidebar-simple" className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader />
          <div className="flex flex-col h-full gap-6 z-20">
            <span className="text-lg font-semibold">{greeting}!</span>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <SidebarItem name="Tasks" href="/tasks" selected={selectedItem == SidebarSelection.TASKS} loading={false} />
                <SidebarItem name="Logbook" href="/logbook" selected={selectedItem == SidebarSelection.LOGBOOK} loading={false} />
                <SidebarItem name="Settings" href="/settings" selected={false} loading={false} />
              </div>
              <div className="flex flex-col gap-2">
                <SidebarItem name="Lists" href="/" selected={selectedItem == SidebarSelection.LISTS} loading={isPending} />
                <div className="flex flex-col pl-2">
                  <SidebarListsRenderer error={error} data={data} selectedListId={selectedItem == SidebarSelection.LIST ? selectedListId : null} />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {desktopCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDesktopCollapsed(false)}
          className="hidden sm:inline absolute z-10 bg-background m-4"
        >
          <Icon icon="ph:sidebar-simple" className="size-5" />
        </Button>
      )}

      {!desktopCollapsed && (
        <>
          <div className="hidden sm:flex flex-col p-4 bg-background-secondary h-full gap-6 z-20">
            <div className="flex items-center gap-12">
              <span className="text-lg font-semibold whitespace-nowrap">{greeting}!</span>
              <Button variant="ghost" size="sm" onClick={() => setDesktopCollapsed(true)}>
                <Icon icon="ph:sidebar-simple" className="size-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <SidebarItem name="Tasks" href="/tasks" selected={selectedItem == SidebarSelection.TASKS} loading={false} />
                <SidebarItem name="Logbook" href="/logbook" selected={selectedItem == SidebarSelection.LOGBOOK} loading={false} />
                <SidebarItem name="Settings" href="/settings" selected={false} loading={false} />
              </div>
              <div className="flex flex-col gap-2">
                <SidebarItem name="Lists" href="/" selected={selectedItem == SidebarSelection.LISTS} loading={isPending} />
                <div className="flex flex-col pl-2">
                  <SidebarListsRenderer error={error} data={data} selectedListId={selectedItem == SidebarSelection.LIST ? selectedListId : null} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

type SidebarItemProps = {
  name: string;
  href: string;
  selected: boolean;
  loading: boolean;
}

function SidebarItem({ name, href, selected, loading }: SidebarItemProps) {
  return (
    <>
      <Link href={href} className={cn(selected ? "bg-gray-200" : "hover:bg-gray-200", "flex items-center gap-2 justify-between rounded px-2 py-1 bg-opacity-50 transition-all")}>
        {/* <Icon icon="octicon:settings-24" className="size-5" /> */}
        <span>{name}</span>
        {loading && <Spinner />}
      </Link>
    </>
  )
}

type SidebarListsRendererProps = {
  error: Error | null;
  data: IxList[] | undefined;
  selectedListId: string | null;
}

function SidebarListsRenderer({ error, data, selectedListId }: SidebarListsRendererProps) {
  if (error !== null) {
    return <span className="text-sm text-destructive">Failed loading your lists.<br />Please refresh the page</span >
  }

  if (data !== undefined) {
    if (data.length > 0) {
      return data.map(list => (
        <div key={list.id}>
          <SidebarListItem id={list.id} name={list.name} color={list.color} selected={selectedListId == list.id} />
        </div>
      ));
    } else {
      return <span className="text-sm">You don&apos;t have any list yet</span>
    }
  }

  return null;
}

type SidebarListItemProps = {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

function SidebarListItem({ id, name, color, selected }: SidebarListItemProps) {
  return (
    <Link href={`/lists/${id}`} className={cn(selected ? "bg-gray-200" : "hover:bg-gray-200 ", "flex gap-3 items-center px-2 py-1 rounded bg-opacity-50")}>
      <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm">{name}</span>
    </Link>
  )
}