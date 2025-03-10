<a href="https://giddy-ladybug-159.convex.cloud">
  <img alt="A Modern Form Builder Built With Next.js." src="./public/preview/forms.png">
  <h1 align="center">Forms</h1>
</a>

<p align="center">
  A Modern Form Builder Built With Next.js, Convex, and AI SDK.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- **Intuitive Form Builder**
  - Create forms with a drag-and-drop interface
  - Customize form appearance and behavior
  - Preview forms before publishing
- **Multiple Question Types**
  - Support for text, multiple choice, checkboxes, and more
  - Conditional logic for dynamic forms
  - Required field validation
- **Form Publishing**
  - Publish forms to share with respondents
  - Generate shareable links
  - Embed forms on websites
- **Response Collection**
  - Gather and analyze responses
  - Export data for further analysis
  - Real-time response notifications
- **Organization Management**
  - Create and manage forms within organizations
  - Role-based access control
  - Team workspaces
- **User Authentication**
  - Secure login and user management
  - OAuth integration
  - Password protection
- **Team Collaboration**
  - Invite team members to collaborate on forms
  - Manage permissions and roles
  - Activity tracking

## Tech Stack

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [Convex](https://www.convex.dev/)
  - Real-time database for storing form data and responses
  - Backend functions for form logic and processing
  - File storage for uploads and assets
- [NextAuth.js](https://next-auth.js.org)
  - Authentication with multiple providers
  - Session management
  - User profiles
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenAI (default), Anthropic, Cohere, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility

## Deploy Your Own

You can deploy your own version of Forms to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fforms&env=CONVEX_DEPLOY_KEY,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fyourusername%2Fforms%2Fblob%2Fmain%2F.env.example&demo-title=Forms&demo-description=A%20modern%20form%20builder%20application%20built%20with%20Next.js%2C%20Convex%2C%20and%20Tailwind%20CSS.&demo-url=https%3A%2F%2Fforms-demo.vercel.app)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Forms. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various Convex and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
npm install
npm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).
