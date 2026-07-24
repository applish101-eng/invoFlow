import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Search, Zap, BarChart3, Shield, Users } from "lucide-react";
import Logo from "@/public/logo.svg";

const features = [
  {
    icon: FileText,
    title: "Smart Invoicing",
    desc: "Create professional invoices with auto-generated numbers, multi-item support, and real-time currency formatting.",
  },
  {
    icon: Search,
    title: "Search & Filter",
    desc: "Find any invoice instantly with Boyer-Moore search. Filter by status to stay on top of your finances.",
  },
  {
    icon: Zap,
    title: "Template Suggestions",
    desc: "Frequency analysis detects recurring invoice patterns and suggests them as reusable templates.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    desc: "Track revenue, invoice trends, and key metrics with interactive charts.",
  },
  {
    icon: Shield,
    title: "Magic Link Auth",
    desc: "Passwordless authentication via email magic links. Secure and private.",
  },
  {
    icon: Users,
    title: "Client Management",
    desc: "Auto-complete client names, view history, and manage relationships from one directory.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="h-screen flex flex-col relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.pexels.com/photos/7130538/pexels-photo-7130538.jpeg)" }}
        />
        <div className="absolute inset-0 " />
        <header className="relative z-10 flex items-center justify-between px-6 py-4 mx-auto w-full max-w-6xl">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} className="size-9" alt="" />
            <p className="font-semibold text-2xl text-blue-800">InvoFlow</p>
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              size: "sm",
              className: "rounded-full px-5",
            })}
            style={{ backgroundColor: "#000", color: "#fff" }}
          >
            Get Started
          </Link>
        </header>
        <div className="flex-1 flex mt-28 justify-center px-6 relative z-10">
          <div className="max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-800/20 bg-white/10 px-4 py-1.5 text-sm text-black/70 backdrop-blur-sm mb-8">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              InvoFlow 1.0
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
              Invoicing <span className="text-blue-900">made simple</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-black/60">
              Create, send, and manage invoices from one dashboard. Built for
              speed, designed for clarity.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className={buttonVariants({
                  size: "lg",
                  className: "rounded-full px-8",
                })}
                style={{ backgroundColor: "#000", color: "#fff" }}
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "rounded-full px-8 text-black !border-black/30 bg-transparent hover:bg-black/10",
                })}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features + Footer */}
      <section className="h-screen flex flex-col bg-white px-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                Everything you need to manage invoices
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Algorithms power the features you use every day.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[#1728A2]/10">
                    <f.icon className="size-[18px] text-[#1728A2]" />
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-800 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <footer className="border-t border-zinc-200 py-5 shrink-0">
          <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-zinc-400">
            <p>&copy; {new Date().getFullYear()} InvoFlow. All rights reserved.</p>
            <Link href="/privacy" className="hover:text-zinc-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
