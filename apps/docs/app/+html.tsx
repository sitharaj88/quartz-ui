import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* This removes the base path from the URL before React Router sees it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var basePath = '/quartz-ui';
  if (window.location.pathname.startsWith(basePath)) {
    // Strip base path from pathname for the router
    var newPath = window.location.pathname.substring(basePath.length) || '/';
    var newUrl = newPath + window.location.search + window.location.hash;

    // Use replaceState to change URL without reload
    history.replaceState(null, '', newUrl);
  }
})();
            `.trim(),
          }}
        />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
