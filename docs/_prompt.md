SKIP THIS FILE & DO NOT READ THIS FILE

Generate the Product Requirement Document for a PWA app that allow users to split bills with their friends. It has to be fully client-side with no server-side involved. The whole application has to be free to host on GitHub pages. The features are (not limited to)

**Input page**

1. scan or upload the receipt to extract the name, quantity, price, discounts, service charges, fees, etc.
1.1 use Google Gemini to process the image
2. add/edit/remove items, quantity manually
3. add/edit/remove people who are splitting the bill
4. select who takes part in items
5. allow other members to select what they take part themselves (think of the solution)
5.1. ability to resolve conflicts if the data from the host and the member are not the same
6. select which item gets discount and how much (in both percentage and absolute values)
7. add service charges, tax, vat, and select how they're calculated (sc before tax, tax before sc, tax + sc from the total, no tax, no sc)
8. add more bills and set up grand final settlement so that some debts cancel out and only one transfer is required
9. support languages: English and Thai with abilities to extend to other languages

For documents:

Do include the diagram and flow how user can use the app using Mermaid.

For security:

Don't worry about encryption, data sensitivity because it's all done on client side.
