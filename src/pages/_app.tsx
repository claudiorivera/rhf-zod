import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="mx-auto max-w-sm py-8">
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
