"use client";

import { cn } from "@/lib/utils";

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default "medium"
   */
  size?: "small" | "medium" | "large" | "xl";
  
  /**
   * Color variant of the spinner
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  
  /**
   * Text to display below the spinner
   */
  text?: string;
  
  /**
   * Whether to show the spinner
   * @default true
   */
  visible?: boolean;
  
  /**
   * Accessibility label for screen readers
   * @default "Loading"
   */
  "aria-label"?: string;
  
  /**
   * Whether to include role="status" for accessibility
   * @default true
   */
  includeRole?: boolean;
}

/**
 * Size configuration mapping
 */
const sizeConfig = {
  small: "w-4 h-4",
  medium: "w-6 h-6", 
  large: "w-8 h-8",
  xl: "w-12 h-12",
} as const;

/**
 * Color variant configuration mapping
 */
const variantConfig = {
  primary: "border-blue-600",
  secondary: "border-gray-600",
  success: "border-green-600",
  warning: "border-yellow-600",
  error: "border-red-600",
} as const;

/**
 * LoadingSpinner component - A customizable loading spinner with multiple size and color variants
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LoadingSpinner />
 * 
 * // With custom size and text
 * <LoadingSpinner size="large" text="Loading data..." />
 * 
 * // With custom variant and styling
 * <LoadingSpinner 
 *   variant="success" 
 *   size="xl" 
 *   className="mx-auto my-4"
 *   text="Saving changes..."
 * />
 * ```
 */
export function LoadingSpinner({
  size = "medium",
  variant = "primary",
  className,
  text,
  visible = true,
  "aria-label": ariaLabel = "Loading",
  includeRole = true,
}: LoadingSpinnerProps) {
  // Early return if not visible
  if (!visible) return null;

  const spinnerClasses = cn(
    // Base spinner styles
    "animate-spin rounded-full border-2 border-solid",
    // Size configuration
    sizeConfig[size],
    // Color variant configuration
    variantConfig[variant],
    // Additional classes
    className
  );

  const containerProps = includeRole ? {
    role: "status" as const,
    "aria-label": ariaLabel,
  } : {};

  return (
    <div 
      className="flex flex-col items-center justify-center gap-2"
      {...containerProps}
    >
      <div className={spinnerClasses} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Full screen loading spinner overlay
 * 
 * @example
 * ```tsx
 * <LoadingSpinnerOverlay text="Loading application..." />
 * ```
 */
export function LoadingSpinnerOverlay({
  text = "Loading...",
  className,
  "aria-label": ariaLabel = "Loading application",
}: Omit<LoadingSpinnerProps, "size" | "variant" | "visible">) {
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
        className
      )}
      role="status"
      aria-label={ariaLabel}
    >
      <LoadingSpinner 
        size="xl" 
        variant="primary" 
        text={text}
        includeRole={false}
      />
    </div>
  );
}

/**
 * Inline loading spinner for buttons and small spaces
 * 
 * @example
 * ```tsx
 * <button disabled>
 *   <LoadingSpinnerInline size="small" />
 *   Saving...
 * </button>
 * ```
 */
export function LoadingSpinnerInline({
  size = "small",
  variant = "primary",
  className,
}: Omit<LoadingSpinnerProps, "text" | "visible" | "aria-label">) {
  const spinnerClasses = cn(
    "animate-spin rounded-full border-2 border-solid",
    sizeConfig[size],
    variantConfig[variant],
    className
  );

  return (
    <div 
      className={spinnerClasses}
      role="status"
      aria-label="Loading"
    />
  );
}
