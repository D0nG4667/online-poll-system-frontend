"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	CalendarIcon,
	Loader2,
	Plus,
	Save,
	Settings,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	type Control,
	type UseFormRegister,
	useFieldArray,
	useForm,
} from "react-hook-form";

import { toast } from "sonner";
import * as z from "zod";
import { AIPromptDialog } from "@/components/ai/AIPromptDialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateOptionMutation,
	useCreatePollMutation,
	useCreateQuestionMutation,
} from "@/services/pollsApi";
import type { AIGeneratedQuestion } from "@/types/ai";

// Validation Schema
const optionSchema = z.object({
	text: z.string().min(1, "Option text is required"),
});

const questionSchema = z.object({
	text: z.string().min(3, "Question text must be at least 3 characters"),
	question_type: z.enum(["single", "multiple"]),
	order: z.number(),
	options: z.array(optionSchema).min(2, "At least 2 options are required"),
});

const pollSchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters"),
	description: z.string().optional(),
	is_active: z.boolean().optional(),
	is_open: z.boolean().optional(),
	start_date: z.string().min(1, "Start date is required"),
	end_date: z.string().optional(),
	questions: z.array(questionSchema).min(1, "At least 1 question is required"),
});

type PollFormValues = z.infer<typeof pollSchema>;

