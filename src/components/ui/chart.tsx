import * as React from "react"

// Simple chart container component
export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

// Simple tooltip component
export const ChartTooltip = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
}

// Simple tooltip content
export const ChartTooltipContent = ({ children }: { children?: React.ReactNode }) => {
  return <div className="rounded-lg bg-white p-2 shadow-md border">{children}</div>
}
