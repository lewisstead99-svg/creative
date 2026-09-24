// Generated from kit/components/IntroBlock.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
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
 * OFF+BRAND Intro — the founder-led intro block: eyebrow, a tracked uppercase
 * lead and a ghost link on the left, body copy on the right.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function IntroBlock(props: Partial<IntroProps>) {
    const p = { ...INTRO_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const leadSize = fluid(p.leadSize, w, 14, 26)
    const bodySize = fluid(p.bodySize, w, 15, 22)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                ...props.style,
                position: "relative",
                background: p.background,
                color: p.textColor,
                padding: `${p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                borderTop: p.hairlineTop ? `1px solid ${p.hairline}` : undefined,
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
                gap: mobile ? 40 : Math.round(labelSize * 1.5),
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: Math.round(leadSize * 1.6), maxWidth: mobile ? "100%" : "88%" }}>
                {p.eyebrow && <p style={{ ...labelCss(p.font, labelSize, p.mutedColor) }}>{p.eyebrow}</p>}
                <p
                    style={{
                        ...fontCss(p.font, 500),
                        fontSize: leadSize,
                        lineHeight: 1.35,
                        letterSpacing: "0.013em",
                        textTransform: "uppercase",
                        margin: 0,
                        textWrap: "balance" as any,
                    }}
                >
                    {p.lead}
                </p>
                {p.linkLabel && <TextLink label={p.linkLabel} href={p.link} size={labelSize} color={p.textColor} font={p.font} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: Math.round(bodySize * 1.1), maxWidth: "62ch", justifySelf: mobile ? "start" : "end" }}>
                {paragraphs(p.body).map((para, i) => (
                    <p key={i} style={{ ...fontCss(p.font, 400), fontSize: bodySize, lineHeight: 1.45, letterSpacing: "0.013em", margin: 0, color: i === 0 ? p.textColor : p.mutedColor }}>
                        {para}
                    </p>
                ))}
            </div>
        </section>
    )
}

type IntroProps = {
    eyebrow: string
    lead: string
    linkLabel: string
    link: string
    body: string
    font?: FramerFont
    labelSize: number
    leadSize: number
    bodySize: number
    textColor: string
    mutedColor: string
    hairline: string
    hairlineTop: boolean
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const INTRO_DEFAULTS: IntroProps = {
    eyebrow: "Studio",
    lead: "We are a founder-led creative studio building brands and websites for companies that refuse to blend in.",
    linkLabel: "About us",
    link: "",
    body: "Off+Brand started with a simple observation: most brands in most categories look the same, because they are built from the same playbook. We work with founders and marketing teams who want the opposite, and we bring strategy, design, motion and Webflow engineering to the table as one team.\n\nSmall on purpose. Senior by default. Every project is led by the people who sold it, from the first workshop to launch day.",
    font: undefined,
    labelSize: 13,
    leadSize: 15,
    bodySize: 18,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hairline: HAIRLINE,
    hairlineTop: true,
    background: INK,
    padding: 20,
    topSpace: 120,
    bottomSpace: 120,
}

addPropertyControls(IntroBlock, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: INTRO_DEFAULTS.eyebrow },
    lead: { type: ControlType.String, title: "Lead", displayTextArea: true, defaultValue: INTRO_DEFAULTS.lead },
    linkLabel: { type: ControlType.String, title: "Link label", defaultValue: INTRO_DEFAULTS.linkLabel },
    link: { type: ControlType.Link, title: "Link" },
    body: { type: ControlType.String, title: "Body", description: "Blank line between paragraphs.", displayTextArea: true, defaultValue: INTRO_DEFAULTS.body },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    leadSize: { type: ControlType.Number, title: "Lead @1440", min: 12, max: 40, step: 1, unit: "px", defaultValue: 15 },
    bodySize: { type: ControlType.Number, title: "Body @1440", min: 14, max: 24, step: 1, unit: "px", defaultValue: 18 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: INTRO_DEFAULTS.mutedColor },
    hairlineTop: { type: ControlType.Boolean, title: "Top hairline", defaultValue: true },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE, hidden: (p: { hairlineTop?: boolean }) => !p.hairlineTop },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
})
