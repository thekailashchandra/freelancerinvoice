# Security Policy

## Supported versions

Security fixes are applied to the latest release on the `main` branch. If you
are self-hosting, keep your deployment and dependencies up to date.

## Reporting a vulnerability

Please do not open a public GitHub issue for security problems.

Email:

```text
invoiceforfreelance@gmail.com
```

Include:

- A short description of the issue
- Steps to reproduce
- The affected route, component, or dependency
- Whether the issue affects the hosted Cloud service, self-hosted installs, or both
- Any proof of concept, screenshots, or logs that help explain the impact

We aim to acknowledge reports within 72 hours and will keep you updated while
the issue is investigated.

## Scope

Examples of issues we want to hear about:

- Authentication or authorization bypasses
- Access to another user's invoices, clients, or profile data
- Payment verification or webhook signature bypasses
- Subscription activation without a verified payment
- Server-side request forgery, injection, or remote code execution
- Exposure of secrets, API keys, or private storage assets
- Cross-site scripting in invoice, support, or profile content

## Out of scope

- Findings that require access to a user's own account or browser
- Missing security headers without a demonstrated impact
- Rate limiting issues without a practical attack path
- Reports against third-party services such as Supabase, Razorpay, Dodo, or Vercel

## Safe harbor

We will not pursue legal action for good-faith research that follows this
policy, avoids privacy violations, avoids service disruption, and gives us
reasonable time to fix the issue before public disclosure.
