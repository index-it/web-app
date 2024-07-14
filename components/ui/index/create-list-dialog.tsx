import { ListCreateEditFormSchema } from "@/components/form/schemas/list-create-edit-form-schema";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "../button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../form";
import { Input } from "../input";
import { Spinner } from "../spinner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import emojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Switch } from "../switch";

interface CreateListDialogContentProps {
  loading: boolean;
  onCreateListFormSubmit: (data: z.infer<typeof ListCreateEditFormSchema>) => void
}

export function CreateListDialogContent({ loading, onCreateListFormSubmit }: CreateListDialogContentProps) {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const form = useForm<z.infer<typeof ListCreateEditFormSchema>>({
    resolver: zodResolver(ListCreateEditFormSchema),
    defaultValues: {
      name: "",
      icon: "🏀",
      color: "#0000ff",
      public: false
    },
  })

  function onEmojiSelect(emoji: any) {
    setEmojiPickerOpen(false);
    form.setValue("icon", emoji.native);
  }

  function onColorSelect(color: any) {
    form.setValue("color", color.target.value);
  }


  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create a new list</DialogTitle>
        <DialogDescription>
          Choose a name, icon and color for your new list!
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreateListFormSubmit)} className="flex flex-col gap-6 pt-4 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 space-y-0">
                  <FormLabel className="min-w-12">Name</FormLabel>
                  <div className="flex flex-col gap-1">
                    <FormControl className="flex items-center">
                      <Input
                        placeholder="Enter a name" {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>

                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 space-y-0">
                  <FormLabel className="min-w-12">Icon</FormLabel>
                  <div className="flex flex-col gap-1">
                    <FormControl className="flex items-center">
                      <div className="relative">
                        <Dialog modal={false} open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" type="button" className="w-min text-lg">{form.getValues().icon}</Button>
                          </DialogTrigger>
                          <DialogContent hideCloseButton={true} className="w-min bg-transparent border-none shadow-none">
                            <Picker data={emojiData} onEmojiSelect={onEmojiSelect} />
                          </DialogContent>
                        </Dialog>
                      </div>

                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 space-y-0">
                  <FormLabel className="min-w-12">Color</FormLabel>
                  <div className="flex flex-col gap-1">
                    <FormControl className="flex items-center">
                      <input
                        type="color"
                        className={buttonVariants({ variant: "outline" }) + " cursor-pointer"}
                        value={form.getValues().color}
                        onChange={onColorSelect}
                      />
                      {/* <Button variant="outline" type="button" className="w-min">🏀</Button> */}
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 space-y-0">
                  <FormLabel className="min-w-12">Public</FormLabel>
                  <div className="flex flex-col gap-1">
                    <FormControl>
                      <Switch />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-min mt-4"
                disabled={loading}
              >
                {loading && <Spinner className="mr-2 size-4" />}
                Create list
              </Button>
            </div>
          </form>
        </Form>
      </DialogHeader>
    </DialogContent>
  )
}