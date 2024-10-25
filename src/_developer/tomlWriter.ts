import toml from "@iarna/toml";
import "dotenv/config";
import fs from "fs";
import path from "path";
import setupCheck from "@/utils/setupCheck";
import webhookWriter from "./webhookWriter";
import {
  AccessConfig,
  AccessScopes,
  AdminAccessConfig,
  AppConfig,
  AppProxyConfig,
  AuthConfig,
  BuildConfig,
  POSConfig,
  PrivacyComplianceConfig,
  WebhooksConfig,
} from "./types";

let config: AppConfig = {} as AppConfig;

try {
  setupCheck(); //Run setup check to ensure all env variables are accessible

  let appUrl = process.env.SHOPIFY_APP_URL;
  if (appUrl && appUrl.endsWith("/")) {
    appUrl = appUrl.slice(0, -1);
  }
  // Globals
  config.name = process.env.APP_NAME!;
  config.handle = process.env.APP_HANDLE!;
  config.client_id = process.env.SHOPIFY_API_KEY!;
  config.application_url = appUrl!;
  config.embedded = true;
  config.extension_directories = ["../extension/extensions/*"];

  // Auth
  config.auth = {} as AuthConfig;
  config.auth.redirect_urls = [`${appUrl}/api/`];
  // Scopes
  config.access_scopes = {} as AccessScopes;
  config.access_scopes.scopes = process.env.SHOPIFY_API_SCOPES!;
  config.access_scopes.use_legacy_install_flow = false;

  if (
    process.env.DIRECT_API_MODE &&
    process.env.EMBEDDED_APP_DIRECT_API_ACCESS
  ) {
    // Access
    config.access = {} as AccessConfig;
    config.access.admin = {} as AdminAccessConfig;
    process.env.DIRECT_API_MODE
      ? (config.access.admin.direct_api_mode = process.env.DIRECT_API_MODE as
          | "online"
          | "offline")
      : null;
    process.env.EMBEDDED_APP_DIRECT_API_ACCESS
      ? (config.access.admin.embedded_app_direct_api_access =
          process.env.EMBEDDED_APP_DIRECT_API_ACCESS === "true")
      : null;
  }

  // Webhook event version to always match the app API version
  config.webhooks = {} as WebhooksConfig;
  config.webhooks.api_version =
    (process.env.SHOPIFY_API_VERSION as
      | "2024-10"
      | "2024-07"
      | "2024-04"
      | "2024-01"
      | undefined) || "2024-10";

  // Webhooks
  webhookWriter(config);

  // GDPR URLs
  config.webhooks.privacy_compliance = {} as PrivacyComplianceConfig;
  config.webhooks.privacy_compliance.customer_data_request_url = `${appUrl}/api/gdpr/customers_data_request`;
  config.webhooks.privacy_compliance.customer_deletion_url = `${appUrl}/api/gdpr/customers_redact`;
  config.webhooks.privacy_compliance.shop_deletion_url = `${appUrl}/api/gdpr/shop_redact`;

  // App Proxy
  if (
    process.env.APP_PROXY_PREFIX &&
    process.env.APP_PROXY_SUBPATH &&
    process.env.APP_PROXY_PREFIX.length > 0 &&
    process.env.APP_PROXY_SUBPATH.length > 0
  ) {
    config.app_proxy = {} as AppProxyConfig;
    config.app_proxy.url = `${appUrl}/api/proxy_route`;
    config.app_proxy.prefix =
      (process.env.APP_PROXY_PREFIX as
        | "apps"
        | "a"
        | "community"
        | "tools"
        | undefined) || "apps";
    config.app_proxy.subpath = process.env.APP_PROXY_SUBPATH;
  }

  // PoS
  if (process.env.POS_EMBEDDED && process.env.POS_EMBEDDED.length > 1) {
    config.pos = {} as POSConfig;
    config.pos.embedded = process.env.POS_EMBEDDED === "true";
  }

  //Build
  config.build = {} as BuildConfig;
  config.build.include_config_on_deploy = true;

  //Write to toml
  let str = toml.stringify(JSON.parse(JSON.stringify(config)));
  str =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" + str;

  fs.writeFileSync(path.join(process.cwd(), "shopify.app.toml"), str);

  console.log("Written TOML to root");

  const extensionsDir = path.join("..", "extension");

  config.extension_directories = ["./extensions/*"];
  let extensionStr = toml.stringify(JSON.parse(JSON.stringify(config)));
  extensionStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    extensionStr;

  config.extension_directories = ["extension/extensions/*"];
  let globalStr = toml.stringify(JSON.parse(JSON.stringify(config)));
  globalStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    globalStr;

  if (fs.existsSync(extensionsDir)) {
    fs.writeFileSync(
      path.join(process.cwd(), "..", "shopify.app.toml"),
      globalStr
    );

    console.log("Written TOML to root");

    fs.writeFileSync(
      path.join(extensionsDir, "shopify.app.toml"),
      extensionStr
    );

    console.log("Written TOML to extension");
  }

  console.log(config);
} catch (e) {
  console.error("---> An error occured while writing toml files");
  console.log((e as Error).message);
}
