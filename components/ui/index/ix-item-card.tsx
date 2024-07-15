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

type IxItemCardProps = {
  item: IxItem
}

export function IxItemCard({ item }: IxItemCardProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [itemDropdownOpen, setItemDropdownOpen] = useState(false)
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)

  const editItemMutation = useCreateItemMutation({
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
    <Button variant="secondary" className="gap-4 w-64 justify-start">
      <Checkbox
        checked={item.completed}
        onCheckedChange={(checked) => {
          setItemCompletionMutation.mutate({
            list_id: item.list_id,
            item_id: item.id,
            completed: checked === true
          })
        }}
      />
      <span className="text-nowrap overflow-hidden text-ellipsis">{item.name}</span>
    </Button>
  )
}