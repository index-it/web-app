import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {IxItem} from "@/lib/models/index/IxItem";
import {useSetItemCompletionMutation} from "@/hooks/mutations/index/item/useSetItemCompletionMutation";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {useToast} from "@/components/ui/use-toast";
import {useState} from "react";
import {useCreateItemMutation} from "@/hooks/mutations/index/item/useCreateItemMutation";
import {useRouter} from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {Dialog} from "@/components/ui/dialog";
import {ItemFormDialogContent} from "@/components/ui/index/form/item-form-dialog";
import {IxCategory} from "@/lib/models/index/IxCategory";
import {useEditItemMutation} from "@/hooks/mutations/index/item/useEditItemMutation";
import {useDeleteItemMutation} from "@/hooks/mutations/index/item/useDeleteItemMutation";

type IxItemCardProps = {
  item: IxItem,
  categories: IxCategory[]
}

export function IxItemCard({ item, categories }: IxItemCardProps) {
  const { toast } = useToast()

  const [itemDropdownOpen, setItemDropdownOpen] = useState(false)
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)

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

  return (
    <>
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

      <DropdownMenu open={itemDropdownOpen} onOpenChange={setItemDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="gap-4 w-64 justify-start" onPointerDown={(event) => {
            event.stopPropagation();
          }}>
            <div
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              className="flex items-center"
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={(checked) => {
                  setItemCompletionMutation.mutate({
                    list_id: item.list_id,
                    item_id: item.id,
                    completed: checked === true
                  });
                }}
              />
            </div>
            <span className="text-nowrap overflow-hidden text-ellipsis">{item.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/lists/${item.list_id}/${item.id}`}>
              Open
            </Link>
          </DropdownMenuItem>
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
    </>
  )
}