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
				background: "white",
			}}
		>
			<div
				style={{
					left: 42,
					top: 42,
					position: "absolute",
					display: "flex",
					alignItems: "center",
				}}
			>
				<span
					style={{
						width: 24,
						height: 24,
						background: "black",
					}}
				/>
				<span
					style={{
						marginLeft: 8,
						fontSize: 20,
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
				}}
			>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						padding: "20px 50px",
						margin: "0 42px",
						fontSize: 40,
						width: "auto",
						maxWidth: 550,
						textAlign: "center",
						backgroundColor: "black",
						color: "white",
						lineHeight: 1.4,
					}}
				>
					Fragmenta
				</div>
				<p
					style={{
						marginTop: 20,
						fontSize: 24,
						maxWidth: 550,
					}}
				>
					A new way to manage your forms.
				</p>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}
