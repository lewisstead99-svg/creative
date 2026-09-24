import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers (kept inline so this file pastes into Framer on its own)
// ─────────────────────────────────────────────────────────────────────────────

const INK = "#1d1d1d"
const PARCHMENT = "#e5e4e0"
const ASH = "#bfbebe"
const FONT_STACK =
    '"Ataero Retina OB Edition", "Ataero Retina OB", Manrope, "Instrument Sans", Inter, ui-sans-serif, system-ui, sans-serif'

type FramerFont = {
    fontFamily?: string
    fontWeight?: number | string
    fontStyle?: string
}

/** Turns a Framer Font-control value into CSS, falling back to the brand stack. */
function fontCss(font: FramerFont | undefined, weight = 500): React.CSSProperties {
    return {
        fontFamily: font?.fontFamily ? `${font.fontFamily}, ${FONT_STACK}` : FONT_STACK,
        fontWeight: font?.fontWeight ?? weight,
        fontStyle: font?.fontStyle ?? "normal",
    }
}

/** Scales a 1440px-reference size with the component width, inside [min, max]. */
function fluid(px1440: number, width: number, min: number, max: number): number {
    return Math.round(Math.min(max, Math.max(min, (width * px1440) / 1440)))
}

/** Measures the component's own box so layout never depends on viewport units. */
function useSize(ref: React.RefObject<HTMLElement>, initial = { w: 1440, h: 900 }) {
    const [size, setSize] = React.useState(initial)
    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((entries) => {
            const r = entries[0]?.contentRect
            if (r && r.width > 0) setSize({ w: r.width, h: r.height })
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])
    return size
}

function useViewportHeight() {
    const [h, setH] = React.useState(900)
    React.useEffect(() => {
        const update = () => setH(window.innerHeight || 900)
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])
    return h
}

const mix = (color: string, pct: number, withColor = "transparent") =>
    `color-mix(in srgb, ${color} ${pct}%, ${withColor})`

/** The sphere: one base sweep plus pooled highlights, all CSS, no image. */
function sphereBackground(yellow: string, pink: string, blue: string, white: string): string {
    const cream = mix(yellow, 30, "#ffffff")
    const orange = mix(yellow, 42, pink)
    const tan = mix(orange, 55, "#e6d9c6")
    const blush = mix(pink, 55, white)
    const mist = mix(pink, 25, "#dcd6d8")
    return [
        // light source, top right
        `radial-gradient(circle at 78% 12%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.3) 18%, rgba(255,255,255,0) 36%)`,
        // edge falloff for roundness
        `radial-gradient(circle at 46% 46%, rgba(0,0,0,0) 68%, rgba(90,40,70,0.09) 100%)`,
        // cool pool, bottom right
        `radial-gradient(42% 46% at 88% 76%, ${blue} 0%, ${mix(blue, 70)} 36%, ${mix(blue, 0)} 100%)`,
        // tan sheen, centre right
        `radial-gradient(36% 32% at 68% 60%, ${mix(tan, 92)} 0%, ${mix(tan, 45)} 50%, ${mix(tan, 0)} 100%)`,
        // dissolve to misty grey-white along the bottom
        `radial-gradient(64% 40% at 44% 106%, ${mist} 0%, ${mix(mist, 72)} 40%, ${mix(mist, 0)} 100%)`,
        // warm core, a touch up and left of centre
        `radial-gradient(46% 44% at 45% 45%, ${mix(orange, 96)} 0%, ${mix(orange, 60)} 45%, ${mix(orange, 0)} 100%)`,
        // coral, left
        `radial-gradient(40% 52% at 0% 58%, ${mix(pink, 96)} 0%, ${mix(pink, 60)} 45%, ${mix(pink, 0)} 100%)`,
        // base sweep: cream top right → pale yellow → peach → coral → blush → mist bottom left
        `linear-gradient(210deg, ${cream} 0%, ${yellow} 20%, ${orange} 44%, ${pink} 68%, ${blush} 84%, ${mist} 100%)`,
    ].join(", ")
}

type SceneProps = {
    diameter: string
    x: number
    y: number
    yellow: string
    pink: string
    blue: string
    white: string
    spin: number
    rings: boolean
    ringColor: string
    ringStyle: "dotted" | "dashed" | "solid"
    ringInner: number
    ringOuter: number
    orbitDot: boolean
    dotColor: string
    orbitSeconds: number
    growOnScroll: boolean
    growTo: number
    shiftX: number
    shiftY: number
    growOver: number
    animate: boolean
}

