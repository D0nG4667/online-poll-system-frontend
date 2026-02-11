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
import { useUpdatePollMutation } from "@/services/pollsApi";
import type { Poll } from "@/types/poll";

const optionSchema = z.object({
	id: z.number().optional(),
	text: z.string().min(1, "Option text is required"),
});

const questionSchema = z.object({
	id: z.number().optional(),
	text: z.string().min(3, "Question text must be at least 3 characters"),
	question_type: z.enum(["single", "multiple", "text"]),
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

interface EditPollFormProps {
	poll: Poll;
}

export function EditPollForm({ poll }: EditPollFormProps) {
	const router = useRouter();
	const [updatePoll] = useUpdatePollMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PollFormValues>({
		resolver: zodResolver(pollSchema),
		defaultValues: {
			title: poll.title,
			description: poll.description || "",
			is_active: poll.is_active,
			is_open: poll.is_open,
			start_date: new Date(poll.start_date).toISOString().split("T")[0],
			end_date: poll.end_date
				? new Date(poll.end_date).toISOString().split("T")[0]
				: "",
			questions: poll.questions.map((q) => ({
				id: q.id,
				text: q.text,
				question_type: q.question_type as "single" | "multiple" | "text",
				options: q.options.map((o) => ({
					id: o.id,
					text: o.text || "",
				})),
			})),
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

	const onSubmit = async (values: PollFormValues) => {
		setIsSubmitting(true);
		try {
			await updatePoll({ id: poll.id, data: values }).unwrap();
			toast.success("Poll updated successfully! ✨");
			router.push("/dashboard/polls");
		} catch (error) {
			toast.error("Failed to update poll. Please check your data.");
			console.error("Update error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
			{/* Basic Info */}
			<Card className="border-none shadow-lg bg-white/80 dark:bg-muted/10 backdrop-blur-sm rounded-2xl overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-orange-500/5 to-peach-500/5 border-b border-muted/20">
					<CardTitle className="text-xl flex items-center gap-2">
						📋 Core Details
					</CardTitle>
					<CardDescription>
						Update the basic information of your poll
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title" className="text-sm font-semibold">
							Title
						</Label>
						<Input
							id="title"
							placeholder="What is your poll about?"
							className="rounded-xl border-muted/30 focus-visible:ring-orange-500 h-10"
							{...form.register("title")}
						/>
						{form.formState.errors.title && (
							<p className="text-xs text-red-500">
								{form.formState.errors.title.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="description" className="text-sm font-semibold">
							Description (Optional)
						</Label>
						<Textarea
							id="description"
							placeholder="Provide some context..."
							className="rounded-xl border-muted/30 focus-visible:ring-orange-500 min-h-[100px]"
							{...form.register("description")}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Settings */}
			<Card className="border-none shadow-lg bg-white/80 dark:bg-muted/10 backdrop-blur-sm rounded-2xl overflow-hidden">
				<CardHeader className="border-b border-muted/20">
					<CardTitle className="text-xl flex items-center gap-2">
						⚙️ Visibility & Status
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-6 grid gap-6 md:grid-cols-2">
					<div className="flex items-center justify-between p-4 rounded-xl border border-muted/30">
						<div className="space-y-0.5">
							<Label className="text-sm font-semibold">Active Status</Label>
							<p className="text-xs text-muted-foreground">
								Is this poll currently active?
							</p>
						</div>
						<Switch
							checked={form.watch("is_active")}
							onCheckedChange={(checked) => form.setValue("is_active", checked)}
						/>
					</div>
					<div className="flex items-center justify-between p-4 rounded-xl border border-muted/30">
						<div className="space-y-0.5">
							<Label className="text-sm font-semibold">Open for Voting</Label>
							<p className="text-xs text-muted-foreground">
								Can people still vote?
							</p>
						</div>
						<Switch
							checked={form.watch("is_open")}
							onCheckedChange={(checked) => form.setValue("is_open", checked)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Questions */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold flex items-center gap-2 px-1">
						❓ Questions
					</h3>
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
						className="rounded-xl border-orange-500/30 text-orange-600 hover:bg-orange-500/5"
					>
						<Plus className="mr-2 h-4 w-4" /> Add Question
					</Button>
				</div>

				{questionFields.map((field, index) => (
					<Card
						key={field.id}
						className="border-none shadow-md rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
					>
						<CardHeader className="flex flex-row items-center justify-between py-4 bg-muted/20 border-b border-muted/20">
							<CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
								Question #{index + 1}
							</CardTitle>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => removeQuestion(index)}
								className="text-red-500 hover:text-red-700 hover:bg-red-50"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent className="pt-6 space-y-4">
							<div className="space-y-2">
								<Input
									placeholder="Ask your question here..."
									className="rounded-xl border-muted/30 focus-visible:ring-orange-500 h-10 font-medium"
									{...form.register(`questions.${index}.text` as const)}
								/>
								{form.formState.errors.questions?.[index]?.text && (
									<p className="text-xs text-red-500">
										{form.formState.errors.questions?.[index]?.text?.message}
									</p>
								)}
							</div>

							<div className="space-y-3">
								<Label className="text-xs font-bold uppercase text-muted-foreground px-1">
									Options
								</Label>
								<QuestionOptions
									questionIndex={index}
									control={form.control}
									register={form.register}
									errors={form.formState.errors}
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex items-center justify-end gap-4 pt-4">
				<Button
					type="button"
					variant="ghost"
					onClick={() => router.push("/dashboard/polls")}
					disabled={isSubmitting}
					className="rounded-xl"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="unicorn"
					disabled={isSubmitting}
					className="px-8 h-12 rounded-xl text-lg font-bold shadow-xl shadow-orange-500/20"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							Saving Changes...
						</>
					) : (
						<>
							<Save className="mr-2 h-5 w-5" />
							Save Poll Changes
						</>
					)}
				</Button>
			</div>
		</form>
	);
}

function QuestionOptions({
	questionIndex,
	control,
	register,
	errors,
}: {
	questionIndex: number;
	control: Control<PollFormValues>;
	register: UseFormRegister<PollFormValues>;
	errors: FieldErrors<PollFormValues>;
}) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: `questions.${questionIndex}.options` as const,
	});

	return (
		<div className="space-y-3">
			{fields.map((field, index) => (
				<div
					key={field.id}
					className="flex items-center gap-2 group animate-in fade-in slide-in-from-left-2 duration-300"
				>
					<div className="flex-1">
						<Input
							placeholder={`Option ${index + 1}`}
							className="rounded-xl border-muted/20 focus-visible:ring-orange-500 h-9 bg-muted/5 group-hover:bg-white transition-colors"
							{...register(
								`questions.${questionIndex}.options.${index}.text` as const,
							)}
						/>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => remove(index)}
						disabled={fields.length <= 2}
						className="h-9 w-9 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			))}

			<div className="pt-1">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => append({ text: "" })}
					className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg px-2"
				>
					<Plus className="mr-1 h-3 w-3" /> Add another option
				</Button>
			</div>

			{errors.questions?.[questionIndex]?.options && (
				<p className="text-xs text-red-500 mt-1">
					{errors.questions?.[questionIndex]?.options?.message}
				</p>
			)}
		</div>
	);
}
