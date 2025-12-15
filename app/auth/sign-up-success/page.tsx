import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <Brain className="size-8 text-primary" />
              <h1 className="text-2xl font-bold">IntelliNote</h1>
            </div>
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription className="text-balance">
                We&apos;ve sent you a confirmation link. Please check your email to verify your account and start using
                IntelliNote.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">What&apos;s next?</p>
                <ol className="mt-2 list-inside list-decimal space-y-1">
                  <li>Check your email inbox</li>
                  <li>Click the confirmation link</li>
                  <li>You&apos;ll be redirected to your dashboard</li>
                </ol>
              </div>
              <Button asChild variant="outline">
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
