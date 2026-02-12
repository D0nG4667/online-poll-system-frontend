import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox"; // For future multiple choice support
import { cn } from "@/lib/utils";
import type { Question } from "@/types/poll";

interface QuestionCardProps {
	question: Question;
	selectedOption: number | null;
	onSelectOption: (optionId: number) => void;
	disabled?: boolean;
}

export function QuestionCard({
	question,
	selectedOption,
	onSelectOption,
	disabled,
}: QuestionCardProps) {
	return (
		<Card className="glass-card w-full">
			<CardHeader>
				<CardTitle className="text-xl">{question.text}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-6">
					{question.question_type === "single" && (
						<RadioGroup
							disabled={disabled}
							value={selectedOption?.toString()}
							onValueChange={(val: string) => onSelectOption(parseInt(val, 10))}
						>
							{question.options.map((option) => (
								<div
									key={option.id}
									className={cn(
										"relative flex items-center space-x-2 border rounded-lg p-4 transition-colors",
										disabled
											? "opacity-50 cursor-not-allowed"
											: "hover:bg-muted/50 cursor-pointer",
									)}
								>
									<RadioGroupItem
										value={option.id.toString()}
										id={`option-${option.id}`}
									/>
									<Label
										htmlFor={`option-${option.id}`}
										className={cn(
											"flex-1 after:absolute after:inset-0",
											disabled ? "cursor-not-allowed" : "cursor-pointer",
										)}
									>
										{option.text}
									</Label>
								</div>
							))}
						</RadioGroup>
					)}
					{/* Placeholder for multiple choice or text input */}
					{question.question_type !== "single" && (
						<p className="text-muted-foreground text-sm italic">
							Unsupported question type: {question.question_type}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
