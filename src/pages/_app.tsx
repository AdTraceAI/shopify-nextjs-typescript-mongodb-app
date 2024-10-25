import Link from "next/link";
import translations from "@shopify/polaris/locales/en.json";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import AppBridgeProvider from "@/components/providers/AppBridgeProvider";
import "@shopify/polaris/build/esm/styles.css";

const App = ({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: any;
}) => {
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider>
        <ui-nav-menu>
          <Link href="/debug">Debug Cards</Link>
        </ui-nav-menu>
        <Component {...pageProps} />
      </AppBridgeProvider>
    </PolarisProvider>
  );
};

export default App;
