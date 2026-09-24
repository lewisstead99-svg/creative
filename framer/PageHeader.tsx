// Generated from kit/components/PageHeader.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

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

/**
 * OFF+BRAND Page Header — the opener for inner pages (Work, Manifesto,
 * Contact): eyebrow, display title with an optional superscript count, and an
 * intro paragraph set to the right on desktop.
 *
 * Height is content-sized. Leave enough Space above for the fixed nav.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function PageHeader(props: Partial<PageHeaderProps>) {
    const p = { ...HEADER_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const size = fluid(p.size, w, p.minSize, p.maxSize)
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const bodySize = fluid(p.bodySize, w, 15, 22)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding

    return (
        <header
            ref={ref}
            style={{
                width: "100%",
                ...props.style,
                position: "relative",
                background: p.background,
                color: p.textColor,
                padding: `${mobile ? Math.round(p.topSpace * 0.7) : p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                borderBottom: p.hairlineBottom ? `1px solid ${p.hairline}` : undefined,
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "2fr 1fr",
                gap: mobile ? 32 : 24,
                alignItems: "end",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: Math.round(size * 0.35) }}>
                {p.eyebrow && <p style={labelCss(p.font, labelSize, p.mutedColor)}>{p.eyebrow}</p>}
                <h1
                    style={{
                        ...fontCss(p.font, 500),
                        fontSize: size,
                        lineHeight: 0.88,
                        letterSpacing: "0.01em",
                        textTransform: p.uppercase ? "uppercase" : "none",
                        margin: 0,
                        maxWidth: "12ch",
                        textWrap: "balance" as any,
                    }}
                >
                    {p.title}
                    {p.count && (
                        <sup style={{ ...labelCss(p.font, Math.round(labelSize * 0.95), p.mutedColor), lineHeight: 1, verticalAlign: "top", position: "relative", top: "0.12em", marginLeft: "0.25em", letterSpacing: "0.05em" }}>
                            {p.count}
                        </sup>
                    )}
                </h1>
            </div>
            {p.intro && (
                <p style={{ ...fontCss(p.font, 400), fontSize: bodySize, lineHeight: 1.45, letterSpacing: "0.013em", margin: 0, maxWidth: "38ch", color: p.textColor }}>
                    {p.intro}
                </p>
            )}
        </header>
    )
}

type PageHeaderProps = {
    eyebrow: string
    title: string
    count: string
    intro: string
    uppercase: boolean
    font?: FramerFont
    size: number
    minSize: number
    maxSize: number
    labelSize: number
    bodySize: number
    textColor: string
    mutedColor: string
    hairline: string
    hairlineBottom: boolean
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const HEADER_DEFAULTS: PageHeaderProps = {
    eyebrow: "Work",
    title: "Selected work",
    count: "11",
    intro: "Brands, websites and launch films for founders and marketing teams who want to be remembered.",
    uppercase: true,
    font: undefined,
    size: 103,
    minSize: 44,
    maxSize: 170,
    labelSize: 13,
    bodySize: 18,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hairline: HAIRLINE,
    hairlineBottom: true,
    background: INK,
    padding: 20,
    topSpace: 200,
    bottomSpace: 60,
}

addPropertyControls(PageHeader, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: HEADER_DEFAULTS.eyebrow },
    title: { type: ControlType.String, title: "Title", defaultValue: HEADER_DEFAULTS.title },
    count: { type: ControlType.String, title: "Count", description: "Superscript after the title. Leave empty to hide.", defaultValue: HEADER_DEFAULTS.count },
    intro: { type: ControlType.String, title: "Intro", displayTextArea: true, defaultValue: HEADER_DEFAULTS.intro },
    uppercase: { type: ControlType.Boolean, title: "Uppercase", defaultValue: true },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    size: { type: ControlType.Number, title: "Size @1440", min: 32, max: 200, step: 1, unit: "px", defaultValue: 103 },
    minSize: { type: ControlType.Number, title: "Min size", min: 24, max: 100, step: 1, unit: "px", defaultValue: 44 },
    maxSize: { type: ControlType.Number, title: "Max size", min: 60, max: 300, step: 1, unit: "px", defaultValue: 170 },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    bodySize: { type: ControlType.Number, title: "Intro @1440", min: 14, max: 24, step: 1, unit: "px", defaultValue: 18 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: HEADER_DEFAULTS.mutedColor },
    hairlineBottom: { type: ControlType.Boolean, title: "Bottom hairline", defaultValue: true },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE, hidden: (p: { hairlineBottom?: boolean }) => !p.hairlineBottom },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 400, step: 1, unit: "px", defaultValue: 200 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 60 },
})
