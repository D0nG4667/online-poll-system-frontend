import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	title: string;
	description: string;
	icon: LucideIcon;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

export function EmptyState({
	title,
	description,
	icon: Icon,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed text-center animate-in fade-in-50",
				className,
			)}
		>
			<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<Icon className="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 className="mt-4 text-lg font-semibold">{title}</h3>
			<p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
				{description}
			</p>
			{action && (
				<Button onClick={action.onClick} variant="unicorn" size="lg">
					{action.label}
				</Button>
			)}
		</div>
	);
}
