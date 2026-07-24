import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-300 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">&larr; Back to home</Link>
        <h1 className="mt-8 text-3xl font-bold text-zinc-100">Privacy Policy</h1>
        <p className="mt-2 text-zinc-500">Last updated: July 24, 2026</p>
        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">Data We Collect</h2>
            <p className="text-zinc-400 leading-relaxed">InvoFlow collects only the data you provide: your name, email address, billing address, and invoice details (client names, amounts, descriptions).</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">How We Use It</h2>
            <p className="text-zinc-400 leading-relaxed">Your data is used solely to power the invoicing platform — generate invoices, send reminders, and provide analytics on your dashboard.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">Data Storage</h2>
            <p className="text-zinc-400 leading-relaxed">All data is stored securely in a PostgreSQL database hosted on Neon. We use industry-standard encryption for data in transit and at rest.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">Third Parties</h2>
            <p className="text-zinc-400 leading-relaxed">We use Gmail SMTP (via Nodemailer) to send magic links and invoice emails. No invoice data is shared with any other third party.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">Your Rights</h2>
            <p className="text-zinc-400 leading-relaxed">You can request deletion of your account and all associated data at any time by contacting us.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-zinc-200 mb-2">Contact</h2>
            <p className="text-zinc-400 leading-relaxed">Email: privacy@invoflow.app</p>
          </section>
        </div>
      </div>
    </div>
  );
}
