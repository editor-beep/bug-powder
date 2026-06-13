import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-iz-ink px-4 iz-scanlines iz-noise">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-iz-blood iz-glitch-text">404</h1>
        <h2 className="mt-4 text-xl font-display text-iz-bone">This corridor does not exist.</h2>
        <p className="mt-2 text-sm text-muted-foreground italic">
          The Interzone Bureau has no record of the page you requested. Your file has been amended.
        </p>
        <Link to="/feed" className="mt-6 inline-block px-4 py-2 border border-iz-blood text-iz-bone hover:bg-iz-blood/20 transition-colors text-xs uppercase tracking-widest">
          Return to the Feed
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-iz-ink px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display text-iz-blood">A typewriter parasite has interfered.</h1>
        <p className="mt-2 text-xs text-muted-foreground font-mono">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 px-4 py-2 border border-iz-blood text-iz-bone hover:bg-iz-blood/20 text-xs uppercase tracking-widest"
        >
          Reinitialize
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Interzone Feed — A Paranoia-Fueled Hallucination Simulator" },
      { name: "description", content: "Step into the Interzone. A surreal, escalating, body-horror habit tracker for the chronically observed." },
      { name: "theme-color", content: "#080608" },
      { property: "og:title", content: "Interzone Feed — A Paranoia-Fueled Hallucination Simulator" },
      { property: "og:description", content: "Step into the Interzone. A surreal, escalating, body-horror habit tracker for the chronically observed." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Interzone Feed — A Paranoia-Fueled Hallucination Simulator" },
      { name: "twitter:description", content: "Step into the Interzone. A surreal, escalating, body-horror habit tracker for the chronically observed." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b2e46eb8-9511-4189-8866-d31f8c40058e/id-preview-c0d83a4e--4e77468a-d4bd-4d49-8d65-2eeb402bd690.lovable.app-1781328710333.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b2e46eb8-9511-4189-8866-d31f8c40058e/id-preview-c0d83a4e--4e77468a-d4bd-4d49-8d65-2eeb402bd690.lovable.app-1781328710333.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
