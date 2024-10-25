/**
 *
 * Most of the `Build` config is omitted on purpose since we're not using CLI to run dev
 * Read about config more on:
 * https://shopify.dev/docs/apps/tools/cli/configuration
 *
 */

import { NextApiHandler } from "next";
import { WebhookTopic } from "./webhookTopics";

/**
 * Configuration for the Shopify app
 */
export interface AppConfig {
  name: string;
  handle: string;
  client_id: string;
  application_url: string;
  extension_directories: string[];
  embedded: boolean;
  access_scopes: AccessScopes;
  access: AccessConfig;
  auth: AuthConfig;
  webhooks: WebhooksConfig;
  app_proxy: AppProxyConfig;
  pos: POSConfig;
  preferences: PreferencesConfig;
  build: BuildConfig;
}

/**
 * Access scopes
 */
export interface AccessScopes {
  scopes: string;
  use_legacy_install_flow: boolean;
}

/**
 * Access config for Shopify APIs
 */
export interface AccessConfig {
  admin: AdminAccessConfig;
}

export interface AdminAccessConfig {
  direct_api_mode: "online" | "offline";
  embedded_app_direct_api_access: boolean;
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  redirect_urls: string[];
}

/**
 * Webhook configuration
 */
export interface WebhooksConfig {
  api_version: "2024-10" | "2024-07" | "2024-04" | "2024-01";
  subscriptions: WebhookSubscription[];
  privacy_compliance: PrivacyComplianceConfig;
}

/**
 * Webhook subscription
 */
export interface WebhookSubscription {
  topics: WebhookTopic[];
  url: string;
  uri?: string;
  callback?: NextApiHandler;
  filter?: string;
  include_fields?: string[];
}

/**
 * GDPR Strings
 */
export interface PrivacyComplianceConfig {
  customer_deletion_url: string;
  customer_data_request_url: string;
  shop_deletion_url: string;
}

/**
 * App proxy
 */
export interface AppProxyConfig {
  url: string;
  subpath: string;
  prefix: "apps" | "a" | "community" | "tools";
}

/**
 * Point of Sale (POS) configuration
 */
export interface POSConfig {
  embedded: boolean;
}

/**
 * Preferences configuration
 */
export interface PreferencesConfig {
  url: boolean;
}

/**
 * Build configuration
 */
export interface BuildConfig {
  include_config_on_deploy: boolean;
}
