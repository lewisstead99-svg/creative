import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
// @include helpers
// @include sphere

/**
 * OFF+BRAND Hero — three staggered display lines in difference blend over the
 * iridescent sphere, with ring ornaments, an orbiting dot and a scroll cue.
 *
 * Set the layer height to 100vh (or "Fit viewport"). Everything else is a
 * property control.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
 * @framerDisableUnlink
 */
export default function OffBrandHero(props: Partial<HeroProps>) {
    const p = { ...HERO_DEFAULTS, ...SPHERE_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w, h } = useSize(ref)
    const reduced = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const animate = !reduced && !isCanvas
    const mobile = w < 720
    const stacked = p.layout === "stacked" || mobile

    const fontSize = fluid(p.fontSize, w, p.minFontSize, p.maxFontSize)
    const cueSize = fluid(p.cueSize, w, 11, 18)
    const sidePad = Math.round((w * p.sidePad) / 100)
    const topPad = Math.round((h * p.topPad) / 100)
    const bottomPad = Math.round((h * p.bottomPad) / 100)
    const indent = stacked ? 0 : Math.round((w * p.line3Indent) / 100)

    const sphereDiameter =
        p.spherePosition === "fixed"
            ? `${p.sphereSize}vmin`
            : `${Math.round((Math.min(w, h) * p.sphereSize) / 100)}px`

    const line: React.CSSProperties = {
        ...fontCss(p.font, 500),
        fontSize,
        lineHeight: p.lineHeight,
        letterSpacing: `${p.letterSpacing}em`,
        textTransform: "uppercase",
        color: p.textColor,
        mixBlendMode: p.blend ? "difference" : "normal",
        whiteSpace: "nowrap",
        margin: 0,
    }

    const cue = (
        <a
            href={p.cueLink || undefined}
            className="ob-hero-cue"
            style={{
                ...fontCss(p.font, 500),
                fontSize: cueSize,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: p.textColor,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35em",
                lineHeight: 1,
                mixBlendMode: p.blend ? "difference" : "normal",
                borderRadius: 10,
                padding: "5px 0",
                whiteSpace: "nowrap",
            }}
        >
            {p.cueText}
            <svg width="0.75em" height="0.75em" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </a>
    )

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                height: "100%",
                ...props.style,
                minHeight: 480,
                position: "relative",
                overflow: "hidden",
                background: p.background,
                boxSizing: "border-box",
            }}
        >
            {p.showSphere && (
                <div
                    style={{
                        position: p.spherePosition,
                        inset: 0,
                        pointerEvents: "none",
                        ...(p.spherePosition === "fixed" ? { width: "100vw", height: "100vh" } : {}),
                    }}
                >
                    <SphereScene {...sceneFrom(p, sphereDiameter, animate)} />
                </div>
            )}

            {stacked ? (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: `${topPad}px ${sidePad}px ${bottomPad}px`,
                        boxSizing: "border-box",
                    }}
                >
                    <h1 style={{ ...line, whiteSpace: "normal", lineHeight: Math.max(p.lineHeight, 0.92) }}>
                        {p.line1}
                        <br />
                        {p.line2}
                        <br />
                        {p.line3}
                    </h1>
                    {p.showCue && (
                        <div style={{ position: "absolute", right: sidePad, bottom: bottomPad }}>{cue}</div>
                    )}
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "stretch",
                        padding: `${topPad}px ${sidePad}px ${bottomPad}px`,
                        boxSizing: "border-box",
                    }}
                >
                    <h1 style={{ ...line, alignSelf: "flex-start" }}>{p.line1}</h1>
                    <h1 style={{ ...line, alignSelf: "flex-end" }}>{p.line2}</h1>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <h1 style={{ ...line, marginLeft: indent }}>{p.line3}</h1>
                        {p.showCue && cue}
                    </div>
                </div>
            )}
            <style>{`.ob-hero-cue { transition: opacity .25s ease } .ob-hero-cue:hover { opacity: .6 }`}</style>
        </section>
    )
}

type HeroProps = SphereControlProps & {
    line1: string
    line2: string
    line3: string
    layout: "staggered" | "stacked"
    font?: FramerFont
    fontSize: number
    minFontSize: number
    maxFontSize: number
    lineHeight: number
    letterSpacing: number
    textColor: string
    blend: boolean
    sidePad: number
    topPad: number
    bottomPad: number
    line3Indent: number
    showCue: boolean
    cueText: string
    cueLink: string
    cueSize: number
    background: string
    showSphere: boolean
    spherePosition: "fixed" | "absolute"
    style?: React.CSSProperties
}

