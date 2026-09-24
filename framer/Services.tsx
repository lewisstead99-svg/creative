// Generated from kit/components/Services.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
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
 * OFF+BRAND Services — a label, a short heading and hairline rows: service
 * name left, one-line description right, ↗ at the edge. Rows are links when a
 * link is set.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function Services(props: Partial<ServicesProps>) {
    const p = { ...SERVICES_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const headingSize = fluid(p.headingSize, w, 26, 64)
    const titleSize = fluid(p.titleSize, w, 20, 44)
    const bodySize = fluid(p.bodySize, w, 14, 19)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const rowPad = Math.round(titleSize * 0.85)

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
                display: "flex",
                flexDirection: "column",
                gap: Math.round(labelSize * 3.5),
            }}
        >
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 2fr", gap: 24, alignItems: "end" }}>
                {p.label && <p style={labelCss(p.font, labelSize, p.mutedColor)}>{p.label}</p>}
                {p.heading && (
                    <h2 style={{ ...fontCss(p.font, 500), fontSize: headingSize, lineHeight: 1.02, letterSpacing: "0.006em", margin: 0, maxWidth: "22ch", textWrap: "balance" as any }}>
                        {p.heading}
                    </h2>
                )}
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: `1px solid ${p.hairline}` }}>
                {p.items.map((item, i) => {
                    const Tag: any = item.link ? "a" : "div"
                    return (
                        <li key={i} style={{ borderBottom: `1px solid ${p.hairline}` }}>
                            <Tag
                                href={item.link || undefined}
                                className="ob-svc-row"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: mobile ? "1fr auto" : "1fr 1fr auto",
                                    gap: mobile ? 12 : 32,
                                    alignItems: "baseline",
                                    padding: `${rowPad}px 0`,
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                <span style={{ ...fontCss(p.font, 500), fontSize: titleSize, lineHeight: 1, letterSpacing: "0.006em", textTransform: p.uppercase ? "uppercase" : "none" }}>
                                    {item.title}
                                </span>
                                {mobile && (
                                    <span className="ob-svc-arrow" style={{ display: item.link ? "inline-flex" : "none", fontSize: titleSize * 0.6 }}>
                                        <ArrowNE />
                                    </span>
                                )}
                                <span style={{ ...fontCss(p.font, 400), fontSize: bodySize, lineHeight: 1.45, letterSpacing: "0.013em", color: p.mutedColor, maxWidth: "48ch", gridColumn: mobile ? "1 / -1" : undefined }}>
                                    {item.description}
                                </span>
                                {!mobile && (
                                    <span className="ob-svc-arrow" style={{ display: "inline-flex", fontSize: titleSize * 0.6, opacity: item.link ? 1 : 0 }}>
                                        <ArrowNE />
                                    </span>
                                )}
                            </Tag>
                        </li>
                    )
                })}
            </ul>
            <style>{`
                .ob-svc-arrow { transition: transform .3s cubic-bezier(.2,.7,.2,1) }
                a.ob-svc-row:hover .ob-svc-arrow { transform: translate(4px, -4px) }
                a.ob-svc-row > span:first-child { transition: transform .3s cubic-bezier(.2,.7,.2,1) }
                a.ob-svc-row:hover > span:first-child { transform: translateX(8px) }
            `}</style>
        </section>
    )
}

type ServiceItem = { title: string; description: string; link: string }

type ServicesProps = {
    label: string
    heading: string
    items: ServiceItem[]
    uppercase: boolean
    font?: FramerFont
    labelSize: number
    headingSize: number
    titleSize: number
    bodySize: number
    textColor: string
    mutedColor: string
    hairline: string
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const SERVICES_DEFAULTS: ServicesProps = {
    label: "What we do",
    heading: "Brand, web and motion, built as one system.",
    items: [
        { title: "Brand identity", description: "Positioning, naming, identity systems and the guidelines that keep them sharp after launch.", link: "" },
        { title: "Web design", description: "Editorial layouts, real typography and interaction that earns attention without shouting.", link: "" },
        { title: "Webflow development", description: "Enterprise-grade builds: CMS architecture, localisation, performance and a hand-off your team can run.", link: "" },
        { title: "Motion & 3D", description: "Launch films, product renders and the small movements that make a site feel alive.", link: "" },
        { title: "Campaigns", description: "Launch strategy and content that carries the brand past the homepage.", link: "" },
    ],
    uppercase: false,
    font: undefined,
    labelSize: 13,
    headingSize: 46,
    titleSize: 34,
    bodySize: 15,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hairline: HAIRLINE,
    background: INK,
    padding: 20,
    topSpace: 120,
    bottomSpace: 120,
}

addPropertyControls(Services, {
    label: { type: ControlType.String, title: "Label", defaultValue: SERVICES_DEFAULTS.label },
    heading: { type: ControlType.String, title: "Heading", displayTextArea: true, defaultValue: SERVICES_DEFAULTS.heading },
    items: {
        type: ControlType.Array,
        title: "Services",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title", defaultValue: "Service" },
                description: { type: ControlType.String, title: "Description", displayTextArea: true, defaultValue: "" },
                link: { type: ControlType.Link, title: "Link" },
            },
        },
        defaultValue: SERVICES_DEFAULTS.items,
    },
    uppercase: { type: ControlType.Boolean, title: "Uppercase titles", defaultValue: false },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    headingSize: { type: ControlType.Number, title: "Heading @1440", min: 24, max: 80, step: 1, unit: "px", defaultValue: 46 },
    titleSize: { type: ControlType.Number, title: "Row title @1440", min: 18, max: 60, step: 1, unit: "px", defaultValue: 34 },
    bodySize: { type: ControlType.Number, title: "Row text @1440", min: 13, max: 20, step: 1, unit: "px", defaultValue: 15 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: SERVICES_DEFAULTS.mutedColor },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
})
