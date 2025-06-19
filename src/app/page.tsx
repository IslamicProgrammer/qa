import { auth, signIn, signOut } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  LayoutDashboard,
  LogOut,
  BookOpen,
  Users,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Header */}
              <div className="space-y-2 text-center">
                <div className="mb-4 flex items-center justify-center">
                  <div className="bg-primary/10 rounded-full p-3">
                    <BookOpen className="text-primary h-8 w-8" />
                  </div>
                </div>
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Islamic Q&A Admin
                </h1>
                <p className="text-muted-foreground">
                  Manage your Islamic Q&A platform
                </p>
              </div>

              {/* Main Card */}
              <Card className="bg-card/50 border-0 shadow-lg backdrop-blur-sm">
                <CardHeader className="pb-4 text-center">
                  {session?.user ? (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="ring-primary/20 h-16 w-16 ring-2">
                          <AvatarImage
                            src={session.user.image ?? ""}
                            alt={session.user.name ?? "User"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {session.user.name?.charAt(0)
                              ? session.user.email?.charAt(0)
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <CardTitle className="text-xl">
                            Welcome back!
                          </CardTitle>
                          <CardDescription className="font-medium">
                            {session.user.name ?? session.user.email}
                          </CardDescription>
                          <Badge variant="secondary" className="text-xs">
                            Administrator
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        Sign In Required
                      </CardTitle>
                      <CardDescription>
                        Please sign in to access the admin panel
                      </CardDescription>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {session?.user ? (
                    <div className="space-y-4">
                      {/* Dashboard Link */}
                      <Link href="/dashboard">
                        <Button
                          size="lg"
                          className="mb-5 h-12 w-full text-base font-medium shadow-sm"
                        >
                          <LayoutDashboard className="mr-2 h-5 w-5" />
                          Go to Dashboard
                        </Button>
                      </Link>

                      {/* Quick Stats or Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <MessageSquare className="text-muted-foreground mx-auto mb-1 h-5 w-5" />
                          <p className="text-sm font-medium">Questions</p>
                          <p className="text-muted-foreground text-xs">
                            Manage
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <Users className="text-muted-foreground mx-auto mb-1 h-5 w-5" />
                          <p className="text-sm font-medium">Users</p>
                          <p className="text-muted-foreground text-xs">
                            Overview
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Sign Out */}
                      <form
                        action={async () => {
                          "use server";
                          await signOut({ redirectTo: "/" });
                        }}
                      >
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <form
                      action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/" });
                      }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        className="h-12 w-full text-base font-medium shadow-sm"
                      >
                        <FaGoogle className="mr-2 h-5 w-5" />
                        Continue with Google
                      </Button>
                    </form>
                  )}

                  {/* tRPC Status */}
                  {hello?.greeting && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <p className="text-muted-foreground text-xs">
                          API Connected: {hello.greeting}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center">
                <p className="text-muted-foreground text-xs">
                  Islamic Q&A Admin Panel • Secure & Trusted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