export function CreatePollForm() {
	const router = useRouter();
	const [createPoll] = useCreatePollMutation();
	const [createQuestion] = useCreateQuestionMutation();
	const [createOption] = useCreateOptionMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PollFormValues>({
		resolver: zodResolver(pollSchema),
		defaultValues: {
			title: "",
			description: "",
			is_active: true,
			is_open: true,
			start_date: new Date().toISOString().split("T")[0],
			questions: [
				{
					text: "",
					question_type: "single",
					options: [{ text: "" }, { text: "" }],
				},
			],
		},
	});

	const {
		fields: questionFields,
		append: appendQuestion,
		remove: removeQuestion,
	} = useFieldArray({
		control: form.control,
		name: "questions",
	});

	// Handle AI-generated poll data
	const handleAIGenerated = (data: {
		title: string;
		description: string;
		questions: AIGeneratedQuestion[];
	}) => {
		form.setValue("title", data.title, { shouldValidate: true });
		form.setValue("description", data.description, { shouldValidate: true });
		form.setValue(
			"questions",
			data.questions.map((q, idx) => ({
				text: q.text,
				question_type: q.question_type as "single" | "multiple",
				order: idx,
				options: q.options.map((o) => ({ text: o.text })),
			})),
			{ shouldValidate: true },
		);
		toast.success("Poll generated! Review and customize before saving.");
	};

	const handleSubmit = async (data: PollFormValues) => {
		setIsSubmitting(true);
		try {
			// 1. Create Poll
			const pollPayload = {
				title: data.title,
				description: data.description,
				start_date: new Date(data.start_date).toISOString(),
				end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
				is_active: data.is_active ?? true,
				is_open: data.is_open ?? true,
			};

			const poll = await createPoll(pollPayload).unwrap();

			if (!poll?.id) throw new Error("Failed to create poll");

			// 2. Create Questions sequentially
			for (let i = 0; i < data.questions.length; i++) {
				const q = data.questions[i];
				const questionPayload = {
					poll: poll.slug, // Use slug to satisfy backend SlugRelatedField
					text: q.text,
					question_type: q.question_type,
					order: i,
				};

				const question = await createQuestion(questionPayload).unwrap();

				if (!question?.id)
					throw new Error(`Failed to create question ${i + 1}`);

				// 3. Create Options sequentially
				for (let j = 0; j < q.options.length; j++) {
					const o = q.options[j];
					const optionPayload = {
						question: question.id,
						text: o.text,
						order: j,
					};
					await createOption(optionPayload).unwrap();
				}
			}

			toast.success("Poll created successfully!");
			router.push("/dashboard");
		} catch (error) {
			console.error("Creation Error:", error);
			toast.error("Failed to create poll. Check console for details.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={form.handleSubmit(handleSubmit)}
			className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto pb-20"
		>
			<div className="lg:col-span-2 space-y-8">
				{/* General Information Card */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Poll Details</CardTitle>
								<CardDescription>
									Basic information about your new poll.
								</CardDescription>
							</div>
							<AIPromptDialog onPollGenerated={handleAIGenerated} />
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="title">Poll Title</Label>
							<Input
								id="title"
								placeholder="e.g., Team Lunch Preferences"
								{...form.register("title")}
								disabled={isSubmitting}
							/>
							{form.formState.errors.title && (
								<p className="text-red-500 text-sm">
									{form.formState.errors.title.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Provide some context for your participants..."
								className="min-h-[100px]"
								{...form.register("description")}
								disabled={isSubmitting}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Questions Card */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<div>
							<CardTitle>Questions</CardTitle>
							<CardDescription>Define what you want to ask.</CardDescription>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								appendQuestion({
									text: "",
									question_type: "single",
									order: questionFields.length,
									options: [{ text: "" }, { text: "" }],
								})
							}
						>
							<Plus className="h-4 w-4 mr-2" /> Add Question
						</Button>
					</CardHeader>
					<CardContent className="space-y-6 pt-4">
						{questionFields.map((field, index) => (
							<QuestionField
								key={field.id}
								index={index}
								control={form.control}
								register={form.register}
								remove={() => removeQuestion(index)}
								errors={form.formState.errors.questions?.[index]}
								isSubmitting={isSubmitting}
							/>
						))}
						{form.formState.errors.questions && (
							<p className="text-red-500 text-sm text-center">
								{form.formState.errors.questions.message}
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="space-y-6">
				{/* Settings / Actions Side Panel */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Settings className="h-5 w-5" /> Settings
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="start_date">Start Date</Label>
								<div className="relative">
									<Input
										type="date"
										id="start_date"
										{...form.register("start_date")}
										disabled={isSubmitting}
									/>
									<CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
								</div>
								{form.formState.errors.start_date && (
									<p className="text-red-500 text-sm">
										{form.formState.errors.start_date.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="end_date">End Date (Optional)</Label>
								<div className="relative">
									<Input
										type="date"
										id="end_date"
										{...form.register("end_date")}
										disabled={isSubmitting}
									/>
									<CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
							<div className="space-y-0.5">
								<Label>Active Poll</Label>
								<p className="text-xs text-muted-foreground">
									Visible to users immediately
								</p>
							</div>
							<Switch
								checked={form.watch("is_active")}
								onCheckedChange={(checked) =>
									form.setValue("is_active", checked)
								}
								disabled={isSubmitting}
							/>
						</div>

						<Button
							type="submit"
							variant="unicorn"
							size="lg"
							className="w-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Save className="mr-2 h-4 w-4" />
							)}
							Create Poll
						</Button>
					</CardContent>
				</Card>
			</div>
		</form>
	);
}

interface QuestionFieldProps {
	index: number;
	control: Control<PollFormValues>;
	register: UseFormRegister<PollFormValues>;
	remove: () => void;
	// biome-ignore lint/suspicious/noExplicitAny: bypassed due to complex FieldErrors nesting
	errors?: any;
	isSubmitting: boolean;
}

function QuestionField({
	index,
	control,
	register,
	remove,
	errors,
	isSubmitting,
}: QuestionFieldProps) {
	const {
		fields: optionFields,
		append: appendOption,
		remove: removeOption,
	} = useFieldArray({
		control,
		name: `questions.${index}.options`,
	});

	return (
		<div className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-4">
			<div className="absolute top-4 right-4 z-10">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-muted-foreground hover:text-red-500"
					onClick={remove}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
						{index + 1}
					</span>
					<h4 className="text-sm font-medium">Question</h4>
				</div>

				<div className="grid gap-2">
					<Input
						{...register(`questions.${index}.text`)}
						placeholder="What would you like to ask?"
						className="font-medium"
						disabled={isSubmitting}
					/>
					{errors?.text && (
						<p className="text-red-500 text-sm">{errors.text.message}</p>
					)}
				</div>

				<div className="grid gap-2">
					<Label className="text-xs text-muted-foreground">Type</Label>
					<select
						{...register(`questions.${index}.question_type`)}
						className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isSubmitting}
					>
						<option value="single">Single Choice</option>
						<option value="multiple">Multiple Choice</option>
					</select>
				</div>

				<div className="space-y-3 pt-2">
					<Label className="text-xs text-muted-foreground">Options</Label>
					{optionFields.map((opt, optIndex) => (
						<div key={opt.id} className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
							<Input
								{...register(`questions.${index}.options.${optIndex}.text`)}
								placeholder={`Option ${optIndex + 1}`}
								className="h-8 text-sm"
								disabled={isSubmitting}
							/>
							{optionFields.length > 2 && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={() => removeOption(optIndex)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							)}
						</div>
					))}
					{errors?.options && (
						<p className="text-red-500 text-sm">
							{errors.options.message || "Options error"}
						</p>
					)}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="text-xs h-8"
						onClick={() => appendOption({ text: "" })}
					>
						<Plus className="h-3 w-3 mr-1" /> Add Option
					</Button>
				</div>
			</div>
		</div>
	);
}
