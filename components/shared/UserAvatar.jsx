"use client";

import { useState } from "react";

export default function UserAvatar({ src, alt, initial }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} onError={() => setFailed(true)} className="w-full h-full object-cover" />
    );
  }
  return initial;
}
