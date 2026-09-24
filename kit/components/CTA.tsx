import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useReducedMotion } from "framer-motion"
// @include helpers

/**
 * OFF+BRAND CTA — the closing invitation: two display lines, a ghost pill and
 * the studio email, with the ring ornament and orbiting dot (no sphere; the
 * gradient appears once per page, in the hero).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 720
 * @framerDisableUnlink
 */
export default function CTA(props: Partial<CTAProps>) {
    const p = { ...CTA_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w, h } = useSize(ref, { w: 1440, h: 720 })
    const mobile = w < 720
    const reduced = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const animate = !reduced && !isCanvas && p.orbitSeconds > 0
    const size = fluid(p.size, w, p.minSize, p.maxSize)
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const ring = Math.round(Math.max(360, Math.min(w * 0.6, h * 1.1)))
    const dot = Math.round(ring * 0.03)

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                minHeight: p.minHeight,
                ...props.style,
                position: "relative",
                overflow: "hidden",
                background: p.background,
                color: p.textColor,
                padding: `${p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: Math.round(size * 0.45),
                borderTop: p.hairlineTop ? `1px solid ${p.hairline}` : undefined,
            }}
        >
            {p.rings && (
                <div aria-hidden="true" style={{ position: "absolute", left: mobile ? "50%" : "72%", top: "48%", width: ring, height: ring, transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                    <div style={{ position: "absolute", inset: "22%", borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                    <motion.div
                        style={{ position: "absolute", inset: 0, rotate: 30 }}
                        animate={{ rotate: animate ? 390 : 30 }}
                        transition={animate ? { duration: p.orbitSeconds, ease: "linear", repeat: Infinity } : { duration: 0 }}
                    >
                        <div style={{ position: "absolute", left: "50%", top: 0, width: dot, height: dot, transform: "translate(-50%, -50%)", borderRadius: "50%", background: p.dotColor }} />
                    </motion.div>
                </div>
            )}
            {p.label && <p style={{ ...labelCss(p.font, labelSize, p.mutedColor), position: "relative" }}>{p.label}</p>}
            <h2
                style={{
                    ...fontCss(p.font, 500),
                    position: "relative",
                    fontSize: size,
                    lineHeight: 0.88,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    margin: 0,
                    maxWidth: "12ch",
                    textWrap: "balance" as any,
                }}
            >
                {p.line1}
                <br />
                {p.line2}
            </h2>
            <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", gap: mobile ? 16 : 28, marginTop: Math.round(size * 0.1) }}>
                {p.buttonLabel && <Pill label={p.buttonLabel} href={p.buttonLink || undefined} size={labelSize} color={p.textColor} hoverText={p.hoverText} border={p.hairline} font={p.font} />}
                {p.email && (
                    <a
                        href={`mailto:${p.email}`}
                        className="ob-cta-email"
                        style={{ ...fontCss(p.font, 500), fontSize: Math.round(labelSize * 1.25), letterSpacing: "0.013em", color: p.textColor, textDecoration: "none", borderBottom: `1px solid ${p.hairline}`, paddingBottom: 3 }}
                    >
                        {p.email}
                    </a>
                )}
            </div>
            <style>{`.ob-cta-email { transition: border-color .25s ease } .ob-cta-email:hover { border-color: ${p.textColor} }`}</style>
        </section>
    )
}

type CTAProps = {
    label: string
    line1: string
    line2: string
    buttonLabel: string
    buttonLink: string
    email: string
    font?: FramerFont
    size: number
    minSize: number
    maxSize: number
    labelSize: number
    rings: boolean
    ringColor: string
    dotColor: string
    orbitSeconds: number
    textColor: string
    mutedColor: string
    hoverText: string
    hairline: string
    hairlineTop: boolean
    background: string
    minHeight: number
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const CTA_DEFAULTS: CTAProps = {
    label: "New project",
    line1: "Let's make something",
    line2: "people remember",
    buttonLabel: "Start a project",
    buttonLink: "",
    email: "hello@itsoffbrand.com",
    font: undefined,
    size: 103,
    minSize: 40,
    maxSize: 170,
    labelSize: 13,
    rings: true,
    ringColor: HAIRLINE,
    dotColor: "#9e9e9c",
    orbitSeconds: 70,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hoverText: INK,
    hairline: HAIRLINE,
    hairlineTop: true,
    background: INK,
    minHeight: 680,
    padding: 20,
    topSpace: 160,
    bottomSpace: 120,
}

addPropertyControls(CTA, {
    label: { type: ControlType.String, title: "Label", defaultValue: CTA_DEFAULTS.label },
    line1: { type: ControlType.String, title: "Line 1", defaultValue: CTA_DEFAULTS.line1 },
    line2: { type: ControlType.String, title: "Line 2", defaultValue: CTA_DEFAULTS.line2 },
    buttonLabel: { type: ControlType.String, title: "Button", defaultValue: CTA_DEFAULTS.buttonLabel },
    buttonLink: { type: ControlType.Link, title: "Button link" },
    email: { type: ControlType.String, title: "Email", defaultValue: CTA_DEFAULTS.email },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    size: { type: ControlType.Number, title: "Size @1440", min: 32, max: 200, step: 1, unit: "px", defaultValue: 103 },
    minSize: { type: ControlType.Number, title: "Min size", min: 24, max: 100, step: 1, unit: "px", defaultValue: 40 },
    maxSize: { type: ControlType.Number, title: "Max size", min: 60, max: 300, step: 1, unit: "px", defaultValue: 170 },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    rings: { type: ControlType.Boolean, title: "Rings", defaultValue: true },
    ringColor: { type: ControlType.Color, title: "Ring colour", defaultValue: HAIRLINE, hidden: (p: { rings?: boolean }) => !p.rings },
    dotColor: { type: ControlType.Color, title: "Dot colour", defaultValue: CTA_DEFAULTS.dotColor, hidden: (p: { rings?: boolean }) => !p.rings },
    orbitSeconds: { type: ControlType.Number, title: "Orbit", min: 0, max: 300, step: 5, unit: "s", defaultValue: 70, hidden: (p: { rings?: boolean }) => !p.rings },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: CTA_DEFAULTS.mutedColor },
    hoverText: { type: ControlType.Color, title: "Pill hover text", defaultValue: INK },
    hairlineTop: { type: ControlType.Boolean, title: "Top hairline", defaultValue: true },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    minHeight: { type: ControlType.Number, title: "Min height", min: 300, max: 1200, step: 10, unit: "px", defaultValue: 680 },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 400, step: 1, unit: "px", defaultValue: 160 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 400, step: 1, unit: "px", defaultValue: 120 },
})
