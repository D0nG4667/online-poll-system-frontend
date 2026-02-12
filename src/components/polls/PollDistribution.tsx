"use client";

import {
	Copy,
	Download,
	ExternalLink,
	Facebook,
	Mail,
	MessageCircle,
	Twitter,
} from "lucide-react";
import { useQRCode } from "next-qrcode";
import { useState } from "react";
import {
	EmailShareButton,
	FacebookShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from "react-share";
import { toast } from "sonner";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { copyToClipboard, getEmbedCode, getPollUrl } from "@/lib/share-utils";
import { useGetPollDistributionDataQuery } from "@/services/analyticsApi";

interface PollDistributionProps {
	pollId: string | number;
	pollSlug?: string;
	title: string;
	initialTitle?: string;
	initialDescription?: string;
}

export function PollDistribution({
	pollId,
	pollSlug: initialSlug,
	title: defaultTitle,
	initialTitle,
	initialDescription,
}: PollDistributionProps) {
	const { Canvas } = useQRCode();
	// Prefer fetching by slug if available (cleaner network logs), otherwise ID
	const queryParam = initialSlug || pollId.toString();
	const { data: fetchedPoll, isLoading } =
		useGetPollDistributionDataQuery(queryParam);

	const title = fetchedPoll?.title || initialTitle || defaultTitle;
	const description = fetchedPoll?.description || initialDescription || "";

	// Determine if we're still waiting for essential data (slug)
	// If initialSlug is provided, we can show that immediately.
	// Otherwise, we wait for the query to return the slug.
	const isResolvingSlug = !initialSlug && isLoading;
	const effectiveSlug = fetchedPoll?.slug || initialSlug;

	// Only fallback to ID if we are done loading and strictly have no slug (backend issue)
	// But we try to hide this state if possible during loading.
	const displayUrl =
		isResolvingSlug || !origin ? "" : getPollUrl(effectiveSlug, pollId, origin);

	const displayEmbedCode =
		isResolvingSlug || !origin
			? ""
			: getEmbedCode(effectiveSlug || "", pollId, origin);

	const handleCopy = async (text: string, label: string) => {
		if (!text) return;
		const success = await copyToClipboard(text);
		if (success) {
			toast.success(`${label} copied to clipboard`);
		} else {
			toast.error(`Failed to copy ${label}`);
		}
	};

	const downloadQRCode = () => {
		const canvas = document.querySelector("canvas");
		if (canvas) {
			const url = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.download = `poll-${pollId}-qr.png`;
			link.href = url;
			link.click();
			toast.success("QR code downloaded");
		}
	};

	return (
		<Card className="w-full bg-background/50 backdrop-blur-xl border-primary/10">
			<CardHeader>
				<CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
					Distribute Poll
				</CardTitle>
				<CardDescription>
					Share your poll with the world using links, QR codes, or embeds.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="link" className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-6">
						<TabsTrigger value="link">Link</TabsTrigger>
						<TabsTrigger value="qr">QR Code</TabsTrigger>
						<TabsTrigger value="embed">Embed</TabsTrigger>
					</TabsList>

					<TabsContent value="link" className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="poll-link">Shareable Link</Label>
							<div className="flex gap-2">
								{isResolvingSlug ? (
									<Skeleton className="h-10 w-full rounded-md" />
								) : (
									<Input
										id="poll-link"
										value={displayUrl}
										readOnly
										className="bg-muted/30 border-primary/5 focus-visible:ring-primary/20"
									/>
								)}
								<Button
									variant="outline"
									size="icon"
									onClick={() => handleCopy(displayUrl, "Link")}
									disabled={isResolvingSlug}
									className="shrink-0 border-primary/10 hover:bg-primary/5"
								>
									<Copy className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									asChild
									disabled={isResolvingSlug}
									className="shrink-0 border-primary/10 hover:bg-primary/5"
								>
									{isResolvingSlug ? (
										<span className="h-4 w-4" />
									) : (
										<a
											href={displayUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<ExternalLink className="h-4 w-4" />
										</a>
									)}
								</Button>
							</div>
						</div>

						<div className="space-y-4 pt-4 border-t border-primary/5">
							<Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
								Social Sharing
							</Label>
							<div className="flex gap-4">
								{isResolvingSlug ? (
									<div className="flex gap-4">
										{[1, 2, 3, 4].map((i) => (
											<Skeleton key={i} className="h-9 w-9 rounded-xl" />
										))}
									</div>
								) : (
									<>
										<TwitterShareButton url={displayUrl} title={title}>
											<Button
												variant="ghost"
												size="icon"
												className="hover:text-sky-500 hover:bg-sky-500/10"
												asChild
											>
												<span>
													<Twitter className="h-5 w-5" />
												</span>
											</Button>
										</TwitterShareButton>
										<FacebookShareButton
											url={displayUrl}
											hashtag={`#${title.replace(/\s+/g, "")} #PlaudePoll`}
										>
											<Button
												variant="ghost"
												size="icon"
												className="hover:text-blue-600 hover:bg-blue-600/10"
												asChild
											>
												<span>
													<Facebook className="h-5 w-5" />
												</span>
											</Button>
										</FacebookShareButton>
										<WhatsappShareButton url={displayUrl} title={title}>
											<Button
												variant="ghost"
												size="icon"
												className="hover:text-green-500 hover:bg-green-500/10"
												asChild
											>
												<span>
													<MessageCircle className="h-5 w-5" />
												</span>
											</Button>
										</WhatsappShareButton>
										<EmailShareButton
											url={displayUrl}
											subject={`Vote in my poll: ${title}`}
											body={
												description
													? `${description}\n\nCheck out this poll:`
													: "Hey, check out this poll:"
											}
										>
											<Button
												variant="ghost"
												size="icon"
												className="hover:text-primary hover:bg-primary/10"
												asChild
											>
												<span>
													<Mail className="h-5 w-5" />
												</span>
											</Button>
										</EmailShareButton>
									</>
								)}
							</div>
						</div>
					</TabsContent>

					<TabsContent
						value="qr"
						className="flex flex-col items-center gap-6 pt-2"
					>
						<div className="p-6 bg-white rounded-2xl shadow-inner-lg">
							{isResolvingSlug ? (
								<Skeleton className="h-[200px] w-[200px]" />
							) : (
								<Canvas
									text={displayUrl}
									options={{
										errorCorrectionLevel: "M",
										margin: 2,
										scale: 4,
										width: 200,
										color: {
											dark: "#000000",
											light: "#FFFFFF",
										},
									}}
								/>
							)}
						</div>
						<Button
							variant="unicorn"
							onClick={downloadQRCode}
							disabled={isResolvingSlug}
							className="w-full max-w-[200px]"
						>
							<Download className="mr-2 h-4 w-4" />
							Download PNG
						</Button>
					</TabsContent>

					<TabsContent value="embed" className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="embed-code">Embed Snippet</Label>
							<div className="flex gap-2">
								{isResolvingSlug ? (
									<Skeleton className="w-full h-[100px] rounded-md" />
								) : (
									<textarea
										id="embed-code"
										value={displayEmbedCode}
										readOnly
										className="w-full min-h-[100px] p-3 text-xs font-mono bg-muted/30 border border-primary/5 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
									/>
								)}
							</div>
							<Button
								variant="outline"
								className="w-full border-primary/10 hover:bg-primary/5"
								onClick={() => handleCopy(displayEmbedCode, "Embed code")}
								disabled={isResolvingSlug}
							>
								<Copy className="mr-2 h-4 w-4" />
								Copy Embed Code
							</Button>
						</div>
						<div className="pt-4 border-t border-primary/5">
							<Label className="text-xs text-muted-foreground block mb-2 uppercase tracking-tight">
								Preview
							</Label>
							<div className="w-full h-40 bg-muted/20 border border-dashed border-primary/10 rounded-md flex items-center justify-center overflow-hidden">
								<p className="text-xs text-muted-foreground px-4 text-center">
									Your poll will appear in an iframe with 600px height.
								</p>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
