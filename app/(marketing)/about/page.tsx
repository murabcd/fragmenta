import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
	title: "About",
	description: "About Fragmenta",
};

const AboutPage = () => {
	return (
		<div className="w-full">
			<div className="max-w-3xl mx-auto text-center">
				<div className="flex flex-col relative">
					<h1 className="text-6xl font-bold mb-4">
						Your business deserves{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
							superpower
						</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-12">
						Fragmenta turn digital interactions into lasting personal
						connections.
					</p>
					<div className="flex justify-center space-x-4">
						<Button size="lg">
							<Link href="mailto:murad@fragmenta.ai">Talk to us</Link>
						</Button>
						<Button variant="outline" size="lg">
							<Link href="https://github.com/muradpm/fragmenta" target="_blank">
								View on Github
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
