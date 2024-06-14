import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {StorageConstants} from "@/lib/services/StorageConstants";
import {RedirectType, redirect} from "next/navigation";
import { IxApiError } from "./models/index/core/IxApiError";
import { IxApiErrorResponse } from "./services/IxApiErrorResponse";
import { QueryClient } from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkForAuthenticationError(error: Error | null): boolean {
  if (error instanceof IxApiError && error.ixApiErrorResponse == IxApiErrorResponse.NOT_AUTHENTICATED) {
    return true
  } else {
    return false
  }
}

/**
 * Stores the current path and query in session storage and redirects the user to /auth/welcome
 */
export function redirectToLogin() {
  const pathWithQuery = location.pathname + location.search;
  sessionStorage.setItem(StorageConstants.AUTH_REDIRECT_URI, pathWithQuery)
  redirect("/auth/welcome")
}

/**
 * Redirects the user to the route he was visiting before prompted to login
 */
export function redirectOnLoginSuccess(queryClient: QueryClient) {
  const previousPath = sessionStorage.getItem(StorageConstants.AUTH_REDIRECT_URI) ?? "/"
  queryClient.invalidateQueries()
  redirect(previousPath, RedirectType.replace)
}