import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
// @include helpers
// @include sphere

/**
 * Iridescent Sphere — the OFF+BRAND signature gradient object, with its
 * concentric ring ornaments and an orbiting dot. Pure CSS, no image.
 *
 * Use it on its own (pin the layer as Fixed, put it behind everything and let
 * "Grow on scroll" carry it into the next section), or use OffBrandHero, which
 * has the same sphere built in.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
 * @framerDisableUnlink
 */
export default function IridescentSphere(
    props: Partial<SphereControlProps> & { style?: React.CSSProperties }
) {
    const p = { ...SPHERE_DEFAULTS, ...props }
    const ref = React.useRef<HTMLDivElement>(null)
    const { w, h } = useSize(ref)
    const reduced = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const animate = !reduced && !isCanvas
    const diameter = `${Math.round((Math.min(w, h) * p.sphereSize) / 100)}px`

    return (
        <div
            ref={ref}
            style={{
                width: "100%",
                height: "100%",
                ...props.style,
                position: "relative",
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            <SphereScene {...sceneFrom(p, diameter, animate)} />
        </div>
    )
}

addPropertyControls(IridescentSphere, SPHERE_CONTROLS)
