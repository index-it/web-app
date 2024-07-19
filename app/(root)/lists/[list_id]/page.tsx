"use client"

import {useParams, useRouter} from "next/navigation";
import {useList} from "@/hooks/queries/useList";
import {useCategories} from "@/hooks/queries/useCategories";
import {useItems} from "@/hooks/queries/useItems";
import {useState} from "react";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";
import { Checkbox } from "@/components/ui/checkbox";
import {cn} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {ListFormDialogContent} from "@/components/ui/index/form/list-form-dialog";
import {useToast} from "@/components/ui/use-toast";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {useEditListMutation} from "@/hooks/mutations/index/list/useEditListMutation";
import {Spinner} from "@/components/ui/spinner";
import {CategoryFormDialogContent} from "@/components/ui/index/form/category-form-dialog";
import {useCreateCategoryMutation} from "@/hooks/mutations/index/category/useCreateCategoryMutation";
import {IxCategory} from "@/lib/models/index/IxCategory";
import {IxItem} from "@/lib/models/index/IxItem";
import {useEditCategoryMutation} from "@/hooks/mutations/index/category/useEditCategoryMutation";
import {useCreateItemMutation} from "@/hooks/mutations/index/item/useCreateItemMutation";
import {ItemFormDialogContent} from "@/components/ui/index/form/item-form-dialog";
import {useSetItemCompletionMutation} from "@/hooks/mutations/index/item/useSetItemCompletionMutation";
import {IxCategoryHeader} from "@/components/ui/index/ix-category-header";
import {IxItemCard} from "@/components/ui/index/ix-item-card";

export default function ListPage() {
  const params = useParams<{ list_id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined)

  const [listDropdownOpen, setListDropdownOpen] = useState(false)

  const [editListDialogOpen, setEditListDialogOpened] = useState(false)
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false)
  const [createItemDialogOpen, setCreateItemDialogOpen] = useState(false)

  /// QUERIES ///
  const { isPending: isListPending, isError: isListError, data: list, error: listError } = useList({ list_id: params.list_id} )
  const { isPending: isCategoriesPending, isError: isCategoriesError, data: categories, error: categoriesError } = useCategories({ list_id: params.list_id })
  const { isPending: isItemsPending, isError: isItemsError, data: items, error: itemsError } = useItems({ list_id: params.list_id, completed: completedFilter })


  /// MUTATIONS ///
  const editListMutation = useEditListMutation({
    onSuccess: (_data, _variables, _context) => {
      setEditListDialogOpened(false)
    },
    onError: (error, _variables, _context) => {
      if (error instanceof IxApiError) {
        toast({
          description: error.ixApiErrorResponse,
          variant: "destructive"
        })
      } else {
        toast({
          description: IxApiErrorResponse.UNKNOWN,
          variant: "destructive"
        })
      }
    }
  })

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (_data, _variables, _context) => {
      setCreateCategoryDialogOpen(false)
    },
    onError: (error, _variables, _context) => {
      if (error instanceof IxApiError) {
        toast({
          description: error.ixApiErrorResponse,
          variant: "destructive"
        })
      } else {
        toast({
          description: IxApiErrorResponse.UNKNOWN,
          variant: "destructive"
        })
      }
    }
  })

  const createItemMutation = useCreateItemMutation({
    onSuccess: (_data, _variables, _context) => {
      setCreateItemDialogOpen(false)
    },
    onError: (error, _variables, _context) => {
      if (error instanceof IxApiError) {
        toast({
          description: error.ixApiErrorResponse,
          variant: "destructive"
        })
      } else {
        toast({
          description: IxApiErrorResponse.UNKNOWN,
          variant: "destructive"
        })
      }
    }
  })

  if (list === undefined) {
    return (
      <Spinner />
    )
  }

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
          <Button onClick={() => setCreateItemDialogOpen(true)}>Create item</Button>
          <DropdownMenu open={listDropdownOpen} onOpenChange={setListDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary">
                <Icon icon="ph:dots-three-outline-vertical-fill" className="size-5"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/*<DropdownMenuLabel>Categories</DropdownMenuLabel>*/}
              {/*<DropdownMenuSeparator />*/}
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault()
                setListDropdownOpen(false)
                setEditListDialogOpened(true)
              }}>Edit list</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault()
                setListDropdownOpen(false)
                setCreateCategoryDialogOpen(true)
              }}>Create category</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={editListDialogOpen} onOpenChange={setEditListDialogOpened}>
        <ListFormDialogContent
          loading={editListMutation.isPending}
          edit={true}
          onFormSubmit={editListMutation.mutate}
          defaultValues={
            {
              list_id: list.id,
              name: list.name,
              icon: list.icon,
              color: list.color,
              public: list.public
            }
          }
        />
      </Dialog>

      <Dialog open={createCategoryDialogOpen} onOpenChange={setCreateCategoryDialogOpen}>
        <CategoryFormDialogContent
          loading={createCategoryMutation.isPending}
          edit={false}
          onFormSubmit={createCategoryMutation.mutate}
          defaultValues={
            {
              list_id: list.id,
              category_id: "",
              name: "",
              color: "#000000",
            }
          }
        />
      </Dialog>

      <Dialog open={createItemDialogOpen} onOpenChange={setCreateItemDialogOpen}>
        <ItemFormDialogContent
          loading={createItemMutation.isPending}
          edit={false}
          categories={categories ?? []}
          onFormSubmit={createItemMutation.mutate}
          defaultValues={
            {
              list_id: list.id,
              item_id: "",
              category_id: undefined,
              name: "",
              link: undefined,
            }
          }
        />
      </Dialog>

      {/* CATEGORIES */}
      <div className="mt-16 h-full">
        <div className="h-full">
          {/*TODO: horizontal scroll */}
          <div className="overflow-x-auto flex gap-16 h-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 justify-between w-64">
                <div className="flex items-center gap-3">
                  <span className="size-3 rounded-full" style={{backgroundColor: list?.color}}/>
                  <span className="font-semibold opacity-60">Uncategorized</span>
                </div>
              </div>
              {items?.filter(item => item.category_id === null).sort((a, b) => a.completed ? 1 : -1).map(item => (
                <IxItemCard item={item} key={item.id} categories={categories ?? []} />
              ))}
            </div>
            {categories?.map(category => (
              <div key={category.id} className="flex flex-col gap-4">
                <IxCategoryHeader category={category} />
                {items?.filter(item => item.category_id === category.id).sort((a, b) => a.completed ? 1 : -1).map(item => (
                  <IxItemCard item={item} key={item.id} categories={categories} />
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  </>
}