import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                help: "border-transparent bg-[var(--color-cat-help-bg)] text-[var(--color-cat-help-text)] hover:opacity-80",
                personals: "border-transparent bg-[var(--color-cat-personals-bg)] text-[var(--color-cat-personals-text)] hover:opacity-80",
                alert: "border-transparent bg-[var(--color-cat-alert-bg)] text-[var(--color-cat-alert-text)] hover:opacity-80",
                market: "border-transparent bg-[var(--color-cat-market-bg)] text-[var(--color-cat-market-text)] hover:opacity-80",
                musings: "border-transparent bg-[var(--color-cat-musings-bg)] text-[var(--color-cat-musings-text)] hover:opacity-80",
                appreciation: "border-transparent bg-[var(--color-cat-appreciation-bg)] text-[var(--color-cat-appreciation-text)] hover:opacity-80",
                question: "border-transparent bg-[var(--color-cat-question-bg)] text-[var(--color-cat-question-text)] hover:opacity-80",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
