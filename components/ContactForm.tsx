"use client";

import { useState } from "react";
import { contactEmail } from "@/lib/site";

const topics = ["A question before buying", "My order", "A return", "Warranty", "Something else"];

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
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <div className="contact-row">
        <label>
          <span>Topic</span>
          <select name="topic" defaultValue={topics[0]}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          <span>
            Order number <em>(if you have one)</em>
          </span>
          <input name="order" inputMode="text" />
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea name="message" rows={5} required />
      </label>
      <button type="submit" className="btn btn-primary contact-send">
        Send message
      </button>
      <p className="contact-note" role="status">
        {sent
          ? "Your email app should open with your message ready. Just press send."
          : "Sending opens your email app with your message ready to go."}
      </p>
    </form>
  );
}
