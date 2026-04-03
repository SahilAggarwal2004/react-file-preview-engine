import { composeProps, fetchResource, getFileExtension } from "@/lib/utils";
import styles from "@/style.module.css";
import type { RenderContext, Renderer } from "@/types";
import React, { useEffect, useMemo, useState } from "react";
import { defaultStyles, FileIcon } from "react-file-icon";

const audioRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType.startsWith("audio/"),
  Component({ src, mimeType, fileName, autoPlay, onLoad, onError }) {
    return (
      <audio className={styles["audio"]} controls autoPlay={autoPlay} onCanPlay={onLoad} onError={onError} aria-label={fileName || "Audio preview"}>
        <source src={src} type={mimeType} />
      </audio>
    );
  },
};

export const fallbackRenderer: Renderer = {
  Component({ mimeType, fileName, iconProps, onLoad }) {
    const extension = useMemo(() => getFileExtension(mimeType, fileName), [mimeType, fileName]);

    useEffect(() => {
      onLoad();
    }, []);

    return (
      <div {...composeProps(styles["icon"], iconProps)}>
        <FileIcon extension={extension} {...defaultStyles[extension]} />
      </div>
    );
  },
};

const htmlRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType === "text/html",
  Component({ src, onLoad, onError }) {
    const [data, setData] = useState("");

    useEffect(() => {
      const controller = new AbortController();

      fetchResource(src, "text", controller.signal)
        .then((data) => {
          setData(data);
          onLoad();
        })
        .catch(onError);

      return () => controller.abort();
    }, [src]);

    return <iframe className={styles["iframe"]} src={`data:text/html; charset=utf-8,${encodeURIComponent(data)}`} sandbox="" />;
  },
};

const imageRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType.startsWith("image/"),
  Component({ src, fileName, onLoad, onError }) {
    return <img className={styles["image"]} src={src} alt={fileName || "Image preview"} onLoad={onLoad} onError={onError} />;
  },
};

const pdfRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType === "application/pdf",
  Component({ src, onLoad, onError }) {
    const [data, setData] = useState("");

    useEffect(() => {
      const controller = new AbortController();
      let objectUrl: string;

      fetchResource(src, "arrayBuffer", controller.signal)
        .then((buffer) => {
          const blob = new Blob([buffer], { type: "application/pdf" });
          objectUrl = URL.createObjectURL(blob);
          setData(objectUrl);
          onLoad();
        })
        .catch(onError);

      return () => {
        controller.abort();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }, [src]);

    return <iframe className={styles["iframe"]} src={data} />;
  },
};

const textRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType === "text/plain",
  Component({ src, onLoad, onError }) {
    const [data, setData] = useState("");

    useEffect(() => {
      const controller = new AbortController();

      fetchResource(src, "text", controller.signal)
        .then((data) => {
          setData(data);
          onLoad();
        })
        .catch(onError);

      return () => controller.abort();
    }, [src]);

    return <div className={styles["text"]}>{data}</div>;
  },
};

const videoRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType.startsWith("video/"),
  Component({ src, mimeType, fileName, autoPlay, onLoad, onError }) {
    return (
      <video className={styles["video"]} controls autoPlay={autoPlay} onCanPlay={onLoad} onError={onError} aria-label={fileName || "Video preview"}>
        <source src={src} type={mimeType} />
      </video>
    );
  },
};

const defaultRenderers = [textRenderer, pdfRenderer, htmlRenderer, imageRenderer, audioRenderer, videoRenderer];

export function resolveRenderer<T extends object>(customRenderers: Renderer<T>[], ctx: RenderContext<T>): Renderer<T> {
  return customRenderers.concat(defaultRenderers).find((r) => r.canRender?.(ctx)) ?? fallbackRenderer;
}
