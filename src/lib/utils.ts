import Mime from "mime/lite";
import { DefaultExtensionType } from "react-file-icon";
import { fileExtensionRegex } from "../constants.js";
import { DivProps, FetchType } from "../types.js";

const composeClass = (baseClass: string, props?: DivProps) => `${baseClass}${props?.className ? " " + props.className : ""}`;

export const composeProps = (baseClass: string, props?: DivProps, overrideProps?: DivProps): DivProps => {
  const mergedProps = { ...props, ...overrideProps };
  return {
    ...mergedProps,
    style: { ...props?.style, ...overrideProps?.style },
    className: composeClass(baseClass, mergedProps),
  };
};

export function fetchResource(src: string, type: "text", signal?: AbortSignal): Promise<string>;
export function fetchResource(src: string, type: "json", signal?: AbortSignal): Promise<unknown>;
export function fetchResource(src: string, type: "blob", signal?: AbortSignal): Promise<Blob>;
export function fetchResource(src: string, type: "arrayBuffer", signal?: AbortSignal): Promise<ArrayBuffer>;
export async function fetchResource(src: string, type: FetchType, signal?: AbortSignal) {
  const res = await fetch(src, { signal });
  if (!res.ok) throw new Error();
  return res[type]();
}

export const getExtension = (mimeType: string, fileName?: string) => (Mime.getExtension(mimeType) ?? fileName?.match(fileExtensionRegex)?.[1] ?? "") as DefaultExtensionType;
