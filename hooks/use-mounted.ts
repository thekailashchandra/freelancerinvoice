"use client";

import { useEffect, useState } from "react";

/** False on server and first client paint; true after mount. Avoids hydration mismatch. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
