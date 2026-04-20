import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Redirect } from "./components/Redirect";
import Home from "./pages/home";
import MerchantSetup from "./pages/MerchantSetup";
import Dashboard from "./pages/Dashboard";
import PhoneVerification from "./pages/PhoneVerification";
import Plugins from "./pages/Plugins";
import PluginsSocialSellers from "./pages/PluginsSocialSellers";
import ApiDocs from "./pages/ApiDocs";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Pricing from "./pages/Pricing";
import Reports from "./pages/Reports";
import Credits from "./pages/Credits";
import Referrals from "./pages/Referrals";
import Analytics from "./pages/Analytics";
import Subscription from "./pages/Subscription";
import Support from "./pages/Support";
import PhoneVerificationHistory from "./pages/PhoneVerificationHistory";
import DashboardLayout from "./components/DashboardLayout";
import InnovationLab from "./pages/InnovationLab";

function Router() {
  return (
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
        <DashboardLayout>
          <Orders />
        </DashboardLayout>
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
      <Route path={"/innovation-lab"}>
        <DashboardLayout>
          <InnovationLab />
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
        <DashboardLayout>
          <Support />
        </DashboardLayout>
      </Route>
      <Route path={"/support"}>
        <DashboardLayout>
          <Support />
        </DashboardLayout>
      </Route>

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
