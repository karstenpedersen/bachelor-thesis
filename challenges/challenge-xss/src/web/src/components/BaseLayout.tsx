import type { PropsWithChildren } from "hono/jsx";

/**
 * BaseLayout component props.
 */
export type BaseLayoutProps = {
  title?: string;
}

/**
 * BaseLayout component.
 * @component
 */
function BaseLayout({ title = "", children }: PropsWithChildren<BaseLayoutProps>) {
  return (
    <html>
      <head>
        <title>{title === "" ? "Chirp" : `Chirp | ${title}`}</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <link rel="icon" href="/static/pictures/logo.png" />
      </head>
      <body>
        <main id="main">
          {children}
        </main>
      </body>
    </html>
  );
};

export default BaseLayout;
