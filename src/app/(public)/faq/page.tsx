export default function FAQPage() {
	return (
		<div className="container mx-auto px-4 md:px-6 py-24 space-y-8 max-w-4xl min-h-[60vh]">
			<div className="space-y-4">
				<h1 className="text-4xl md:text-5xl font-black tracking-tight">
					Frequently Asked Questions
				</h1>
				<p className="text-xl text-muted-foreground">
					Everything you need to know about Plaude Poll.
				</p>
			</div>

			<div className="grid gap-12 pt-8">
				<div className="space-y-4">
					<h3 className="text-2xl font-bold">Is Plaude Poll free?</h3>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Yes! Our basic polling features are completely free for everyone. We
						believe in providing simple, accessible tools for everyone to gather
						feedback.
					</p>
				</div>
				<div className="space-y-4">
					<h3 className="text-2xl font-bold">Do I need an account to vote?</h3>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Yes, we require a quick signup to vote. This helps us ensure the
						integrity of our polls by preventing fraudulent voting and providing
						a more reliable experience for creators.
					</p>
				</div>
				<div className="space-y-4">
					<h3 className="text-2xl font-bold">Can I see live results?</h3>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Absolutely! Once you've voted, you can see real-time analytics and
						charts showing exactly how the community is responding.
					</p>
				</div>
			</div>
		</div>
	);
}
