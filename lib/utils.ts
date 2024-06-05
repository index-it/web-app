import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {StorageConstants} from "@/lib/services/StorageConstants";
import {RedirectType, redirect} from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
export function redirectOnLoginSuccess() {
  const previousPath = sessionStorage.getItem(StorageConstants.AUTH_REDIRECT_URI) ?? "/"
  redirect(previousPath, RedirectType.replace)
}