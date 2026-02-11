"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Icons } from "@/components/icons";
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
import {
	useResetPasswordMutation,
	useValidateResetKeyQuery,
} from "@/services/authApi";

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm({ resetKey }: { resetKey: string }) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [resetPassword] = useResetPasswordMutation();
	const {
		data: keyInfo,
		isLoading: isKeyValidating,
		isError,
	} = useValidateResetKeyQuery(resetKey);

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: ResetPasswordValues) {
		setIsLoading(true);
		try {
			const result = await resetPassword({
				key: resetKey,
				password: data.password,
			}).unwrap();

			if (result.status === 200) {
				toast.success("Password reset successful!");
				router.push("/signin");
			} else {
				toast.error(result.errors?.[0]?.message || "Failed to reset password");
			}
		} catch (error: unknown) {
			const err = error as { data?: { errors?: Array<{ message: string }> } };
			toast.error(err.data?.errors?.[0]?.message || "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	if (isKeyValidating) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 p-8">
				<Icons.spinner className="h-10 w-10 animate-spin text-primary" />
				<p className="text-sm font-medium text-muted-foreground animate-pulse">
					Validating security link...
				</p>
			</div>
		);
	}

	if (isError || !keyInfo) {
		return (
			<Card className="border-shadow-sm w-full max-w-[400px]">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-4">
						<div className="rounded-full bg-destructive/10 p-3">
							<Icons.warning className="h-8 w-8 text-destructive" />
						</div>
					</div>
					<CardTitle className="text-xl font-bold">
						Invalid or Expired Link
					</CardTitle>
					<CardDescription>
						This password reset link is invalid or has already expired.
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button asChild variant="outline" className="w-full">
						<Link href="/forgot-password">Request New Link</Link>
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="border-shadow-sm w-full max-w-[400px]">
			<CardHeader className="space-y-1 text-center">
				<div className="flex justify-center mb-4">
					<Icons.logo className="h-10 w-10 text-primary" />
				</div>
				<CardTitle className="text-2xl font-bold italic tracking-tight text-unicorn">
					Set New Password
				</CardTitle>
				<CardDescription>
					Enter a secure new password for your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											placeholder="********"
											type="password"
											autoComplete="new-password"
											disabled={isLoading}
											className="bg-muted/50"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<Input
											placeholder="********"
											type="password"
											autoComplete="new-password"
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
							className="w-full mt-2"
						>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Reset Password
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
			<Suspense fallback={<Icons.spinner className="h-8 w-8 animate-spin" />}>
				<ResetPasswordContent />
			</Suspense>
		</div>
	);
}

function ResetPasswordContent() {
	const searchParams = useSearchParams();
	const key = searchParams.get("key");

	if (!key) {
		return (
			<Card className="border-shadow-sm w-full max-w-[400px]">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-4">
						<div className="rounded-full bg-destructive/10 p-3">
							<Icons.warning className="h-8 w-8 text-destructive" />
						</div>
					</div>
					<CardTitle className="text-xl font-bold text-destructive">
						Missing Reset Key
					</CardTitle>
					<CardDescription>
						Please use the link provided in your email to reset your password.
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button asChild variant="outline" className="w-full">
						<Link href="/signin">Back to Sign In</Link>
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return <ResetPasswordForm resetKey={key} />;
}
