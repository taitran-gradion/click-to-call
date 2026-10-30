# click-to-call

A Margince extension unit that puts a call card on every phone number in the app.

Rest the pointer on a phone number, or tab onto it, and a card opens under it:

- **Call** — the `tel:` link, handed to the computer's calling app
- **Text message** — `sms:`
- **WhatsApp** — `wa.me`, in a new tab
- **Zalo** — `zalo.me`, in a new tab
- **Copy number**

It closes when the pointer leaves both the number and the card, on Esc, or on scroll. On a touch device there is no hover, and tapping a number calls it as before.

WhatsApp and Zalo need the number with its country code (`+84 …`).

## How it works

Core already draws every phone number it accepts as a `tel:` link. This unit's frontend mounts one card beside the app and opens it over whichever `tel:` link the pointer or keyboard reaches, so no core screen changes and nothing is stored. `#/ext/click-to-call` explains it, with a number to try.

## Install

In an installation's `extensions.mod`:

```
require github.com/taitran-gradion/click-to-call v0.0.0
replace github.com/taitran-gradion/click-to-call => ./addons/click-to-call
```
