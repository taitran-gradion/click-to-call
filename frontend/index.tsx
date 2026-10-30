import { LocaleProvider } from "@margince/frontend/app";
import { createRoot } from "react-dom/client";
import { CallCard } from "./callcard";
import { AboutPage } from "./page";
import "./click-to-call.css";

// Core imports every extension's entry when the app starts, and gives a unit
// no place on every page. So the call card mounts itself beside the app, once.
const hostId = "ext-click-to-call-host";
if (typeof document !== "undefined" && !document.getElementById(hostId)) {
  const host = document.createElement("div");
  host.id = hostId;
  document.body.append(host);
  createRoot(host).render(
    <LocaleProvider>
      <CallCard />
    </LocaleProvider>,
  );
}

// #/ext/click-to-call: what the card does, with a number to try it on.
export default AboutPage;
