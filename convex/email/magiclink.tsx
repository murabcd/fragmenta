interface MagicLinkEmailProps {
  email: string;
  magicLink: string;
  host: string;
}

function html({ email, magicLink, host }: MagicLinkEmailProps): string {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const color = {
    background: "white",
    text: "black",
    mainBackground: "white",
    buttonBackground: "#000000",
    buttonBorder: "#000000",
    buttonText: "white",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${magicLink}"
                target="_blank"
                style="font-size: 18px; font-family: sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

function text({ magicLink, host }: { magicLink: string; host: string }): string {
  return `Sign in to ${host}\n${magicLink}\n\n`;
}

export async function sendMagicLinkEmail(
  email: string,
  url: string,
  provider: { from: string },
  resendApiKey: string
) {
  const { host } = new URL(url);
  const emailHtml = html({ email, magicLink: url, host });
  const emailText = text({ magicLink: url, host });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to: email,
      subject: `Sign in to ${host}`,
      html: emailHtml,
      text: emailText,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send verification email");
  }
}
