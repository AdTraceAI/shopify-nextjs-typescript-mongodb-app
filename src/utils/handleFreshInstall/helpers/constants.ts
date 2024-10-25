export const SHOPIFY_STORE_INFO_QUERY = `{
  shop {
    name
    createdAt
    email
    id
    ianaTimezone
    myshopifyDomain
    domains {
      url
      id
      host
      sslEnabled
    }
    plan {
      displayName
      partnerDevelopment
      shopifyPlus
    }
    shopOwnerName
    updatedAt
    url
    currencyCode
  }
}`;
