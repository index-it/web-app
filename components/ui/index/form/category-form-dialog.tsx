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
import emojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Switch } from "../../switch";
import {CategoryCreateFormSchema} from "@/components/form/schemas/category-create-form-schema";
import {CategoryEditFormSchema} from "@/components/form/schemas/category-edit-form-schema";

interface CategoryFormDialogContentProps {
  loading: boolean;
  edit: boolean;
  onFormSubmit: (data: z.infer<typeof CategoryEditFormSchema>) => void,
  defaultValues?: z.infer<typeof CategoryEditFormSchema>
}

export function CategoryFormDialogContent({ loading, edit, onFormSubmit, defaultValues }: CategoryFormDialogContentProps) {
  const form = useForm<z.infer<typeof CategoryEditFormSchema>>({
    resolver: zodResolver(CategoryEditFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      color: "#0000ff",
    },
  })

  // Destructure the reset method from the form object
  const { reset } = form;

  // Use useEffect to reset the form values when defaultValues changes
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function onColorSelect(color: any) {
    form.setValue("color", color.target.value);
  }


  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{edit ? "Edit this" : "Create a new"} category</DialogTitle>
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

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-min mt-4"
                disabled={loading}
              >
                {loading && <Spinner className="mr-2 size-4" />}
                {edit ? "Edit" : "Create"} category
              </Button>
            </div>
          </form>
        </Form>
      </DialogHeader>
    </DialogContent>
  )
}