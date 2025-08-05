import { ImageResponse } from "next/og";

export async function GET() {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				height: "100%",
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
				letterSpacing: "-.02em",
				fontWeight: 700,
				background: "#0a0a0a",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						"radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					top: 42,
					left: 42,
					display: "flex",
					alignItems: "center",
					gap: "8px",
				}}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{
						color: "#ffffff",
					}}
					aria-hidden="true"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" />
					<path d="M11 9h4a2 2 0 0 0 2-2V3" />
					<circle cx="9" cy="9" r="2" />
					<path d="M7 21v-4a2 2 0 0 1 2-2h4" />
					<circle cx="15" cy="15" r="2" />
				</svg>
				<span
					style={{
						fontSize: "20px",
						fontWeight: "600",
						color: "#ffffff",
					}}
				>
					fragmenta.vercel.app
				</span>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					maxWidth: "800px",
					padding: "0 60px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						marginBottom: "24px",
					}}
				>
					<span
						style={{
							fontSize: "64px",
							fontWeight: "600",
							color: "#ffffff",
							letterSpacing: "-0.02em",
						}}
					>
						Fragmenta
					</span>
				</div>

				<p
					style={{
						fontSize: "28px",
						fontWeight: "500",
						color: "#a1a1aa",
						maxWidth: "600px",
						lineHeight: "1.4",
						margin: "0",
					}}
				>
					A new way to manage your forms.
				</p>

				<div
					style={{
						display: "flex",
						gap: "32px",
						marginTop: "40px",
						fontSize: "18px",
						fontWeight: "500",
						color: "#ffffff",
					}}
				>
					<span>Modern forms</span>
					<span>Real-time</span>
					<span>Secure</span>
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: "2px",
					background:
						"linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
				}}
			/>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}
