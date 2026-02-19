"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Icons } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequestPasswordMutation } from "@/services/authApi";

const forgotPasswordSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [requestPassword] = useRequestPasswordMutation();

	const form = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: ForgotPasswordValues) {
		setIsLoading(true);
		try {
			const result = await requestPassword(data).unwrap();
			if (result.status === 200) {
				setIsSubmitted(true);
				toast.success("Reset link sent!");
			} else {
				toast.error(result.errors?.[0]?.message || "Something went wrong");
			}
		} catch (error: unknown) {
			const err = error as { data?: { errors?: Array<{ message: string }> } };
			toast.error(
				err.data?.errors?.[0]?.message || "Failed to send reset link",
			);
		} finally {
			setIsLoading(false);
		}
	}

	if (isSubmitted) {
		return (
			<div className="relative flex min-h-screen w-full flex-col items-center justify-center lg:px-0">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
					<Card className="border-shadow-sm">
						<CardHeader className="space-y-1 text-center">
							<div className="flex justify-center mb-4">
								<div className="rounded-full bg-primary/10 p-3">
									<Icons.mail className="h-6 w-6 text-primary" />
								</div>
							</div>
							<CardTitle className="text-2xl font-bold italic tracking-tight text-unicorn">
								Check your email
							</CardTitle>
							<CardDescription>
								We've sent a password reset link to{" "}
								<span className="font-medium text-foreground">
									{form.getValues("email")}
								</span>
							</CardDescription>
						</CardHeader>
						<CardFooter>
							<Button asChild variant="outline" className="w-full">
								<Link href="/signin">Back to Sign In</Link>
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center lg:px-0 bg-slate-50/50 dark:bg-transparent">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
				<Card className="border-shadow-sm">
					<CardHeader className="space-y-1 text-center">
						<div className="flex justify-center mb-4">
							<Logo iconClassName="h-10 w-10 text-primary" />
						</div>
						<CardTitle className="text-2xl font-bold italic tracking-tight text-unicorn">
							Forgot Password
						</CardTitle>
						<CardDescription>
							Enter your email address and we'll send you a link to reset your
							password.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="name@example.com"
													type="email"
													autoCapitalize="none"
													autoComplete="email"
													autoCorrect="off"
													disabled={isLoading}
													className="bg-muted/50"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									disabled={isLoading}
									variant="unicorn"
									className="w-full"
								>
									{isLoading && (
										<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
									)}
									Send Reset Link
								</Button>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<div className="text-center text-sm text-muted-foreground">
							<Link
								href="/signin"
								className="hover:text-primary underline underline-offset-4 decoration-primary/30"
							>
								Remembered your password? Sign In
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
