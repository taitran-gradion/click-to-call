import { useT } from "@margince/frontend/app";
import { useClipboardCopy } from "@margince/frontend/design-system";
import { Copy, MessageCircle, MessageSquare, Phone, Send } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

// How long the pointer rests on a number before the card opens, and how long
// it may be away from both the number and the card before it closes: long
// enough to cross the gap between them, short enough not to linger.
const OPEN_MS = 200;
const CLOSE_MS = 300;
const CARD_WIDTH = 240;
const GAP = 6;

// Every phone number core draws is one of these: ContactLink turns a number it
// accepts into a tel: link, and leaves any other value plain text.
const PHONE_LINK = 'a[href^="tel:"]';

type Target = { link: HTMLAnchorElement; number: string; shown: string };

/**
 * The call card: one floating card, opened over whichever phone number the
 * pointer rests on or the keyboard reaches, anywhere in the app.
 */
export function CallCard() {
  const [target, setTarget] = useState<Target | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const later = (run: () => void, ms: number) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(run, ms);
    };
    const linkOf = (node: EventTarget | null) =>
      node instanceof Element ? node.closest<HTMLAnchorElement>(PHONE_LINK) : null;
    const inCard = (node: EventTarget | null) => node instanceof Node && card.current?.contains(node) === true;

    const enter = (event: Event) => {
      if (inCard(event.target)) {
        clearTimeout(timer.current);
        return;
      }
      const link = linkOf(event.target);
      if (!link) return;
      const number = decodeURIComponent(link.getAttribute("href")?.slice("tel:".length) ?? "");
      if (number === "") return;
      later(() => setTarget({ link, number, shown: link.textContent?.trim() || number }), event.type === "focusin" ? 0 : OPEN_MS);
    };
    const leave = (event: Event) => {
      if (linkOf(event.target) || inCard(event.target)) later(() => setTarget(null), CLOSE_MS);
    };
    const close = () => {
      clearTimeout(timer.current);
      setTarget(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mouseover", enter);
    document.addEventListener("focusin", enter);
    document.addEventListener("mouseout", leave);
    document.addEventListener("focusout", leave);
    document.addEventListener("keydown", escape);
    // A card left behind by a scroll would point at nothing.
    window.addEventListener("scroll", close, true);
    window.addEventListener("hashchange", close);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("focusin", enter);
      document.removeEventListener("mouseout", leave);
      document.removeEventListener("focusout", leave);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("hashchange", close);
    };
  }, []);

  if (!target || !target.link.isConnected) return null;
  return (
    <div ref={card} className="ext-click-to-call" role="dialog" aria-label={target.shown} style={placeAt(target.link)}>
      <Actions number={target.number} shown={target.shown} />
    </div>
  );
}

// Below the number, or above it when the number sits near the bottom of the
// window, and never past the right edge.
function placeAt(link: HTMLElement): CSSProperties {
  const rect = link.getBoundingClientRect();
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - CARD_WIDTH - 8));
  return rect.bottom + 220 > window.innerHeight
    ? { left, bottom: window.innerHeight - rect.top + GAP, width: CARD_WIDTH }
    : { left, top: rect.bottom + GAP, width: CARD_WIDTH };
}

function Actions({ number, shown }: Readonly<{ number: string; shown: string }>) {
  const t = useT();
  // WhatsApp and Zalo address a number by its digits alone, country code first.
  const digits = number.replace(/^\+/, "");
  const copy = useClipboardCopy(number, {
    copy: t("extClickToCall.copy"),
    copied: t("extClickToCall.copied"),
    remedy: t("extClickToCall.copyRemedy"),
  });
  return (
    <>
      <div className="ext-click-to-call-number">{shown}</div>
      <a className="ext-click-to-call-action is-primary" href={`tel:${number}`}>
        <Phone size={16} aria-hidden />
        {t("extClickToCall.call")}
      </a>
      <a className="ext-click-to-call-action" href={`sms:${number}`}>
        <MessageSquare size={16} aria-hidden />
        {t("extClickToCall.sms")}
      </a>
      <a className="ext-click-to-call-action" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={16} aria-hidden />
        {t("extClickToCall.whatsapp")}
      </a>
      <a className="ext-click-to-call-action" href={`https://zalo.me/${digits}`} target="_blank" rel="noopener noreferrer">
        <Send size={16} aria-hidden />
        {t("extClickToCall.zalo")}
      </a>
      <button type="button" className="ext-click-to-call-action" onClick={copy.copy}>
        <Copy size={16} aria-hidden />
        {copy.label}
      </button>
      {copy.notice}
    </>
  );
}
