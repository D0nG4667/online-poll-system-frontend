import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	hasNext: boolean;
	hasPrevious: boolean;
}

export function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
	hasNext,
	hasPrevious,
}: PaginationControlsProps) {
	return (
		<div className="flex items-center justify-center space-x-2 py-4">
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={!hasPrevious}
				className="h-8 w-8 p-0"
			>
				<span className="sr-only">Go to previous page</span>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<div className="flex items-center space-x-2">
				<span className="text-sm font-medium">
					Page {currentPage} of {totalPages}
				</span>
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={!hasNext}
				className="h-8 w-8 p-0"
			>
				<span className="sr-only">Go to next page</span>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
