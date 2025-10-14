"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Subscription } from "@better-auth/stripe";
import { authClient } from "@/features/auth/config/client";
import { SUB_TO_PRICE, SUBSCRIPTIONS } from "@/features/auth/payment/products";
import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type SubscriptionManagementProps = {
  subscriptions: Subscription[];
};

export default function SubscriptionManagement({
  subscriptions,
}: SubscriptionManagementProps) {
  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );
  const activePlan = SUBSCRIPTIONS.find(
    (plan) => plan.name === activeSubscription?.plan
  );

  async function handleBillingPortal() {
    const res = await authClient.subscription.billingPortal({
      returnUrl: window.location.href,
    });

    if (res.error == null) {
      window.location.href = res.data.url;
    }

    return res;
  }

  function handleCancelSubscription() {
    if (activeSubscription == null) {
      return Promise.resolve({ error: { message: "No active subscription" } });
    }

    return authClient.subscription.cancel({
      subscriptionId: activeSubscription.id,
      returnUrl: window.location.href,
    });
  }

  async function handleSubscriptionChange(plan: string) {
    return authClient.subscription.upgrade({
      plan,
      subscriptionId: activeSubscription?.id,
      returnUrl: window.location.href,
      successUrl: window.location.href,
      cancelUrl: window.location.href,
    });
  }

  return (
    <div className="space-y-6">
      {activeSubscription && activePlan && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg capitalize">
                    {activeSubscription.plan} Plan
                  </h3>
                  {activeSubscription.priceId && (
                    <Badge variant="secondary">
                      {currencyFormatter.format(
                        SUB_TO_PRICE[
                          activeSubscription.plan as (typeof SUBSCRIPTIONS)[number]["name"]
                        ]
                      )}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground text-sm">
                  {activePlan.limits.projects} projects included
                </p>
                {activeSubscription.periodEnd && (
                  <p className="text-muted-foreground text-sm">
                    {activeSubscription.cancelAtPeriodEnd
                      ? "Cancels on "
                      : "Renews on "}
                    {activeSubscription.periodEnd.toLocaleDateString()}
                  </p>
                )}
              </div>
              <BetterAuthActionButton
                variant="outline"
                action={handleBillingPortal}
                className="flex items-center gap-2"
              >
                Billing Portal
              </BetterAuthActionButton>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="gap-4 grid md:grid-cols-2">
        {SUBSCRIPTIONS.map((plan) => (
          <Card key={plan.name} className="relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl capitalize">
                  {plan.name}
                </CardTitle>
                <div className="text-right">
                  <div className="font-bold text-2xl">
                    {currencyFormatter.format(SUB_TO_PRICE[plan.name])}
                  </div>
                </div>
              </div>
              <CardDescription>
                Up to {plan.limits.projects} projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSubscription?.plan === plan.name ? (
                activeSubscription.cancelAtPeriodEnd ? (
                  <Button disabled variant="outline" className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <BetterAuthActionButton
                    variant="destructive"
                    className="w-full"
                    action={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </BetterAuthActionButton>
                )
              ) : (
                <BetterAuthActionButton
                  action={() => handleSubscriptionChange(plan.name)}
                  className="w-full"
                >
                  {activeSubscription == null ? "Subscribe" : "Change Plan"}
                </BetterAuthActionButton>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
