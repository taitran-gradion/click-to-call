// SPDX-License-Identifier: BUSL-1.1
// SPDX-FileCopyrightText: 2026 Gradion

// Package clicktocall puts a call card on every phone number in the app.
// Hovering a number, or tabbing onto it, opens a card that calls it, texts it,
// opens it in WhatsApp or Zalo, or copies it.
//
// It is a frontend unit: core already makes every phone number a tel: link,
// and frontend/ finds those links wherever they are drawn, so no core screen
// changes and nothing is stored.
package clicktocall

import "github.com/margince/margince/backend/pkg/extension"

// New returns the unit's declaration: everything it gives core, in one place.
func New() extension.Extension {
	return extension.Extension{
		Name:        "click-to-call",
		Version:     "0.1.0",
		Description: "A call card on every phone number: call, text, WhatsApp, Zalo or copy it, from a hover.",
	}
}
