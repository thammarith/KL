# KL: the splitter app

KL is the ultimate bill splitter app. It's designed to rival likes Splitwise. It uses AI to read and understand the receipts, then algorithms take over to split the bill.

KL is an PWA app that works on all platforms and offline. There will be no remote server involved except Google's Gemini API for AI image processing.

No database unless it's necessary. If it's necessary, it'll be a local database like IndexedDB.

## Problem statement

- It's difficult to split bills
- Existing apps like Splitwise are not user friendly and require payment to access pro features
- Some fees and discounts are partially applied to only specific items but existing apps can't handle this
- Existing apps don't handle multiple currencies
- Existing apps don't handle group expense and settlement

## Features

See [features.md](features.md) for details.

## Technical stack

See [technical-stack.md](technical-stack.md) for details.
