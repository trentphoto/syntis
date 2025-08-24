"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-green-50 group-[.toaster]:border-green-200 group-[.toaster]:text-green-800 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:border-green-800 dark:group-[.toaster]:text-green-200",
          error: "group-[.toaster]:bg-red-50 group-[.toaster]:border-red-200 group-[.toaster]:text-red-800 dark:group-[.toaster]:bg-red-950 dark:group-[.toaster]:border-red-800 dark:group-[.toaster]:text-red-200",
          warning: "group-[.toaster]:bg-yellow-50 group-[.toaster]:border-yellow-200 group-[.toaster]:text-yellow-800 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:border-yellow-800 dark:group-[.toaster]:text-yellow-200",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-800 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:border-blue-800 dark:group-[.toaster]:text-blue-200",
        },
        duration: 4000,
      }}
      icons={{
        success: <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />,
        error: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
        warning: <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
        info: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
