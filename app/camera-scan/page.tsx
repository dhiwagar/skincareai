"use client";

import dynamic from "next/dynamic";

const CameraScan = dynamic(() => import("../../src/views/CameraScan"), { ssr: false });

export default function Page() {
  return <CameraScan />;
}
