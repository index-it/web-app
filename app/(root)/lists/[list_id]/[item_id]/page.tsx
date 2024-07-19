"use client";

import {useParams} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";
import {useList} from "@/hooks/queries/useList";
import {useItemContent} from "@/hooks/queries/useItemContent";
import {useItem} from "@/hooks/queries/useItem";
import React, {useState} from "react";
import {useEditItemMutation} from "@/hooks/mutations/index/item/useEditItemMutation";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {useDeleteItemMutation} from "@/hooks/mutations/index/item/useDeleteItemMutation";
import {useSetItemCompletionMutation} from "@/hooks/mutations/index/item/useSetItemCompletionMutation";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ItemFormDialogContent} from "@/components/ui/index/form/item-form-dialog";
import {Dialog} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useCategories} from "@/hooks/queries/useCategories";
import {useEditItemContentMutation} from "@/hooks/mutations/index/item-content/useEditItemContentMutation";
import {MDXEditorMethods} from "@mdxeditor/editor";
import {ForwardRefEditor} from "@/components/markdown/ForwardRefEditor";

export default function ItemPage() {
  const params = useParams<{ list_id: string, item_id: string }>()
  const {toast} = useToast();
  const editorRef = React.useRef<MDXEditorMethods>(null)

  const [itemDropdownOpen, setItemDropdownOpen] = useState(false)
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState(true)

  const { isPending: isCategoriesPending, isError: isCategoriesError, data: categories, error: categoriesError } = useCategories({ list_id: params.list_id })
  const { isPending: isItemPending, isError: isItemError, data: item, error: itemError } = useItem({ list_id: params.list_id, item_id: params.item_id } )
  const { isPending: isContentPending, isError: isContentError, data: content, error: contentError } = useItemContent({ list_id: params.list_id, item_id: params.item_id } )

  const setItemCompletionMutation = useSetItemCompletionMutation({
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

  const editItemMutation = useEditItemMutation({
    onSuccess: (_data, _variables, _context) => {
      setEditItemDialogOpen(false)
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

  const deleteItemMutation = useDeleteItemMutation({
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

  const editItemContentMutation = useEditItemContentMutation({
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

  if (item === undefined || content === undefined) {
    return (
      <Spinner />
    )
  }

  return (
    <>
      <div className="flex flex-col w-full p-4">
        <div className="w-full flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/lists/${item.list_id}`} className={buttonVariants({variant: "ghost", size: "icon"})}>
              <Icon icon="material-symbols:arrow-back-rounded" className="size-5"/>
            </Link>
            <span className="text-lg">{item.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {viewMode &&
                <Button onClick={() => {
                  setViewMode(false)
                  editorRef?.current?.focus()
                }}>
                    Edit
                </Button>
            }
            {!viewMode &&
                <Button onClick={() => {
                  const markdown = editorRef.current?.getMarkdown() ?? ""
                  editItemContentMutation.mutate({ list_id: item.list_id, item_id: item.id, content: markdown })
                  setViewMode(true)
                }}>Save
                </Button>
            }
            <DropdownMenu open={itemDropdownOpen} onOpenChange={setItemDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                  <Icon icon="ph:dots-three-outline-vertical-fill" className="size-5"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                  setItemCompletionMutation.mutate({
                    list_id: item.list_id,
                    item_id: item.id,
                    completed: !item.completed
                  });
                }}>
                  {item.completed ? "Un-complete" : "Complete"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault()
                  setItemDropdownOpen(false)
                  setEditItemDialogOpen(true)
                }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => deleteItemMutation.mutate({ list_id: item.list_id, item_id: item.id })}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Dialog open={editItemDialogOpen} onOpenChange={setEditItemDialogOpen}>
          <ItemFormDialogContent
            loading={editItemMutation.isPending}
            edit={true}
            categories={categories ?? []}
            onFormSubmit={editItemMutation.mutate}
            defaultValues={
              {
                list_id: item.list_id,
                item_id: item.id,
                category_id: item.category_id,
                name: item.name,
                link: item.link,
              }
            }
          />
        </Dialog>

        <ForwardRefEditor contentEditableClassName="mdcontent" ref={editorRef} markdown={content.content} readOnly={viewMode} className="mt-12 border border-input bg-background rounded p-2 h-full"/>
      </div>
    </>
  )
}