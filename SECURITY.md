# Security Policy

## Reporting Security Issues

⚠️ **PRIVATE REPOSITORY - INTERNAL USE ONLY** ⚠️

This repository is private and for SimHop IT & Media AB team use only. If you have discovered a security vulnerability, please:

1. **DO NOT** create a public GitHub issue
2. Contact our security team immediately:
   - 📧 Email: security@simhop.se
   - 📱 Emergency: +46-76-427-1243 (Amadeus)

## For Team Members

If you discover a security vulnerability:

1. Document the issue with detailed steps to reproduce
2. Contact the security team immediately
3. Do not commit any fixes until cleared by the security team
4. Follow our internal security protocols

## Security Updates

Security updates are handled internally by the SimHop IT & Media AB team. We do not publish security advisories publicly.

## Server Trust Configuration

Users can now configure server-level trust to allow all tools from specific servers without individual prompts:

1. Add the server to `trustedServers` array in the config
2. Set `allowAllToolsFromTrustedServers` to true
3. All tools from trusted servers will run without prompts

Add the following to your `claude_desktop_config.json`:
```json
{
  "security": {
    "trustedServers": ["mcp.local"],
    "allowAllToolsFromTrustedServers": true
  }
}
```

**Note:** Only enable server trust for servers you fully control and trust. 