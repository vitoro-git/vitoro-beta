import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Key,
  LinkIcon,
  Loader2Icon,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/config/server";
import { ReactNode, Suspense } from "react";
import ProfileUpdateForm from "@/features/auth/components/profile/profile-update-form";
import ChangePasswordForm from "@/features/auth/components/profile/change-password-form";
import AccountLinking from "@/features/auth/components/profile/account-linking";
import AccountDeletion from "@/features/auth/components/profile/account-deletion";
import SetPasswordButton from "@/features/auth/components/profile/set-password-button";
import SessionManagement from "@/features/auth/components/profile/session-management";
import SubscriptionManagement from "@/features/auth/components/profile/subscription-management";
import { FullUser } from "@/types";
import AccountIcon from "@/components/account-icon";

export default async function ProfilePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  // Only for type checker, layout will handle redirect before this
  if (session === null) return redirect("/signin");
  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: headersList,
  });

  return (
    <div className="mx-auto my-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex justify-center items-center bg-muted rounded-full size-16 overflow-hidden">
            <AccountIcon className="w-full font-semibold text-xl" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start gap-1">
              <h1 className="font-bold text-3xl">
                {session.user.name || "User Profile"}
              </h1>
              <Badge>{session.user.role}</Badge>
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="profile">
            <User />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield />
            <span className="max-sm:hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Key />
            <span className="max-sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <LinkIcon />
            <span className="max-sm:hidden">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <DollarSign />
            <span className="max-sm:hidden">Subscriptions</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Trash2 className="text-destructive" />
            <span className="max-sm:hidden text-destructive">Danger</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user as FullUser} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <LoadingSuspense>
            <SecurityTab email={session.user.email} />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="sessions">
          <LoadingSuspense>
            <SessionsTab currentSessionToken={session.session.token} />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="accounts">
          <LoadingSuspense>
            <LinkedAccountsTab />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="subscriptions">
          <LoadingSuspense>
            <SubscriptionManagement subscriptions={subscriptions} />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDeletion />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function LinkedAccountsTab() {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const nonCredentialAccounts = accounts.filter(
    (a) => a.providerId !== "credential"
  );

  return (
    <Card>
      <CardContent>
        <AccountLinking currentAccounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  );
}
async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}

async function SecurityTab({ email }: { email: string }) {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === "credential"
  );

  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will send you a password reset email to set up a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LoadingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  );
}
