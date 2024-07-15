"use client";

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";
import {IxCategory} from "@/lib/models/index/IxCategory";
import {useState} from "react";
import {CategoryFormDialogContent} from "@/components/ui/index/form/category-form-dialog";
import {Dialog} from "@/components/ui/dialog";
import {useEditCategoryMutation} from "@/hooks/mutations/index/category/useEditCategoryMutation";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {useToast} from "@/components/ui/use-toast";

type IxCategoryHeaderProps = {
  category: IxCategory
}

export function IxCategoryHeader({ category, }: IxCategoryHeaderProps) {
  const { toast } = useToast()
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false)

  const editCategoryMutation = useEditCategoryMutation({
    onSuccess: (_data, _variables, _context) => {
      setEditCategoryDialogOpen(false)
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

  return (
    <>
      <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
        <CategoryFormDialogContent
          loading={editCategoryMutation.isPending}
          edit={true}
          onFormSubmit={editCategoryMutation.mutate}
          defaultValues={
            {
              list_id: category.list_id,
              category_id: category.id,
              name: category.name,
              color: category.color,
            }
          }
        />
      </Dialog>

      <div className="flex items-center gap-2 justify-between w-64">
        <div className="flex items-center gap-3">
          <span className="size-3 rounded-full" style={{backgroundColor: category.color}}/>
          <span className="font-semibold">{category.name}</span>
        </div>
        <DropdownMenu open={categoryDropdownOpen} onOpenChange={setCategoryDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Icon icon="ph:dots-three-outline-vertical-fill" className="size-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/*<DropdownMenuLabel>Categories</DropdownMenuLabel>*/}
            {/*<DropdownMenuSeparator />*/}
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                setCategoryDropdownOpen(false)
                setEditCategoryDialogOpen(true)
              }}
            >Edit category</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}