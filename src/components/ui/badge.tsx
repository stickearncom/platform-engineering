import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border-0 px-2 py-0.5 text-[11px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-indigo-50 text-indigo-700',
        secondary:  'bg-zinc-100 text-zinc-600',
        destructive: 'bg-red-50 text-red-600',
        outline:    'border border-border bg-transparent text-foreground',
        success:    'bg-emerald-50 text-emerald-700',
        warning:    'bg-amber-50 text-amber-700',
        info:       'bg-blue-50 text-blue-700',
        purple:     'bg-purple-50 text-purple-700',
        orange:     'bg-orange-50 text-orange-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
