// Minimal stand-in for the `framer` module so the real components bundle
// outside Framer. Only the pieces the kit touches are implemented.
export const ControlType = {
  Boolean: "boolean",
  Number: "number",
  String: "string",
  Color: "color",
  Enum: "enum",
  Font: "font",
  Link: "link",
  Array: "array",
  Object: "object",
  ResponsiveImage: "responsiveimage",
  Image: "image",
} as const

export function addPropertyControls(_component: unknown, _controls: unknown): void {}

export const RenderTarget = {
  canvas: "CANVAS",
  export: "EXPORT",
  thumbnail: "THUMBNAIL",
  preview: "PREVIEW",
  current(): string {
    return "PREVIEW"
  },
}
