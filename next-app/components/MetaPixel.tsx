"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { track } from "@/lib/track";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Loads the Meta Pixel base script once and fires a `PageView` on every
 * client-side route change.
 *
 * Place this once in the root layout. It renders nothing if the env var
 * isn't set, so local dev without a Pixel ID stays clean.
 */
export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

/** Fires a PageView on each route/query change. */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string>("");

  useEffect(() => {
    const fullPath = `${pathname}?${searchParams?.toString() || ""}`;
    if (fullPath === lastPath.current) return;
    lastPath.current = fullPath;
    track({ eventName: "PageView" });
  }, [pathname, searchParams]);

  return null;
}
