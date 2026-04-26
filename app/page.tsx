"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const supportAreas = [
  "Lead follow-up support",
  "Booking and scheduling support",
  "Inbox and response handling",
  "Website and contact flow support",
  "Operational reminders and coordination",
  "Reducing digital busywork for owners and staff",
];

const problemAreas = [
  {
    title: "Missed leads",
    description:
      "Enquiries slip through, responses take too long, and potential customers move on before anyone gets back to them.",
  },
  {
    title: "Too much admin",
    description:
      "Owners and small teams spend too much time chasing messages, updating bookings, and handling repeat tasks manually.",
  },
  {
    title: "Messy coordination",
    description:
      "Bookings, reminders, follow-up, and communication live in too many places and are easy to lose track of.",
  },
];

const benefits = [
  "Less time spent on repetitive admin",
  "Fewer missed leads and follow-ups",
  "Better support for bookings and customer communication",
  "More time focused on the actual business",
  "Practical help without needing technical knowledge",
];

const processSteps = [
  {
    step: "01",
    title: "Tell us where time or customers are being lost",
    description:
      "Share where the business feels messy, manual, or too dependent on you staying on top of everything.",
  },
  {
    step: "02",
    title: "We identify what support would help most",
    description:
      "We look at the lead flow, bookings, communication, and day-to-day operations to see where the biggest relief can come from.",
  },
  {
    step: "03",
    title: "We help put the right support in place",
    description:
      "We handle the digital side with smart systems and practical support so things keep moving without adding complexity to your side.",
  },
];

const faqs = [
  {
    question: "What kinds of businesses is this for?",
    answer:
      "This is for small businesses, solo operators, and local service teams that want more customers, less admin, and smoother day-to-day operations.",
  },
  {
    question: "Do I need to be technical?",
    answer:
      "No. The service is designed for business owners who want practical help without having to manage technical systems themselves.",
  },
  {
    question: "What kinds of tasks can this help with?",
    answer:
      "It can help with follow-up, bookings, inbox handling, reminders, coordination, website contact flow, and other repetitive digital work that slows the business down.",
  },
  {
    question: "Will I have to manage the systems myself?",
    answer:
      "No. The aim is to reduce your digital burden, not give you more tools to run on your own.",
  },
  {
    question: "What happens after I contact you?",
    answer:
      "We follow up by email to learn what kind of business you run, where time or opportunities are being lost, and what kind of support would help most.",
  },
  {
    question: "Is this only for local businesses?",
    answer:
      "No. It is a strong fit for many small businesses, especially service businesses and small teams that feel stretched by digital admin and follow-up.",
  },
];

type ContactFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
};

function ContactField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = false,
}: ContactFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
      <span className="flex items-center gap-2">
        {label}
        {required ? <span className="text-[var(--accent)]">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="h-12 rounded-[1rem] border border-[var(--line)] bg-white px-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(112,142,127,0.14)]"
      />
    </label>
  );
}

type ContactFormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

