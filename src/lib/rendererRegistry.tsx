import Mime from "mime/lite";
import React, { useEffect, useMemo, useState } from "react";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import { RenderContext, Renderer } from "../types.js";
import { composeProps, fetchResource } from "./utils.js";

const audioRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType.startsWith("audio/"),
  Component({ src, mimeType, fileName, autoPlay, onLoad, onError }) {
    return (
      <audio controls autoPlay={autoPlay} onCanPlay={onLoad} onError={onError} style={{ width: "100%" }} aria-label={fileName || "Audio preview"}>
        <source src={src} type={mimeType} />
      </audio>
    );
  },
};

export const fallbackRenderer: Renderer = {
  Component({ mimeType, iconProps, onLoad }) {
    const extension = useMemo(() => (Mime.getExtension(mimeType) ?? "") as DefaultExtensionType, [mimeType]);

    useEffect(() => {
      onLoad();
    }, []);

    return (
      <div {...composeProps("rfpe-icon", iconProps)}>
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

    return <iframe src={`data:text/html; charset=utf-8,${encodeURIComponent(data)}`} sandbox="" className="rfpe-iframe" />;
  },
};

const imageRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType.startsWith("image/"),
  Component({ src, fileName, onLoad, onError }) {
    return <img src={src} alt={fileName || "Image preview"} onLoad={onLoad} onError={onError} style={{ width: "100%", height: "100%" }} />;
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

    return <iframe src={data} className="rfpe-iframe" />;
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

    return <div style={{ width: "100%", height: "100%", overflow: "auto", whiteSpace: "pre-wrap" }}>{data}</div>;
  },
};

const videoRenderer: Renderer = {
  canRender: ({ mimeType }) => mimeType.startsWith("video/"),
  Component({ src, mimeType, fileName, autoPlay, onLoad, onError }) {
    return (
      <video controls autoPlay={autoPlay} onCanPlay={onLoad} onError={onError} style={{ width: "100%", height: "100%" }} aria-label={fileName || "Video preview"}>
        <source src={src} type={mimeType} />
      </video>
    );
  },
};

const defaultRenderers = [textRenderer, pdfRenderer, htmlRenderer, imageRenderer, audioRenderer, videoRenderer];

export function resolveRenderer<T extends object>(customRenderers: Renderer<T>[], ctx: RenderContext<T>): Renderer<T> {
  return customRenderers.concat(defaultRenderers).find((r) => r.canRender?.(ctx)) ?? fallbackRenderer;
}
