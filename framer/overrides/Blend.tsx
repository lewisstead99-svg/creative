import { forwardRef, type ComponentType } from "react"

/**
 * Code overrides for native Framer layers.
 *
 * Framer has no blend-mode control in the UI, so apply `withDifference` to any
 * text layer you draw yourself over the sphere and it inverts wherever the two
 * overlap, exactly like the headline in OffBrandHero.
 *
 * Select a layer → Code Overrides (right panel) → File: Blend → Override: withDifference.
 */
export function withDifference(Component: ComponentType<any>): ComponentType<any> {
    return forwardRef((props: any, ref) => (
        <Component ref={ref} {...props} style={{ ...props.style, mixBlendMode: "difference" }} />
    ))
}

/** Softer sibling of withDifference; keeps mid-tones lighter. */
export function withExclusion(Component: ComponentType<any>): ComponentType<any> {
    return forwardRef((props: any, ref) => (
        <Component ref={ref} {...props} style={{ ...props.style, mixBlendMode: "exclusion" }} />
    ))
}

/** Stops a wrapper from taking part in blending, so blends stay inside it. */
export function withIsolation(Component: ComponentType<any>): ComponentType<any> {
    return forwardRef((props: any, ref) => (
        <Component ref={ref} {...props} style={{ ...props.style, isolation: "isolate" }} />
    ))
}