export default function Home() {
  const [formState, setFormState] = useState<ContactFormState>({
    status: "idle",
    message: "",
  });

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const businessName = String(formData.get("businessName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const topic = businessName ? `Inquiry from ${businessName}` : "General inquiry";

    setFormState({
      status: "submitting",
      message: "Sending your message...",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          topic,
          message:
            message ||
            `Business name: ${businessName}\n\nThe visitor requested follow-up without adding extra details.`,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormState({
          status: "error",
          message: result.error || "We could not send your message. Please try again.",
        });
        return;
      }

      form.reset();
      setFormState({
        status: "success",
        message: "Thanks. Your message was sent successfully.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setFormState({
        status: "error",
        message: "We could not send your message. Please try again.",
      });
    }
  }

  return (
    <main className="bg-[var(--page)] text-[var(--ink)]">
      <section className="relative overflow-hidden border-b border-[rgba(69,55,45,0.08)] bg-[linear-gradient(180deg,#fffdf9_0%,#faf6ee_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,_rgba(63,108,94,0.1),_transparent_55%)]" />
        <div className="pointer-events-none absolute right-[-8rem] top-20 h-64 w-64 rounded-full bg-[rgba(196,168,135,0.15)] blur-3xl" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-20 pt-6 sm:px-8 lg:px-10">
          <header className="grid grid-cols-[1fr_auto] items-center gap-4 py-4">
            <a
              href="#top"
              className="inline-flex min-w-0 items-center gap-3 text-sm font-semibold tracking-[0.14em] text-[var(--ink)] uppercase"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--line)] bg-white shadow-sm">
                <Image
                  src="/grovepath-logo-40x40.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              <span className="truncate">GrovePath</span>
            </a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center justify-center self-start rounded-full border border-[var(--line)] bg-white/90 px-5 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              See How We Can Help
            </a>
          </header>

          <div
            id="top"
            className="relative grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:py-24"
          >
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex rounded-full border border-[var(--line)] bg-white/85 px-4 py-2 text-sm font-medium text-[var(--muted)] shadow-sm backdrop-blur">
                Business support for small teams that want more customers and less admin
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl lg:text-[4.5rem] lg:leading-[1.04]">
                More customers, less admin.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                From lead follow-up to booking and day-to-day digital operations, GrovePath helps small businesses save time, reduce missed opportunities, and keep things running more smoothly.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Smart systems work behind the scenes so you can stay focused on running the business instead of chasing the digital side of it.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-semibold text-white shadow-lg shadow-[rgba(124,90,67,0.16)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                >
                  See How We Can Help
                </a>
                <a
                  href="#what-we-help-with"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--line)] bg-white px-7 text-base font-medium text-[var(--ink)] transition hover:bg-[rgba(69,55,45,0.03)]"
                >
                  What we help with
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-[var(--line)] bg-white/92 p-6 shadow-[0_24px_80px_rgba(69,55,45,0.08)] backdrop-blur sm:p-7">
                <div className="rounded-[1.6rem] bg-[var(--surface)] p-5">
                  <p className="text-sm font-semibold text-[var(--ink)]">Support that keeps the business moving</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    A calmer way to stay on top of follow-up, bookings, digital coordination, and the repetitive tasks that keep pulling owners away from the real work.
                  </p>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    "Less time spent chasing admin",
                    "Fewer missed leads and slow replies",
                    "Better support for bookings and communication",
                    "More breathing room for the work that matters",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.3rem] border border-[var(--line)] bg-[rgba(255,253,249,0.92)] px-4 py-4 text-sm font-medium text-[var(--ink)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-[1.5rem] border border-[rgba(63,108,94,0.18)] bg-[rgba(63,108,94,0.08)] px-5 py-4 text-sm leading-7 text-[var(--ink)]">
                  Built for small businesses that want practical help with growth and operations, without taking on more software or technical overhead.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="what-we-help-with" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="section-label">What we help with</p>
          <h2 className="section-title mt-4">Practical support for the digital work that keeps piling up.</h2>
          <p className="section-copy mt-5">
            GrovePath is for small businesses that want help with growth and operations in plain business terms, not a technical service to manage.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {supportAreas.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white px-5 py-5 text-sm font-medium text-[var(--ink)] shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[rgba(69,55,45,0.08)] bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="section-label">Problems we solve</p>
            <h2 className="section-title mt-4">The day-to-day friction that quietly costs time and customers.</h2>
            <p className="section-copy mt-5">
              This offer is built around familiar small-business pain points, especially when follow-up, communication, and digital coordination start eating too much attention.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problemAreas.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.6rem] border border-[var(--line)] bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="section-label">Why small businesses use this kind of support</p>
            <h2 className="section-title mt-4">Help that feels practical, not technical.</h2>
            <p className="section-copy mt-5">
              The point is to make the business easier to run and easier to grow, without asking owners or small teams to become software managers along the way.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-[var(--line)] bg-white px-5 py-5 text-[0.98rem] leading-7 text-[var(--ink)] shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(69,55,45,0.08)] bg-[linear-gradient(180deg,#fffdf9_0%,#f6f1e8_100%)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="section-label">How it works</p>
            <h2 className="section-title mt-4">A simple, low-pressure way to get the right support in place.</h2>
            <p className="section-copy mt-5">
              You tell us where the business feels stretched, we identify where support will help most, and we help put the right systems and follow-through in place.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {processSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.6rem] border border-[var(--line)] bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">{item.step}</p>
                <h3 className="mt-4 text-xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <div>
            <p className="section-label">Contact</p>
            <h2 className="section-title mt-4">Tell us where the business feels too manual or too messy.</h2>
            <p className="section-copy mt-5">
              Send your details and we will follow up by email to learn what kind of business you run, where time or customers are being lost, and what kind of support would help most.
            </p>
            <div className="mt-8 rounded-[1.6rem] border border-[var(--line)] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[var(--ink)]">What we ask for here</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <li>Name and email</li>
                <li>Business name</li>
                <li>Optional note about where things feel messy or time-consuming</li>
              </ul>
            </div>
          </div>

          <form
            id="contact-form"
            className="rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[0_20px_70px_rgba(69,55,45,0.08)] sm:p-8"
            method="post"
            onSubmit={handleContactSubmit}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <ContactField
                label="Name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                required
              />
              <ContactField
                label="Business name"
                name="businessName"
                placeholder="Your business"
                autoComplete="organization"
                required
              />
            </div>
            <div className="mt-5">
              <ContactField
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                required
              />
            </div>
            <label className="mt-5 flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
              <span>Optional message</span>
              <textarea
                name="message"
                rows={5}
                placeholder="Where does the business feel overloaded or harder to manage than it should be?"
                className="rounded-[1rem] border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(112,142,127,0.14)]"
              />
            </label>
            <button
              type="submit"
              disabled={formState.status === "submitting"}
              className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--accent)] px-7 text-base font-semibold text-white shadow-lg shadow-[rgba(124,90,67,0.16)] transition hover:bg-[var(--accent-strong)] focus:outline-none focus:ring-4 focus:ring-[rgba(124,90,67,0.16)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {formState.status === "submitting" ? "Sending..." : "See How We Can Help"}
            </button>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              The first step stays simple. After you reach out, we follow up by email with a few questions about your business, the current bottlenecks, and the kind of support that would make the biggest difference.
            </p>
            {formState.message ? (
              <p
                className={`mt-4 text-sm ${
                  formState.status === "error" ? "text-red-600" : "text-[var(--muted)]"
                }`}
                role="status"
              >
                {formState.message}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="border-t border-[rgba(69,55,45,0.08)] bg-[var(--surface)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="section-label">FAQ</p>
            <h2 className="section-title mt-4">Common questions.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"
              >
                <h3 className="text-base font-semibold text-[var(--ink)]">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
