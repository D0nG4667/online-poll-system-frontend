"use client";

import { ShieldAlert, Sparkles } from "lucide-react";

export default function CookiePolicyPage() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Decorative blurs */}
			<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />
			<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -z-10" />

			<div className="container mx-auto px-4 md:px-6 py-24 md:py-32 max-w-4xl relative z-10">
				<div className="space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center md:text-left">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-bold uppercase tracking-widest">
						<ShieldAlert className="h-3 w-3" />
						Privacy Control
					</div>
					<h1 className="text-4xl md:text-6xl font-black tracking-tight">
						Cookie Policy
					</h1>
					<p className="text-lg text-muted-foreground italic flex items-center justify-center md:justify-start gap-2">
						<Sparkles className="h-4 w-4 text-[#F36B21]" />
						Last Updated: February 11, 2026
					</p>
				</div>

				<div className="prose prose-slate prose-lg dark:prose-invert max-w-none space-y-16 pt-8">
					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-800 underline decoration-purple-500/30 underline-offset-8">
							What are cookies?
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Cookies are small text files that are stored on your device when
							you browse websites. They are widely used to make websites work
							more efficiently and provide information to the owners of the
							site.
						</p>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-800 underline decoration-orange-500/30 underline-offset-8">
							How we use them
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Plaude Poll uses cookies for several critical purposes:
						</p>
						<div className="grid md:grid-cols-2 gap-4 not-prose">
							<CookieInfoCard
								title="Essential"
								description="Required for authentication and secure voting. Without these, you cannot use the platform features."
							/>
							<CookieInfoCard
								title="Performance"
								description="Help us understand how visitors interact with our pages to improve site speed and reliability."
							/>
							<CookieInfoCard
								title="Preferences"
								description="Remember your theme (light/dark mode) and layout choices for a consistent experience."
							/>
							<CookieInfoCard
								title="Security"
								description="Critical for detecting bot activities and preventing unauthorized account access."
							/>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-800 underline decoration-indigo-500/30 underline-offset-8">
							Managing Cookies
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Most web browsers allow some control of most cookies through the
							browser settings. However, please note that blocking essential
							cookies may impact your ability to vote or sign in.
						</p>
					</section>

					<section className="pt-12 border-t border-border">
						<p className="text-sm text-center text-muted-foreground">
							For more detailed privacy information, please visit our{" "}
							<a
								href="/privacy"
								className="text-indigo-600 font-bold hover:underline"
							>
								Privacy Policy
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}

function CookieInfoCard({ title, description }: any) {
	return (
		<div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
			<h4 className="font-bold text-slate-800 mb-2">{title}</h4>
			<p className="text-sm text-muted-foreground leading-relaxed">
				{description}
			</p>
		</div>
	);
}
