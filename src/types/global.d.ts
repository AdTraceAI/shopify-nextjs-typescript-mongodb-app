declare global {
  interface Window {
    shopify?: {
      config?: {
        shop?: string;
      };
      resourcePicker?: (options: any) => Promise<any>;
    };
  }
  var mongoose: {
    conn: any;
    promise: Promise<typeof mongoose> | null;
  };
}
