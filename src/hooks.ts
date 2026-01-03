import { useEffect, useMemo, useRef } from "react";

export function useResolvedSrc(src: string | File | Blob | ArrayBuffer): string {
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectURL = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  const resolvedSrc = useMemo(() => {
    revokeObjectURL();
    if (typeof src === "string") return src;
    const url = src instanceof File || src instanceof Blob ? URL.createObjectURL(src) : src instanceof ArrayBuffer ? URL.createObjectURL(new Blob([src])) : "";
    if (url) objectUrlRef.current = url;
    return url;
  }, [src]);

  useEffect(() => revokeObjectURL, []);

  return resolvedSrc;
}
