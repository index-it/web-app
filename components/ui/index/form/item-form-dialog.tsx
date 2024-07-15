import { ListCreateFormSchema } from "@/components/form/schemas/list-create-form-schema";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../dialog";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "../../button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../../form";
import { Input } from "../../input";
import { Spinner } from "../../spinner";
import {useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {ItemCreateFormSchema} from "@/components/form/schemas/item-create-form-schema";
import {IxCategory} from "@/lib/models/index/IxCategory";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ItemEditFormSchema} from "@/components/form/schemas/item-edit-form-schema";

interface ItemFormDialogContentProps {
  loading: boolean;
  edit: boolean;
  categories: IxCategory[],
  onFormSubmit: (data: z.infer<typeof ItemEditFormSchema>) => void,
  defaultValues?: z.infer<typeof ItemEditFormSchema>
}

export function ItemFormDialogContent({ loading, edit, onFormSubmit, defaultValues, categories }: ItemFormDialogContentProps) {
  const form = useForm<z.infer<typeof ItemEditFormSchema>>({
    resolver: zodResolver(ItemEditFormSchema),
    defaultValues: defaultValues ?? {
      list_id: "",
      name: "",
      category_id: undefined,
      link: undefined,
    },
  })

  // Destructure the reset method from the form object
  const { reset } = form;

  // Use useEffect to reset the form values when defaultValues changes
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);


  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create a new category</DialogTitle>
        <DialogDescription>
          Choose a name and color for your category!
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-6 pt-4 w-full">
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
              name="category_id"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 space-y-0">
                  <FormLabel className="min-w-12 mr-2">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an optional category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 space-y-0">
                  <FormLabel className="min-w-12">Link</FormLabel>
                  <div className="flex flex-col gap-1">
                    <FormControl className="flex items-center">
                      <Input
                        placeholder="Enter an optional link" {...field}
                      />
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
                {edit ? "Edit" : "Create"} item
              </Button>
            </div>
          </form>
        </Form>
      </DialogHeader>
    </DialogContent>
  )
}