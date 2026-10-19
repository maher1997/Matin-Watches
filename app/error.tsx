"use client";

import { useEffect, useRef } from "react";

// Shown if something on a page breaks in the browser (often a browser
// extension or auto-translate changing the page under React). It first
// quietly tries to draw the page again; only if that fails too does it ask
// the visitor to reload. The short error line helps us find the cause.
export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tried = useRef(false);

  useEffect(() => {
    console.error(error);
    let n = 0;
    try {
      n = Number(sessionStorage.getItem("matin-retry") || 0);
    } catch {}
    if (!tried.current && n < 2) {
      tried.current = true;
      try {
        sessionStorage.setItem("matin-retry", String(n + 1));
      } catch {}
      reset();
    }
    const clear = setTimeout(() => {
      try {
        sessionStorage.removeItem("matin-retry");
      } catch {}
    }, 10000);
    return () => clearTimeout(clear);
  }, [error, reset]);

  return (
    <div className="container page-pad page-error">
      <h1>Something went wrong</h1>
      <p>Please reload the page.</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => location.reload()}
      >
        Reload
      </button>
      <p className="page-error-code">
        {(error?.message || "Unknown error").slice(0, 200)}
      </p>
    </div>
  );
}
