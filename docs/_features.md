SKIP THIS FILE & DO NOT READ THIS FILE

# Features

Also see [overview.md](overview.md) for the overall vision and features, and [technical-stack.md](technical-stack.md) for the technical stack.

In this document, the features are described with the following format: `FeatureId: FeatureName`.

## Handling

### Missing Features

If a feature is not mentioned here but it seems necessary or good to have, create a new file in this folder called `missing-features.md` and add the feature there.

### Error handling

Make sure to handle errors gracefully.

## F01: Bill management

### F01-01: Add a bill

A user can add a bill by

1. (F01-01-01.1) Take multiple photos of the receipts
2. (F01-01-01.2) Upload multiple photos of the receipts
3. (F01-01-01.3) Enter a bill manually

When a bill is added by taking or uploading photos, it'll perform the following action:

1. (F01-01-02) call Google's Gemini API to extract the following information from the photos:
    1. The name of the bill
    2. The date of the bill
    3. The items on the bill (name, quantity, price)
    4. The total amount of the bill
    5. The currency of the bill (default is user's default currency)
    6. The tax, fees, discounts, charges on the bill
2. (F01-01-03) create bills from the extracted information
3. (F01-01-04) save the bill locally

### F01-02: View, edit, and delete a bill

A user can view, edit, and delete a bill on the same screen.

1. (F01-02-01) View & edit all bill information, including the name, date, items, total amount, currency, tax, fees, discounts, charges from F01-01.
2. (F01-02-02) Add, edit, and remove items on the bill.
   1. (F01-02-02-01) A confirmation dialog will be shown to the user when they want to delete an item.
3. (F01-02-03) Delete the bill.
   1. (F01-02-03-01) A confirmation dialog will be shown to the user when they want to delete the bill.
4. (F01-02-04) Specify and change the currency and exchange rate of the bill.
   1. (F01-02-04-01) It should show the amounts in both original and converted currencies.
5. (F01-02-05) Add a note to the bill.
6. (F01-02-06) Select if a discount, tax, fee, charge, etc. is applied to the whole bill or only specific items and select which items.
   1. (F01-02-06-01) The amount can be modified in case the discount, tax, fee, charge, etc. is not applied equally to all items.
7. (F01-02-07) Select who paid for the bill.
8. (F01-02-08) Select who takes part in an item.
9. (F01-02-09) Select if a bill is paid/settled or not.
10. (F01-02-10) If the itemised amount is not equal to the total amount on the bill, show a warning, amount difference. Do not prevent the user from saving the bill but include a state to indicate the amount difference.