function ringStyleFor(scale: number, border: string): React.CSSProperties {
    return {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border,
        boxSizing: "border-box",
    }
}

/** Sphere + rings + orbiting dot, grouped so scroll growth moves them together. */
function SphereScene(p: SceneProps) {
    const vh = useViewportHeight()
    const { scrollY } = useScroll()
    const dist = Math.max(1, vh * Math.max(0.1, p.growOver))
    const scale = useTransform(scrollY, [0, dist], [1, p.growOnScroll ? p.growTo : 1])
    const x = useTransform(scrollY, [0, dist], ["0%", p.growOnScroll ? `${p.shiftX}%` : "0%"])
    const y = useTransform(scrollY, [0, dist], ["0%", p.growOnScroll ? `${p.shiftY}%` : "0%"])
    const ringBorder = `1px ${p.ringStyle} ${p.ringColor}`
    const spinning = p.animate && p.spin > 0
    const orbiting = p.animate && p.orbitSeconds > 0
    const dot = `calc(${p.diameter} * 0.055)`

    return (
        <div
            style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.diameter,
                height: p.diameter,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
            }}
        >
            <motion.div style={{ position: "relative", width: "100%", height: "100%", scale, x, y }}>
                {p.rings && <div style={ringStyleFor(p.ringInner, ringBorder)} />}
                {p.rings && <div style={ringStyleFor(p.ringOuter, ringBorder)} />}
                {p.orbitDot && (
                    <motion.div
                        style={{ ...ringStyleFor(p.ringOuter, "none"), transform: undefined, x: "-50%", y: "-50%", rotate: 67 }}
                        animate={{ rotate: orbiting ? 427 : 67 }}
                        transition={
                            orbiting
                                ? { duration: p.orbitSeconds, ease: "linear", repeat: Infinity }
                                : { duration: 0 }
                        }
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: 0,
                                width: dot,
                                height: dot,
                                transform: "translate(-50%, -50%)",
                                borderRadius: "50%",
                                background: p.dotColor,
                            }}
                        />
                    </motion.div>
                )}
                <motion.div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: sphereBackground(p.yellow, p.pink, p.blue, p.white),
                    }}
                    animate={{ rotate: spinning ? 360 : 0 }}
                    transition={
                        spinning ? { duration: p.spin, ease: "linear", repeat: Infinity } : { duration: 0 }
                    }
                />
            </motion.div>
        </div>
    )
}

