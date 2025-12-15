import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Brain,
  Sparkles,
  Lock,
  Zap,
  Users,
  BarChart3,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">
              IntelliNote
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto max-w-screen-2xl px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
              <span>Designed for focused thinking</span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Notes that stay useful,
              <span className="text-primary"> even months later</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              IntelliNote helps you write, organize, and revisit notes with
              context. Powered by AI, but designed to feel simple and human.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Get started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/40 py-24">
          <div className="container mx-auto max-w-screen-2xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for how people actually take notes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Practical features that improve clarity, not complexity.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto max-w-screen-2xl px-4">
            <div className="mx-auto max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Start writing with clarity
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No clutter. No learning curve. Just better notes from day one.
              </p>

              <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">Create your account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-medium">IntelliNote</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Ayush Saini
              </span>

              <Link
                href="https://github.com/ayushsaini7717/intellinote"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </Link>

              <Link
                href="https://intellinote-woad.vercel.app/"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                Live Demo
              </Link>

              <Link
                href="https://www.linkedin.com/in/ayush-saini-85295b22a"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

const features = [
  {
    title: "AI Summaries",
    description:
      "Turn long notes into short, meaningful summaries you can revisit anytime.",
    icon: Sparkles,
  },
  {
    title: "Smart Organization",
    description:
      "Notes are automatically grouped by topic so nothing gets lost.",
    icon: Zap,
  },
  {
    title: "Collaboration",
    description:
      "Share notes with teammates and control who can view or edit.",
    icon: Users,
  },
  {
    title: "Insights",
    description:
      "Understand how you take notes and what you focus on most.",
    icon: BarChart3,
  },
  {
    title: "Privacy First",
    description:
      "Your data is encrypted and protected with role-based access.",
    icon: Lock,
  },
  {
    title: "Ask Your Notes",
    description:
      "Search and ask questions across all your notes in plain language.",
    icon: Brain,
  },
]

