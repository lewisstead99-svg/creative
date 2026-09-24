// Generated from kit/components/IridescentSphere.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers (inlined so this file pastes into Framer on its own)
// ─────────────────────────────────────────────────────────────────────────────

const INK = "#1d1d1d"
const PARCHMENT = "#e5e4e0"
const HAIRLINE = "rgba(229, 228, 224, 0.18)"
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

/** Section label: 13px @1440, tracked, uppercase. */
function labelCss(font: FramerFont | undefined, size: number, color: string): React.CSSProperties {
    return {
        ...fontCss(font, 500),
        fontSize: size,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color,
        lineHeight: 1,
        margin: 0,
    }
}

/** Splits a multiline string into paragraphs on blank lines. */
function paragraphs(text: string): string[] {
    return text
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean)
}

function ArrowNE() {
    return (
        <svg width="0.62em" height="0.62em" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 8l6-6M3.2 2H8v4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function ArrowE() {
    return (
        <svg width="0.8em" height="0.8em" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

type PillProps = {
    label: string
    href?: string
    size: number
    color: string
    hoverText: string
    border: string
    font?: FramerFont
    newTab?: boolean
    onClick?: () => void
    className?: string
}

/** Ghost pill: the system's one state-change button. Fills with the text colour on hover. */
function Pill({ label, href, size, color, hoverText, border, font, newTab, onClick, className }: PillProps) {
    const Tag: any = href ? "a" : "button"
    return (
        <>
            <Tag
                href={href}
                onClick={onClick}
                target={href && newTab ? "_blank" : undefined}
                rel={href && newTab ? "noreferrer" : undefined}
                className={`ob-pill ${className ?? ""}`}
                style={{
                    ...labelCss(font, size, color),
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.9em",
                    padding: `${Math.round(size * 1.45)}px ${Math.round(size * 2.6)}px`,
                    border: `1px solid ${border}`,
                    borderRadius: 999,
                    background: "transparent",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                }}
            >
                {label}
                <ArrowE />
            </Tag>
            <style>{`.ob-pill { transition: background-color .25s ease, color .25s ease } .ob-pill:hover { background: ${color} !important; color: ${hoverText} !important }`}</style>
        </>
    )
}

/** Ghost text link with a trailing arrow and a fade on hover. */
function TextLink({
    label,
    href,
    size,
    color,
    font,
    arrow = "e",
    newTab,
}: {
    label: string
    href?: string
    size: number
    color: string
    font?: FramerFont
    arrow?: "e" | "ne"
    newTab?: boolean
}) {
    return (
        <>
            <a
                href={href || undefined}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noreferrer" : undefined}
                className="ob-textlink"
                style={{
                    ...labelCss(font, size, color),
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45em",
                    textDecoration: "none",
                    padding: "5px 0",
                    borderRadius: 10,
                }}
            >
                {label}
                {arrow === "ne" ? <ArrowNE /> : <ArrowE />}
            </a>
            <style>{`.ob-textlink { transition: opacity .25s ease } .ob-textlink:hover { opacity: .6 }`}</style>
        </>
    )
}


// ─────────────────────────────────────────────────────────────────────────────
// Sphere scene (inlined so this file pastes into Framer on its own)
// ─────────────────────────────────────────────────────────────────────────────

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
    fadeOut: boolean
    fadeAfter: number
    fadeOver: number
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
    const fadeStart = vh * Math.max(0, p.fadeAfter)
    const fadeEnd = fadeStart + vh * Math.max(0.1, p.fadeOver)
    const opacity = useTransform(scrollY, [fadeStart, fadeEnd], [1, p.fadeOut ? 0 : 1])
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
            <motion.div style={{ position: "relative", width: "100%", height: "100%", scale, x, y, opacity }}>
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
    fadeOut: {
        type: ControlType.Boolean,
        title: "Fade out",
        description: "Fades the sphere away further down the page so later sections sit on clean Ink.",
        defaultValue: true,
    },
    fadeAfter: {
        type: ControlType.Number,
        title: "Fade after",
        min: 0,
        max: 8,
        step: 0.25,
        unit: "vh",
        defaultValue: 2,
        hidden: (p: { fadeOut?: boolean }) => !p.fadeOut,
    },
    fadeOver: {
        type: ControlType.Number,
        title: "Fade over",
        min: 0.25,
        max: 4,
        step: 0.25,
        unit: "vh",
        defaultValue: 1,
        hidden: (p: { fadeOut?: boolean }) => !p.fadeOut,
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
    fadeOut: boolean
    fadeAfter: number
    fadeOver: number
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
    fadeOut: true,
    fadeAfter: 2,
    fadeOver: 1,
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
        fadeOut: p.fadeOut,
        fadeAfter: p.fadeAfter,
        fadeOver: p.fadeOver,
        animate,
    }
}

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
                minHeight: 320,
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