/** Property controls for the sphere, reused by the hero. */
const SPHERE_CONTROLS = {
    sphereSize: {
        type: ControlType.Number,
        title: "Size",
        description: "Diameter as % of the shorter side of the layer (or viewport when fixed).",
        min: 10,
        max: 200,
        step: 1,
        unit: "%",
        defaultValue: 73,
    },
    sphereX: { type: ControlType.Number, title: "Center X", min: -50, max: 150, step: 1, unit: "%", defaultValue: 50 },
    sphereY: { type: ControlType.Number, title: "Center Y", min: -50, max: 150, step: 1, unit: "%", defaultValue: 50 },
    yellow: { type: ControlType.Color, title: "Yellow", defaultValue: "#f3e39b" },
    pink: { type: ControlType.Color, title: "Pink", defaultValue: "#fd7d88" },
    blue: { type: ControlType.Color, title: "Blue", defaultValue: "#8fc4dc" },
    white: { type: ControlType.Color, title: "White", defaultValue: "#f5eff0" },
    spin: {
        type: ControlType.Number,
        title: "Spin",
        description: "Seconds per full rotation. 0 keeps it still.",
        min: 0,
        max: 300,
        step: 5,
        unit: "s",
        defaultValue: 90,
    },
    rings: { type: ControlType.Boolean, title: "Rings", defaultValue: true },
    ringColor: {
        type: ControlType.Color,
        title: "Ring color",
        defaultValue: "rgba(229, 228, 224, 0.18)",
        hidden: (p: { rings?: boolean }) => !p.rings,
    },
    ringStyle: {
        type: ControlType.Enum,
        title: "Ring style",
        options: ["dotted", "dashed", "solid"],
        optionTitles: ["Dotted", "Dashed", "Solid"],
        defaultValue: "dotted",
        hidden: (p: { rings?: boolean }) => !p.rings,
    },
    ringInner: {
        type: ControlType.Number,
        title: "Inner ring",
        description: "Multiple of the sphere diameter.",
        min: 1,
        max: 3,
        step: 0.02,
        defaultValue: 1.42,
        hidden: (p: { rings?: boolean }) => !p.rings,
    },
    ringOuter: {
        type: ControlType.Number,
        title: "Outer ring",
        min: 1,
        max: 4,
        step: 0.02,
        defaultValue: 1.86,
        hidden: (p: { rings?: boolean }) => !p.rings,
    },
    orbitDot: { type: ControlType.Boolean, title: "Orbit dot", defaultValue: true },
    dotColor: {
        type: ControlType.Color,
        title: "Dot color",
        defaultValue: "#9e9e9c",
        hidden: (p: { orbitDot?: boolean }) => !p.orbitDot,
    },
    orbitSeconds: {
        type: ControlType.Number,
        title: "Orbit",
        description: "Seconds per lap on the outer ring. 0 keeps it still.",
        min: 0,
        max: 300,
        step: 5,
        unit: "s",
        defaultValue: 80,
        hidden: (p: { orbitDot?: boolean }) => !p.orbitDot,
    },
    growOnScroll: {
        type: ControlType.Boolean,
        title: "Grow on scroll",
        description: "Scales and shifts the sphere as the page scrolls, like the featured-work reveal.",
        defaultValue: true,
    },
    growTo: {
        type: ControlType.Number,
        title: "Grow to",
        min: 1,
        max: 4,
        step: 0.05,
        unit: "×",
        defaultValue: 1.8,
        hidden: (p: { growOnScroll?: boolean }) => !p.growOnScroll,
    },
    shiftX: {
        type: ControlType.Number,
        title: "Shift X",
        min: -100,
        max: 100,
        step: 1,
        unit: "%",
        defaultValue: -14,
        hidden: (p: { growOnScroll?: boolean }) => !p.growOnScroll,
    },
    shiftY: {
        type: ControlType.Number,
        title: "Shift Y",
        min: -100,
        max: 100,
        step: 1,
        unit: "%",
        defaultValue: -4,
        hidden: (p: { growOnScroll?: boolean }) => !p.growOnScroll,
    },
    growOver: {
        type: ControlType.Number,
        title: "Grow over",
        description: "How many screen heights of scrolling the growth takes.",
        min: 0.25,
        max: 4,
        step: 0.25,
        unit: "vh",
        defaultValue: 1,
        hidden: (p: { growOnScroll?: boolean }) => !p.growOnScroll,
    },
}

type SphereControlProps = {
    sphereSize: number
    sphereX: number
    sphereY: number
    yellow: string
    pink: string
    blue: string
    white: string
    spin: number
    rings: boolean
    ringColor: string
    ringStyle: "dotted" | "dashed" | "solid"
    ringInner: number
    ringOuter: number
    orbitDot: boolean
    dotColor: string
    orbitSeconds: number
    growOnScroll: boolean
    growTo: number
    shiftX: number
    shiftY: number
    growOver: number
}

const SPHERE_DEFAULTS: SphereControlProps = {
    sphereSize: 73,
    sphereX: 50,
    sphereY: 50,
    yellow: "#f3e39b",
    pink: "#fd7d88",
    blue: "#8fc4dc",
    white: "#f5eff0",
    spin: 90,
    rings: true,
    ringColor: "rgba(229, 228, 224, 0.18)",
    ringStyle: "dotted",
    ringInner: 1.42,
    ringOuter: 1.86,
    orbitDot: true,
    dotColor: "#9e9e9c",
    orbitSeconds: 80,
    growOnScroll: true,
    growTo: 1.8,
    shiftX: -14,
    shiftY: -4,
    growOver: 1,
}

function sceneFrom(p: SphereControlProps, diameter: string, animate: boolean): SceneProps {
    return {
        diameter,
        x: p.sphereX,
        y: p.sphereY,
        yellow: p.yellow,
        pink: p.pink,
        blue: p.blue,
        white: p.white,
        spin: p.spin,
        rings: p.rings,
        ringColor: p.ringColor,
        ringStyle: p.ringStyle,
        ringInner: p.ringInner,
        ringOuter: p.ringOuter,
        orbitDot: p.orbitDot,
        dotColor: p.dotColor,
        orbitSeconds: p.orbitSeconds,
        growOnScroll: p.growOnScroll,
        growTo: p.growTo,
        shiftX: p.shiftX,
        shiftY: p.shiftY,
        growOver: p.growOver,
        animate,
    }
}

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
