"use client";

import { useState } from "react";
import { contactEmail } from "@/lib/site";

const topics = ["Before buying", "My order", "A return", "Warranty", "Something else"];

// One text field whose label sits inside the box and moves up when the
// field is used (placeholder=" " lets CSS know when it is empty).
function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  hint,
  area,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  area?: boolean;
}) {
  const id = `cf-${name}`;
  return (
    <div className={`cf-field${area ? " cf-area" : ""}`}>
      {area ? (
        <textarea id={id} name={name} rows={5} required={required} placeholder=" " />
      ) : (
        <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} placeholder=" " />
      )}
      <label htmlFor={id}>
        {label}
        {hint && <em> {hint}</em>}
      </label>
    </div>
  );
}

// A short form that writes the email for the customer. There is no mail
// server yet, so sending opens their email app with everything filled in.
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const order = get("order");
    const subject = `${get("topic")}${order ? ` (order ${order})` : ""}`;
    const body = [
      get("message"),
      "",
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      order ? `Order number: ${order}` : "",
    ]
      .filter((l, i, a) => l || i < a.length - 1)
      .join("\n");
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="cf" onSubmit={submit}>
      <fieldset className="cf-topics">
        <legend>What is it about?</legend>
        <div>
          {topics.map((t, i) => (
            <label key={t} className="cf-topic">
              <input type="radio" name="topic" value={t} defaultChecked={i === 0} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="cf-row">
        <Field name="name" label="Your name" autoComplete="name" required />
        <Field name="email" label="Email" type="email" autoComplete="email" required />
      </div>
      <Field name="order" label="Order number" hint="(optional)" />
      <Field name="message" label="How can we help?" area required />

      <div className="cf-actions">
        <button type="submit" className="btn btn-primary cf-send">
          Send message
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p className={`cf-note${sent ? " is-sent" : ""}`} role="status">
          {sent && (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12.3l2.7 2.7L16 9.7" />
            </svg>
          )}
          {sent
            ? "Your email app should open with your message ready. Just press send."
            : "Sending opens your email app with your message ready to go."}
        </p>
      </div>
    </form>
  );
}
