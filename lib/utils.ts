import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {StorageConstants} from "@/lib/services/StorageConstants";
import {redirect} from "next/navigation";
import { QueryClient } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Stores the current path and query in session storage and redirects the user to /auth/welcome
 */
export function redirect_to_login() {
  const path_with_query = location.pathname + location.search;
  sessionStorage.setItem(StorageConstants.AUTH_REDIRECT_URI, path_with_query)
  redirect("/auth/welcome")
}

/**
 * Redirects the user to the route he was visiting before prompted to login
 */
export function redirect_on_login_success(queryClient: QueryClient, router: AppRouterInstance) {
  const previousPath = sessionStorage.getItem(StorageConstants.AUTH_REDIRECT_URI) ?? "/"
  queryClient.invalidateQueries()
  router.replace(previousPath)
}