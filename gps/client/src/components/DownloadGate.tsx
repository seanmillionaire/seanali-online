import { useEffect, useState } from "react";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { signupReturnParam } from "@/lib/downloadGate";
import "../download-gate.css";

export function DownloadGate({ name, unlocked, onSignup }: { name: string; unlocked: boolean; onSignup: (token: string) => void }) {
  const [token] = useState(() => crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const redirect = new URL(window.location.href);
  redirect.search = "";
  redirect.hash = "";
  redirect.searchParams.set(signupReturnParam, token);

  useEffect(() => {
    const restore = () => setSubmitting(false);
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  if (unlocked) return <section id="gps-download-gate" className="gps-download-gate unlocked" role="status"><Check size={22} /><div><h2>Your downloads are ready.</h2><p>Save your plan and compass below. Check your inbox for any email confirmation from Sean Ali.</p></div></section>;
  return <section id="gps-download-gate" className="gps-download-gate" aria-labelledby="download-gate-title">
    <span className="gps-download-kicker"><LockKeyhole size={17} /> YOUR FREE DOWNLOADS</span>
    <h2 id="download-gate-title">Keep your plan and compass.</h2>
    <p>Enter your email to download your personal plan as a PDF and your North Star Compass as an image.</p>
    <form method="post" action="https://www.aweber.com/scripts/addlead.pl" acceptCharset="UTF-8" onSubmit={(event) => {
      if (submitting) { event.preventDefault(); return; }
      try { onSignup(token); setError(""); setSubmitting(true); }
      catch { event.preventDefault(); setError("I couldn't keep your map safe for the signup. Your answers are still here. Please allow site storage and try again."); }
    }} onKeyDown={(event) => event.stopPropagation()}>
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="listname" value="awlist6946418" />
      <input type="hidden" name="redirect" value={redirect.href} />
      <input type="hidden" name="meta_redirect_onlist" value={redirect.href} />
      <input type="hidden" name="meta_required" value="name,email" />
      <input type="hidden" name="meta_tags" value="dream-life-gps,gps-downloads,seanali-online" />
      <input type="hidden" name="meta_adtracking" value="Sean Ali Dream Life GPS Downloads" />
      <input type="hidden" name="meta_forward_vars" value="0" />
      <label htmlFor="gps-download-email">Email address</label>
      <div className="gps-download-form-row"><input id="gps-download-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /><button type="submit" disabled={submitting}>{submitting ? "Opening signup..." : "Unlock my downloads"}<ArrowRight size={19} /></button></div>
      <small>You'll also get emails from Sean Ali with ideas and tools for the life you want. Unsubscribe anytime. <a href="/privacy">Privacy policy</a></small>
      {error && <p className="gps-download-error" role="alert">{error}</p>}
    </form>
  </section>;
}
