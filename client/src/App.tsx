import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
// Frontend-only implementation
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Module from "@/pages/module";
import Quiz from "@/pages/quiz";
import Sidebar from "@/components/Sidebar";

function Router() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/module/:id" component={Module} />
          <Route path="/module/:id/quiz" component={Quiz} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
