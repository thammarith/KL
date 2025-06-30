# Features

See [overview.md](overview.md) first for overall vision and features, and [technical-stack.md](technical-stack.md) for the technical stack.

In this document, the features are described with the following format: `FeatureId: FeatureName`.

## Handling

### Missing Features

If a feature is not mentioned here but it seems necessary or good to have, create a new file in this folder called `missing-features.md` and add the feature there.

### Error handling

Make sure to handle errors gracefully.

## F1: Adding a bill

A user can add a bill by

### F1.1 Enter a bill manually

A user can create a blank bill manually.

### F1.2 Take multiple photos of the receipts

A user can take multiple photos of the receipts.

If the user device doesn't support taking photos, grey out the camera icon and show a banner that user's device doesn't support camera when the camera icon is tapped.

### F1.3 Upload multiple photos of the receipts

A user can upload multiple photos of receipts. It should treat a photo to be one reciept.

---

When a bill is added by taking or uploading photos, it'll perform the following action:

1. (F1.4) call Google's Gemini API to extract information from the photos such as (but not limited to):
   - bill's name
   - restaurant's name
   - date
   - items (name, quantity, price, etc.)
   - total amount, currecny (if unavailable, use user's latest currency or user's default currency if no latest currency)
   - tax, fees, discounts, charges of the bill
   - etc.
2. (F1.5) create bills from the extracted information
3. (F1.6) save the bill locally

## F2: View, edit, and delete a bill

A user can view, edit, and delete a bill on the same screen.

### F2.1 View & edit all bill information

This includes the name, date, items, total amount, currency, tax, fees, discounts, charges, etc. from F1


### F2.2 Add, edit, and remove items on the bill

(F2.2.1) A confirmation dialog will be shown to the user when they want to delete an item.

### F2.3 Delete the bill

(F2.3.1) A confirmation dialog will be shown to the user when they want to delete the bill.

### F2.4 Specify and change the currency and exchange rate of the bill

(F2.4.1) It should show the amounts in both original and converted currencies.

### F2.5 Add a note to the bill

### F2.6 Select if a discount, tax, fee, charge, etc. is applied to the whole bill or only specific items and select which items

(F2.6.1) The amount can be modified in case the discount, tax, fee, charge, etc. is not applied equally to all items.

### F2.07 Select who paid for the bill.

### F2.08 Select who takes part in an item.

### F2.09 Select if a bill is paid/settled or not.

### F2.10 If the itemised amount is not equal to the total amount on the bill, show a warning, amount difference.

Do not prevent the user from saving the bill but include a state to indicate the amount difference.

## F3 Other functions

Please add necessary functions that is not mentioned in this file.
