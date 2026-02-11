import { Github, Linkedin, MessageSquare, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t border-border/40 py-12 md:py-20 bg-secondary/10">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8">
					<div className="col-span-2 space-y-6">
						<div className="flex items-center gap-2 font-black text-2xl tracking-tight">
							<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-black">
								P
							</div>
							Plaude Poll
						</div>
						<p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
							Making it easy to create instant, real-time polls and surveys for
							free. Trusted by millions worldwide.
						</p>
						<div className="flex gap-4">
							<Link
								href="https://github.com"
								className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<Github className="h-4 w-4" />
							</Link>
							<Link
								href="https://twitter.com"
								className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<Twitter className="h-4 w-4" />
							</Link>
							<Link
								href="https://linkedin.com"
								className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<Linkedin className="h-4 w-4" />
							</Link>
							<Link
								href="https://discord.com"
								className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<MessageSquare className="h-4 w-4" />
							</Link>
						</div>
					</div>
					<div className="space-y-4">
						<h4 className="font-bold text-xs uppercase tracking-widest text-primary">
							Solutions
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/dashboard/create"
									className="hover:text-primary transition-colors"
								>
									Poll Maker
								</Link>
							</li>
							<li>
								<Link
									href="/api/schema/swagger-ui/"
									className="hover:text-primary transition-colors"
								>
									Poll API
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h4 className="font-bold text-xs uppercase tracking-widest text-primary">
							Support
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/guides"
									className="hover:text-primary transition-colors"
								>
									Guides
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="hover:text-primary transition-colors"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h4 className="font-bold text-xs uppercase tracking-widest text-primary">
							Legal
						</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/privacy"
									className="hover:text-primary transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-primary transition-colors"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="/policy"
									className="hover:text-primary transition-colors"
								>
									Cookie Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-20 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground font-medium">
					© 2026 Plaude Poll. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
