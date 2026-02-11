export default function PolicyPage() {
	return (
		<div className="container mx-auto px-4 md:px-6 py-24 space-y-8 max-w-4xl min-h-[60vh]">
			<div className="space-y-4">
				<h1 className="text-4xl md:text-5xl font-black tracking-tight">
					Cookie Policy
				</h1>
				<p className="text-lg text-muted-foreground italic">
					Last Updated: February 11, 2026
				</p>
			</div>

			<div className="prose dark:prose-invert max-w-none space-y-12 pt-8">
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">1. What are cookies?</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Cookies are small text files stored on your device that help
						websites work more efficiently. They allow us to remember your
						preferences and provide a more personalized experience.
					</p>
				</section>
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">2. How we use them</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Plaude Poll uses essential cookies to keep you signed in while
						voting and to prevent duplicate votes from the same user, ensuring
						that all poll results remain fair and accurate.
					</p>
				</section>
				<section className="space-y-4">
					<h2 className="text-3xl font-bold">3. Managing Cookies</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Most browsers allow you to control cookies through their settings.
						However, disabling essential cookies may prevent you from voting or
						using certain features of the platform.
					</p>
				</section>
			</div>
		</div>
	);
}
