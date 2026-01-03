# react-file-preview-engine

A renderer driven React file preview engine designed for extensibility, correctness, and long term maintainability.

`react-file-preview-engine` lets you preview files by delegating rendering to small, isolated renderers that decide if they can handle a file based on runtime context. It supports common media types out of the box and makes it trivial to add or override renderers for custom formats.

## Why react-file-preview-engine

Inspired by [`@codesmith-99/react-file-preview`](https://github.com/AbdulmueezEmiola/React-File-Previewer) and redesigned to address its architectural and maintenance limitations.

- Renderer driven architecture instead of hard coded conditional rendering
- Built in support for images, video, audio, pdf, html, and plain text
- Automatic MIME type resolution using file name when needed
- Supports multiple file source types including URL, File, Blob, and ArrayBuffer
- Stable loading, ready, and error state handling
- Abortable fetches with proper cleanup for fast file switching
- First class support for custom renderers
- Optional, fully typed additional render context
- Pluggable error renderer
- Fully typed public API
- React is not bundled as a direct dependency
- Actively maintained and designed for long term extensibility

## Installation

```bash
# npm
npm install react-file-preview-engine

# yarn
yarn add react-file-preview-engine

# pnpm
pnpm add react-file-preview-engine

# bun
bun add react-file-preview-engine
```

## Usage

`react-file-preview-engine` exposes a single default export, the `<FilePreviewer />` component.

You can pass it a file source and basic file metadata. The source can be a `URL`, `File`, `Blob`, or `ArrayBuffer`. Using the provided MIME type or file name, the engine dynamically resolves the most suitable renderer at runtime.

### Basic Usage

This is the minimal setup. The previewer automatically infers the MIME type from `fileName` if not provided.

```tsx
import React from "react";
import FilePreviewer from "react-file-preview-engine";

export default function App() {
  return <FilePreviewer src="https://example.com/sample.pdf" fileName="sample.pdf" />;
}
```

### Previewing Local Files

You can preview files selected by the user without uploading them first. The engine automatically converts File, Blob, and ArrayBuffer sources to object URLs internally.

```tsx
import React, { useState } from "react";
import FilePreviewer from "react-file-preview-engine";

export default function App() {
  const [file, setFile] = useState<File>();

  return (
    <>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      {file && <FilePreviewer src={file} fileName={file.name} mimeType={file.type} />}
    </>
  );
}
```

### Providing MIME Type Explicitly

If you already know the MIME type, you can pass it directly. This ensures the engine uses the correct renderer even when inference is not possible.

```tsx
import React from "react";
import FilePreviewer from "react-file-preview-engine";

export default function App() {
  return <FilePreviewer src={new Blob(["Hello world"], { type: "text/plain" })} mimeType="text/plain" fileName="hello.txt" />;
}
```

### Handling Load and Error Events

You can listen to lifecycle events triggered by the active renderer.

```tsx
import React from "react";
import FilePreviewer from "react-file-preview-engine";

export default function App() {
  return (
    <FilePreviewer
      src="/document.pdf"
      fileName="document.pdf"
      onLoad={() => {
        console.log("File loaded");
      }}
      onError={() => {
        console.error("Failed to load file");
      }}
    />
  );
}
```

### Auto Play Media Files

For audio and video files, you can enable auto play.

```tsx
import React from "react";
import FilePreviewer from "react-file-preview-engine";

export default function App() {
  return <FilePreviewer src="https://example.com/video.mp4" fileName="video.mp4" autoPlay={true} />;
}
```

### Partial Customization

You can customize the loader, container props, and icon props without modifying any renderers.

```tsx
import React from "react";
import FilePreviewer from "react-file-preview-engine";

export default function App() {
  return (
    <FilePreviewer
      src="/image.jpg"
      fileName="image.jpg"
      loader={<div>Loading preview…</div>}
      containerProps={{ style: { border: "1px solid #e5e7eb", padding: 8 } }}
      iconProps={{ style: { fontSize: 48 } }}
    />
  );
}
```

### Custom Error Renderer

When a renderer reports an error, the previewer switches to `errorRenderer`.

```tsx
import React from "react";
import FilePreviewer from "react-file-preview-engine";

const errorRenderer = {
  Component() {
    return <div>Preview unavailable</div>;
  },
};

export default function App() {
  return <FilePreviewer src="/missing.pdf" fileName="missing.pdf" errorRenderer={errorRenderer} />;
}
```

### Custom Renderers

`react-file-preview-engine` resolves previews using renderers. A renderer declares whether it can handle a file using `canRender` and renders the preview inside its `Component`.

Renderers receive a render context that includes `src`, `mimeType`, `fileName`, lifecycle callbacks, and any values passed via `additionalContext`. The same context mechanism applies to `customRenderers` and `errorRenderer`.

#### Renderer Resolution Order

When previewing a file, the engine checks renderers in this order:

1. Your `customRenderers` (from first to last)
2. Built-in default renderers
3. `fallbackRenderer` (icon fallback)

This means you can **override** built-in renderers by providing a custom renderer with the same `canRender` logic.

#### Markdown Renderer Example

This example adds support for markdown files.

```tsx
import React, { useEffect, useState } from "react";
import FilePreviewer from "react-file-preview-engine";
import type { Renderer } from "react-file-preview-engine/types";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useRemark } from "react-remarkify";
import rehypeSanitize from "rehype-sanitize";

const markdownRenderer: Renderer = {
  name: "markdown",
  canRender({ mimeType }) {
    return mimeType === "text/markdown";
  },
  Component({ src, onLoad, onError }) {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
      const controller = new AbortController();

      fetch(src, { signal: controller.signal })
        .then((res) => res.text())
        .then((text) => {
          setMarkdown(text);
          onLoad();
        })
        .catch(onError);

      return () => controller.abort();
    }, [src]);

    const reactContent = useRemark({
      markdown,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeRaw, rehypeSanitize],
      remarkToRehypeOptions: { allowDangerousHtml: true },
    });

    return <div>{reactContent}</div>;
  },
};

export default function App() {
  return <FilePreviewer src="/README.md" fileName="README.md" customRenderers={[markdownRenderer]} />;
}
```

#### Passing Additional Context

You can extend renderers with custom configuration using `additionalContext`. This example enhances the markdown renderer to toggle between HTML and raw text rendering.

> **Important:** `additionalContext` must remain stable across renders. Use `useMemo` for dynamic values or define it outside your component for static values.

```tsx
import React, { useEffect, useMemo, useState } from "react";
import FilePreviewer from "react-file-preview-engine";
import type { Renderer } from "react-file-preview-engine/types";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useRemark } from "react-remarkify";
import rehypeSanitize from "rehype-sanitize";

const markdownRenderer: Renderer<{ renderAsHtml?: boolean }> = {
  name: "markdown",
  canRender({ mimeType }) {
    return mimeType === "text/markdown";
  },
  Component({ src, onLoad, onError, renderAsHtml = true }) {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
      const controller = new AbortController();

      fetch(src, { signal: controller.signal })
        .then((res) => res.text())
        .then((text) => {
          setMarkdown(text);
          onLoad();
        })
        .catch(onError);

      return () => controller.abort();
    }, [src]);

    const reactContent = useRemark({
      markdown,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeRaw, rehypeSanitize],
      remarkToRehypeOptions: { allowDangerousHtml: true },
    });

    return renderAsHtml ? <div>{reactContent}</div> : <pre>{markdown}</pre>;
  },
};

export default function App() {
  const [renderAsHtml, setRenderAsHtml] = useState(true);
  const additionalContext = useMemo(() => ({ renderAsHtml }), [renderAsHtml]); // Keep stable across renders

  return (
    <>
      <button onClick={() => setRenderAsHtml(!renderAsHtml)}>Toggle {renderAsHtml ? "Raw" : "HTML"}</button>
      <FilePreviewer src="/README.md" fileName="README.md" customRenderers={[markdownRenderer]} additionalContext={additionalContext} />
    </>
  );
}
```

#### Default Renderers

The library includes built-in renderers for text, pdf, html, images, audio, and video. These handle common file types without any configuration.

You can explore the actual renderer definitions in the [`defaultRenderers` constant on GitHub](https://github.com/SahilAggarwal2004/react-file-preview-engine/blob/main/src/lib/rendererRegistry.tsx).

## API Reference

### FilePreviewer Props

| Prop                | Type                            | Required | Default                                                                                                                     | Description                                                           |
| ------------------- | ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `src`               | [`FileSource`](#filesource)     | Yes      | –                                                                                                                           | Source URL of the file to preview                                     |
| `mimeType`          | `string`                        | No       | inferred                                                                                                                    | MIME type of the file                                                 |
| `fileName`          | `string`                        | No       | -                                                                                                                           | Used for MIME inference and accessibility                             |
| `autoPlay`          | `boolean`                       | No       | `false`                                                                                                                     | Auto play audio and video                                             |
| `loader`            | `ReactNode`                     | No       | [`<Loader />`](https://github.com/SahilAggarwal2004/react-file-preview-engine/blob/main/src/components.tsx)                 | Shown while the file is loading                                       |
| `customRenderers`   | [`Renderer[]`](#renderer)       | No       | -                                                                                                                           | Additional or overriding renderers                                    |
| `additionalContext` | `object`                        | No       | -                                                                                                                           | Extra data passed to the renderers. Must remain stable across renders |
| `errorRenderer`     | [`Renderer`](#renderer)         | No       | [`fallbackRenderer`](https://github.com/SahilAggarwal2004/react-file-preview-engine/blob/main/src/lib/rendererRegistry.tsx) | Renderer used on error                                                |
| `containerProps`    | [`DivProps`](#divprops)         | No       | -                                                                                                                           | Props applied to preview container                                    |
| `iconProps`         | [`DivProps`](#divprops)         | No       | -                                                                                                                           | Props applied to fallback icon                                        |
| `onLoad`            | [`Eventhandler`](#eventhandler) | No       | –                                                                                                                           | Called when preview is ready                                          |
| `onError`           | [`Eventhandler`](#eventhandler) | No       | –                                                                                                                           | Called when preview fails                                             |

## Types

### DivProps

```typescript
import { DetailedHTMLProps, HTMLAttributes } from "react";

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
```

### EventHandler

```ts
export type EventHandler = () => void;
```

### FileSource

```ts
export type FileSource = string | File | Blob | ArrayBuffer;
```

### Renderer

```ts
type RenderContext<T extends object = {}> = {
  src: string;
  mimeType: string;
  fileName: string;
  autoPlay: boolean;
  iconProps: DivProps;
  onLoad: () => void;
  onError: () => void;
} & T;
type Renderer<T extends object = {}> = {
  name?: string;
  canRender?(ctx: RenderContext<T>): boolean;
  Component(ctx: RenderContext<T>): JSX.Element;
};
```

## Author

[Sahil Aggarwal](https://github.com/SahilAggarwal2004)
