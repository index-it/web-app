"use client"

import { useParams } from "next/navigation";
import {useList} from "@/hooks/queries/useList";
import {useCategories} from "@/hooks/queries/useCategories";
import {useItems} from "@/hooks/queries/useItems";
import {useState} from "react";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";
import { Checkbox } from "@/components/ui/checkbox";
import {cn} from "@/lib/utils";

export default function ListPage() {
  const params = useParams<{ list_id: string }>()
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined)

  const { isPending: isListPending, isError: isListError, data: list, error: listError } = useList({ list_id: params.list_id} )
  const { isPending: isCategoriesPending, isError: isCategoriesError, data: categories, error: categoriesError } = useCategories({ list_id: params.list_id })
  const { isPending: isItemsPending, isError: isItemsError, data: items, error: itemsError } = useItems({ list_id: params.list_id, completed: completedFilter })


  return <>
    <div className="flex flex-col w-full p-4">
      {/* NAVBAR */}
      <div className="w-full flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/lists" className={buttonVariants({variant: "ghost", size: "icon"})}>
            <Icon icon="material-symbols:arrow-back-rounded" className="size-5"/>
          </Link>
          <span className="text-lg">{list?.name ?? "Loading..."}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button>Create item</Button>
          <Button size="icon" variant="secondary">
            <Icon icon="ph:dots-three-outline-vertical-fill" className="size-5"/>
          </Button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mt-16 h-full">
        <div className="h-full">
          {/*TODO: horizontal scroll */}
          <div className="overflow-x-auto flex gap-16">
            {/* TODO: uncategorized items */}
            {categories?.map(category => (
              <div key={category.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full" style={{backgroundColor: category.color}}/>
                    <span className="font-semibold">{category.name}</span>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Icon icon="ph:dots-three-outline-vertical-fill" className="size-4"/>
                  </Button>
                </div>
                {items?.filter(item => item.category_id === category.id).sort((a, b) => a.completed ? 1 : -1).map(item => (
                  <Button variant="secondary" key={item.id} className="gap-4 w-64 justify-start">
                    <Checkbox checked={item.completed} />
                    <span className="text-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                  </Button>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  </>
}