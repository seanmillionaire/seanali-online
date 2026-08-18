/** DREAM LIFE GPS shell — the Wayfinder's Atlas uses a warm light canvas with deep ink route panels. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function GpsRouter() {
  const base = window.location.pathname.startsWith("/gps") ? "/gps" : "";
  return <WouterRouter base={base}><Switch><Route path="/" component={Home} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></WouterRouter>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><GpsRouter /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
