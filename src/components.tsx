import { defaults } from "@/constants";
import { useResolvedSrc } from "@/hooks";
import { fallbackRenderer, resolveRenderer } from "@/lib/rendererRegistry";
import { composeProps, getFileType } from "@/lib/utils";
import styles from "@/style.module.css";
import type { FilePreviewerProps, LoaderProps, RenderContext, State } from "@/types";
import React, { useMemo, useState } from "react";

const { additionalContext: defaultContext, customRenderers: defaultRenderers, props: defaultProps } = defaults;

export default function FilePreviewer<T extends object = {}>({
  src,
  mimeType,
  fileName = "",
  autoPlay = false,
  loader = <Loader />,
  customRenderers = defaultRenderers,
  additionalContext = defaultContext as T,
  errorRenderer = fallbackRenderer,
  containerProps = defaultProps,
  iconProps = defaultProps,
  onLoad,
  onError,
}: FilePreviewerProps<T>) {
  const resolvedSrc = useResolvedSrc(src);
  const fileType = useMemo(() => getFileType(mimeType, fileName), [mimeType, fileName]);
  const fileKey = `${resolvedSrc}|${fileType}|${fileName}`;
  const [state, setState] = useState<State>({
    key: fileKey,
    status: "loading",
  });

  if (state.key !== fileKey) setState({ key: fileKey, status: "loading" });

  const isLoading = state.status === "loading";

  const handleLoad = () => {
    setState((prev) => {
      if (prev.key !== fileKey || prev.status !== "loading") return prev;
      onLoad?.();
      return { key: fileKey, status: "ready" };
    });
  };
  const handleError = () => {
    setState((prev) => {
      if (prev.key !== fileKey || prev.status === "error") return prev;
      onError?.();
      return { key: fileKey, status: "error" };
    });
  };

  const context: RenderContext<T> = {
    src: resolvedSrc,
    mimeType: fileType,
    fileName,
    autoPlay,
    iconProps,
    onLoad: handleLoad,
    onError: handleError,
    ...additionalContext,
  };
  const renderer = useMemo(() => resolveRenderer<T>(customRenderers, context), [resolvedSrc, fileType, fileName, autoPlay, additionalContext]);
  const ActiveRenderer = state.status === "error" ? errorRenderer : renderer;

  return (
    <>
      {isLoading && loader}
      <div
        {...composeProps(styles["container"], containerProps, {
          style: { visibility: isLoading ? "hidden" : "visible" },
        })}
      >
        <ActiveRenderer.Component key={fileKey} {...context} />
      </div>
    </>
  );
}

function Loader({ children, text }: LoaderProps) {
  return (
    <div className={styles["loader"]}>
      <div className={styles["loader-spinner"]} />
      {children ?? <div className={styles["loader-text"]}>{text}</div>}
    </div>
  );
}
