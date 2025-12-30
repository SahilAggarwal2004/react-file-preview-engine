import { DetailedHTMLProps, HTMLAttributes, JSX, ReactNode } from "react";

// components/loader.tsx
export type LoaderProps = {
  children?: ReactNode;
  text?: string;
};

// lib/rendererRegistry.tsx
export type EventHandler = () => void;

export type RenderBehaviour = {
  autoPlay: boolean;
  iconProps: DivProps;
  onLoad: EventHandler;
  onError: EventHandler;
};

export type RenderContext<T extends object = {}> = {
  src: string;
  mimeType: string;
  fileName: string;
} & RenderBehaviour &
  T;

export type Renderer<T extends object = {}> = {
  name?: string;
  canRender?(ctx: RenderContext<T>): boolean;
  Component(ctx: RenderContext<T>): JSX.Element;
};

// lib/utils.ts
export type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type FetchType = "text" | "arrayBuffer" | "blob" | "json";

// index.ts
export type FilePreviewerProps<T extends object> = {
  src: FileSource;
  loader?: ReactNode;
  customRenderers?: Renderer<T>[];
  additionalContext?: T;
  errorRenderer?: Renderer<T>;
  containerProps?: DivProps;
} & MimeTypeSource &
  RenderBehaviour;

export type FileSource = string | File | Blob | ArrayBuffer;

export type MimeTypeSource = { mimeType: string; fileName?: string } | { fileName: string; mimeType?: string };

export type State = { key: string; status: "loading" | "ready" | "error" };
