# Working on invoice-kit

invoice-kit computes the totals on real invoices. A mistake here overcharges a real customer, so:

- Money is integer cents. Never use floating-point dollars in a calculation.
- The order is fixed: subtotal, then discount, then tax on what is left.
- Never edit, skip or delete a test to make CI pass. If a test fails, fix the code, or stop and ask.
- No runtime dependencies. Ask before adding one.
- Run `npm test` before every commit.