const HERO_DEFAULTS = {
    line1: "A different",
    line2: "creative",
    line3: "approach",
    layout: "staggered" as const,
    font: undefined as FramerFont | undefined,
    fontSize: 103,
    minFontSize: 44,
    maxFontSize: 170,
    lineHeight: 0.8,
    letterSpacing: 0.01,
    textColor: PARCHMENT,
    blend: true,
    sidePad: 9.6,
    topPad: 15.5,
    bottomPad: 14.5,
    line3Indent: 8.3,
    showCue: true,
    cueText: "Scroll",
    cueLink: "",
    cueSize: 15,
    background: INK,
    showSphere: true,
    spherePosition: "fixed" as const,
}

addPropertyControls(OffBrandHero, {
    line1: { type: ControlType.String, title: "Line 1", defaultValue: HERO_DEFAULTS.line1 },
    line2: { type: ControlType.String, title: "Line 2", defaultValue: HERO_DEFAULTS.line2 },
    line3: { type: ControlType.String, title: "Line 3", defaultValue: HERO_DEFAULTS.line3 },
    layout: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["staggered", "stacked"],
        optionTitles: ["Staggered", "Stacked block"],
        displaySegmentedControl: true,
        defaultValue: "staggered",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        description: "Pick your uploaded Ataero Retina OB, or Manrope / Instrument Sans as a stand-in.",
        defaultFontType: "sans-serif",
    },
    fontSize: {
        type: ControlType.Number,
        title: "Size @1440",
        description: "Display size at a 1440px wide layer; it scales with width between Min and Max.",
        min: 40,
        max: 200,
        step: 1,
        unit: "px",
        defaultValue: 103,
    },
    minFontSize: { type: ControlType.Number, title: "Min size", min: 24, max: 120, step: 1, unit: "px", defaultValue: 44 },
    maxFontSize: { type: ControlType.Number, title: "Max size", min: 60, max: 300, step: 1, unit: "px", defaultValue: 170 },
    lineHeight: { type: ControlType.Number, title: "Line height", min: 0.7, max: 1.4, step: 0.05, defaultValue: 0.8 },
    letterSpacing: { type: ControlType.Number, title: "Tracking", min: -0.05, max: 0.1, step: 0.005, unit: "em", defaultValue: 0.01 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    blend: {
        type: ControlType.Boolean,
        title: "Difference blend",
        description: "Inverts the headline wherever it crosses the sphere.",
        defaultValue: true,
    },
    sidePad: { type: ControlType.Number, title: "Side inset", min: 0, max: 25, step: 0.1, unit: "%", defaultValue: 9.6 },
    topPad: { type: ControlType.Number, title: "Top inset", min: 0, max: 40, step: 0.5, unit: "%", defaultValue: 15.5 },
    bottomPad: { type: ControlType.Number, title: "Bottom inset", min: 0, max: 40, step: 0.5, unit: "%", defaultValue: 14.5 },
    line3Indent: { type: ControlType.Number, title: "Line 3 indent", min: 0, max: 40, step: 0.1, unit: "%", defaultValue: 8.3 },
    showCue: { type: ControlType.Boolean, title: "Scroll cue", defaultValue: true },
    cueText: { type: ControlType.String, title: "Cue text", defaultValue: "Scroll", hidden: (p: { showCue?: boolean }) => !p.showCue },
    cueLink: { type: ControlType.Link, title: "Cue link", hidden: (p: { showCue?: boolean }) => !p.showCue },
    cueSize: { type: ControlType.Number, title: "Cue size", min: 10, max: 24, step: 1, unit: "px", defaultValue: 15, hidden: (p: { showCue?: boolean }) => !p.showCue },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    showSphere: { type: ControlType.Boolean, title: "Sphere", defaultValue: true },
    spherePosition: {
        type: ControlType.Enum,
        title: "Sphere pin",
        description: "Fixed keeps the sphere on screen into the next section (check in Preview, the canvas approximates it). Absolute keeps it inside the hero.",
        options: ["fixed", "absolute"],
        optionTitles: ["Fixed", "Inside hero"],
        displaySegmentedControl: true,
        defaultValue: "fixed",
        hidden: (p: { showSphere?: boolean }) => !p.showSphere,
    },
    ...SPHERE_CONTROLS,
})
