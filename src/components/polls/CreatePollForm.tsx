"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	type Control,
	type FieldErrors,
	type UseFormRegister,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateOptionMutation,
	useCreatePollMutation,
	useCreateQuestionMutation,
} from "@/services/pollsApi";

// Validation Schema
const optionSchema = z.object({
	text: z.string().min(1, "Option text is required"),
});

const questionSchema = z.object({
	text: z.string().min(3, "Question text must be at least 3 characters"),
	question_type: z.enum(["single", "multiple", "text"]),
	options: z.array(optionSchema).min(2, "At least 2 options are required"),
});

const pollSchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters"),
	description: z.string().optional(),
	is_active: z.boolean().optional(),
	is_open: z.boolean().optional(),
	start_date: z.string().min(1, "Start date is required"), // Ideally use date picker
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
					poll: poll.id,
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
			className="space-y-8 max-w-4xl mx-auto pb-20"
		>
			<div className="space-y-4">
				<div className="grid gap-2">
					<Label htmlFor="title">Poll Title</Label>
					<Input
						id="title"
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
						{...form.register("description")}
						disabled={isSubmitting}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="grid gap-2">
						<Label htmlFor="start_date">Start Date</Label>
						<Input
							type="date"
							id="start_date"
							{...form.register("start_date")}
							disabled={isSubmitting}
						/>
						{form.formState.errors.start_date && (
							<p className="text-red-500 text-sm">
								{form.formState.errors.start_date.message}
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="end_date">End Date (Optional)</Label>
						<Input
							type="date"
							id="end_date"
							{...form.register("end_date")}
							disabled={isSubmitting}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Questions</h2>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							appendQuestion({
								text: "",
								question_type: "single",
								options: [{ text: "" }, { text: "" }],
							})
						}
					>
						<Plus className="h-4 w-4 mr-2" /> Add Question
					</Button>
				</div>

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
		</form>
	);
}

interface QuestionFieldProps {
	index: number;
	control: Control<PollFormValues>;
	register: UseFormRegister<PollFormValues>;
	remove: () => void;
	errors?: any;
	isSubmitting: boolean;
}

// Sub-component for individual question fields (to keep main component cleaner)
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
		<Card className="relative border-l-4 border-l-primary/50">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
				onClick={remove}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">Question {index + 1}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-2">
					<Label>Question Text</Label>
					<Input
						{...register(`questions.${index}.text`)}
						placeholder="What do you want to ask?"
						disabled={isSubmitting}
					/>
					{errors?.text && (
						<p className="text-red-500 text-sm">{errors.text.message}</p>
					)}
				</div>

				<div className="grid gap-2">
					<Label>Type</Label>
					{/* Select component usage with react-hook-form Controller would be better, but native select for speed/MVP */}
					<select
						{...register(`questions.${index}.question_type`)}
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isSubmitting}
					>
						<option value="single">Single Choice</option>
						<option value="multiple">Multiple Choice</option>
					</select>
				</div>

				<div className="space-y-2 pl-4 border-l-2">
					<Label>Options</Label>
					{optionFields.map((opt, optIndex) => (
						<div key={opt.id} className="flex items-center gap-2">
							<Input
								{...register(`questions.${index}.options.${optIndex}.text`)}
								placeholder={`Option ${optIndex + 1}`}
								className="h-9"
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
						className="text-xs"
						onClick={() => appendOption({ text: "" })}
					>
						<Plus className="h-3 w-3 mr-1" /> Add Option
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
