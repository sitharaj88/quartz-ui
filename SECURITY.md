# Security Policy

## Supported versions

Quartz UI follows semantic versioning. The latest minor release on the current major receives security fixes.

| Version | Status |
|---------|--------|
| 1.x | ✅ Supported |
| < 1.0.0 | ❌ Unsupported |

## Reporting a vulnerability

**Do not file a public issue for security problems.**

Email **sitharaj.info@gmail.com** with:
- A description of the issue and its impact
- Reproduction steps (or a minimal proof-of-concept)
- Affected version(s)

You should receive an acknowledgement within 72 hours. We aim to publish a fix within 30 days for valid reports, faster for high-severity issues.

## Scope

In scope:
- Vulnerabilities in `quartz-ui` runtime code (XSS in web targets, prototype pollution, unsafe URL handling, etc.)
- Supply-chain risks introduced by the package's published artifacts

Out of scope:
- Vulnerabilities in peer dependencies (`react-native`, `expo-*`, `react-native-reanimated`) — please report those upstream
- Issues in the demo or docs apps that don't affect library consumers
- Theoretical attacks requiring physical device access

## Coordinated disclosure

We follow responsible disclosure. Once a fix is published, the reporter is credited (unless they prefer to stay anonymous) in the release notes.
