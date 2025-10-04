import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * 
 * This function combines clsx for conditional classes and tailwind-merge for
 * intelligent merging of Tailwind classes, ensuring that conflicting classes
 * are resolved correctly (e.g., 'p-2 p-4' becomes 'p-4').
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * ```tsx
 * cn("p-2", "p-4", "bg-red-500") // "p-4 bg-red-500"
 * cn("text-sm", { "text-lg": isLarge }) // "text-sm" or "text-lg"
 * cn(className, "additional-class") // merges with existing className prop
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
