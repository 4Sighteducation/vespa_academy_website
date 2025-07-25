# Knack DPA Handling Notes for E-ACT Contract

## Current Approach

Knack is listed as a primary sub-processor in your E-ACT DPA with a note that their full DPA is available upon request.

## Why This Approach Works

1. **Transparency** - E-ACT can see Knack is a key sub-processor
2. **Simplicity** - Avoids overwhelming the main DPA with sub-sub-processors
3. **Compliance** - Meets GDPR requirements for sub-processor disclosure
4. **Flexibility** - Allows you to update Knack's DPA separately

## When to Share Knack's Full DPA

Share the Knack DPA if E-ACT:
- Specifically requests sub-processor documentation
- Asks about data storage locations (Knack uses US/EU servers)
- Wants details about Knack's security measures
- Requires information about Knack's sub-processors

## Knack's Key Sub-Processors (FYI)

From their DPA, Knack uses:
- **AWS** (US, Germany, Australia) - Infrastructure
- **Google** (US) - Analytics, spam protection
- **Stripe** (US) - Payment processing
- **SendGrid** (US) - Email services
- **Supabase** - Your separate database (already listed)

## What to Say if Asked

"Knack is our primary database platform provider. They maintain SOC 2 compliance and have a comprehensive DPA in place. We can provide their full DPA documentation including their complete sub-processor list upon request. All data processing through Knack complies with GDPR requirements."

## Important Notes

- Knack has EU-US Data Privacy Framework certification
- They use Standard Contractual Clauses for data transfers
- Your signed Knack DPA (dated 20/07/25) covers your use of their platform
- E-ACT's data would be processed under your agreement with Knack 