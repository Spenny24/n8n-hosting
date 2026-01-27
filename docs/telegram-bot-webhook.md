# Telegram Bot Webhook for n8n

Use this when BotFather asks for the HTTPS URL to open your bot from the menu button.

1. Confirm the **Webhook URL** shown in *Settings → Webhook URL* inside your n8n instance. For a default self-hosted install it is:
   ```text
   https://<your-public-n8n-domain>/webhook/telegram
   ```
   Replace `<your-public-n8n-domain>` with the domain exposed through your Cloudflare tunnel.
2. Paste that full HTTPS URL in BotFather when it asks for the "Open App" or menu button URL.
3. Ensure the domain uses a valid TLS certificate (Cloudflare provides one). Telegram rejects plain HTTP or self-signed certs.
4. If you change your n8n domain or tunnel, update the webhook URL in BotFather.

Pitfalls:
- The URL must be reachable from Telegram (test with `curl https://<your-public-n8n-domain>/webhook/telegram`).
- The Telegram Trigger node in n8n must be active (workflow set to **Active**) so n8n responds to the webhook.
- If you run multiple environments, make sure each bot points to the correct environment URL.
