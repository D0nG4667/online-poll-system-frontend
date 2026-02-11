export default function PrivacyPage() {
	return (
		<div className="container mx-auto px-4 md:px-6 py-24 space-y-8 max-w-4xl min-h-[60vh]">
			<div className="space-y-4">
				<h1 className="text-4xl md:text-5xl font-black tracking-tight">
					Privacy Policy
				</h1>
				<p className="text-lg text-muted-foreground italic">
					Last Updated: February 11, 2026
				</p>
			</div>

			<div className="prose dark:prose-invert max-w-none space-y-12 pt-8">
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">1. Information We Collect</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						We only collect information necessary to provide our services. This
						includes your email address if you register for an account, and
						basic technical data to ensure the security and integrity of our
						voting system.
					</p>
				</section>
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">2. How We Use Data</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Your data is used to manage your polls, prevent duplicate or
						fraudulent voting, and improve the quality of Plaude Poll. We never
						sell your personal information to third parties.
					</p>
				</section>
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">3. Cookies</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						We use essential cookies to maintain your session and ensure that
						voting is fair and accurate. For more details, please see our Cookie
						Policy.
					</p>
				</section>
			</div>
		</div>
	);
}
