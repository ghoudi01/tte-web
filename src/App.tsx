import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Redirect } from "./components/Redirect";
import { DashboardLayoutSkeleton } from "./components/DashboardLayoutSkeleton";
import DashboardLayout from "./components/DashboardLayout";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("@/pages/home"));
const MerchantSetup = lazy(() => import("@/pages/MerchantSetup"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const PhoneVerification = lazy(() => import("@/pages/PhoneVerification"));
const Plugins = lazy(() => import("@/pages/Plugins"));
const PluginsSocialSellers = lazy(() => import("@/pages/PluginsSocialSellers"));
const ApiDocs = lazy(() => import("@/pages/ApiDocs"));
const Settings = lazy(() => import("@/pages/Settings"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Reports = lazy(() => import("@/pages/ReportsDynamic"));
const Credits = lazy(() => import("@/pages/Credits"));
const Referrals = lazy(() => import("@/pages/Referrals"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const Support = lazy(() => import("@/pages/Support"));
const PhoneVerificationHistory = lazy(
  () => import("@/pages/PhoneVerificationHistory")
);

function Router() {
  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/merchant-setup"} component={MerchantSetup} />
        <Route path={"/login"} component={Login} />
        <Route path={"/register"} component={Register} />
        <Route path={"/forgot-password"} component={ForgotPassword} />
        <Route path={"/terms"} component={Terms} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/pricing"} component={Pricing} />
        <Route path={"/pricing/:plan"} component={Pricing} />

      <Route path={"/user-dashboard"}>
        {() => <Redirect to="/dashboard" />}
      </Route>
      <Route path={"/dashboard"}>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path={"/orders"}>
        {() => <Redirect to="/reports" />}
      </Route>
      <Route path={"/phone-verification"}>
        <DashboardLayout>
          <PhoneVerification />
        </DashboardLayout>
      </Route>
      <Route path={"/phone-verification/history"}>
        <DashboardLayout>
          <PhoneVerificationHistory />
        </DashboardLayout>
      </Route>
      <Route
        path={"/plugins/social-sellers"}
        component={PluginsSocialSellers}
      />
      <Route path={"/plugins"} component={Plugins} />
      <Route path={"/api-docs"} component={ApiDocs} />
      <Route path={"/settings"}>
        <DashboardLayout>
          <Settings />
        </DashboardLayout>
      </Route>

      <Route path={"/reports/new"}>
        <DashboardLayout>
          <Reports />
        </DashboardLayout>
      </Route>
      <Route path={"/reports"}>
        <DashboardLayout>
          <Reports />
        </DashboardLayout>
      </Route>
      <Route path={"/points/convert"}>{() => <Redirect to="/credits" />}</Route>
      <Route path={"/points/history"}>
        {() => <Redirect to="/credits/history" />}
      </Route>
      <Route path={"/points"}>{() => <Redirect to="/credits" />}</Route>
      <Route path={"/credits/history"}>
        <DashboardLayout>
          <Credits />
        </DashboardLayout>
      </Route>
      <Route path={"/credits/earn"}>
        <DashboardLayout>
          <Credits />
        </DashboardLayout>
      </Route>
      <Route path={"/credits"}>
        <DashboardLayout>
          <Credits />
        </DashboardLayout>
      </Route>
      <Route path={"/referrals/users"}>
        <DashboardLayout>
          <Referrals />
        </DashboardLayout>
      </Route>
      <Route path={"/referrals/stats"}>
        <DashboardLayout>
          <Referrals />
        </DashboardLayout>
      </Route>
      <Route path={"/referrals"}>
        <DashboardLayout>
          <Referrals />
        </DashboardLayout>
      </Route>
      <Route path={"/analytics/orders"}>
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path={"/analytics/points"}>
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path={"/analytics/reports"}>
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path={"/analytics"}>
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </Route>
      <Route path={"/subscription/upgrade"}>
        <DashboardLayout>
          <Subscription />
        </DashboardLayout>
      </Route>
      <Route path={"/subscription/billing"}>
        <DashboardLayout>
          <Subscription />
        </DashboardLayout>
      </Route>
      <Route path={"/subscription"}>
        <DashboardLayout>
          <Subscription />
        </DashboardLayout>
      </Route>
      <Route path={"/support/contact"}>
        <DashboardLayout>
          <Support />
        </DashboardLayout>
      </Route>
      <Route path={"/support/report"}>
        {() => <Redirect to="/support" />}
      </Route>
      <Route path={"/support"}>
        <DashboardLayout>
          <Support />
        </DashboardLayout>
      </Route>

        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
