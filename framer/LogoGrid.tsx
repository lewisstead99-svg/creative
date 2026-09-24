// Generated from kit/components/LogoGrid.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
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
 * OFF+BRAND Logo Grid — "Trusted by leaders": a strict grid of client cells
 * separated by 1px hairlines. Each cell shows an uploaded logo, or the client
 * name set in the brand type until a logo is added.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function LogoGrid(props: Partial<LogoGridProps>) {
    const p = { ...LOGO_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const cols = mobile ? p.mobileColumns : p.columns
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const nameSize = fluid(p.nameSize, w, 12, 20)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const logoFilter = p.logoStyle === "white" ? "brightness(0) invert(1)" : p.logoStyle === "ink" ? "brightness(0)" : undefined

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
                gap: Math.round(labelSize * 3),
            }}
        >
            {p.label && <p style={labelCss(p.font, labelSize, p.mutedColor)}>{p.label}</p>}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    gap: 1,
                    background: p.hairline,
                    border: `1px solid ${p.hairline}`,
                }}
            >
                {p.logos.map((logo, i) => {
                    const Tag: any = logo.link ? "a" : "div"
                    const img = logo.image?.src ? logo.image : undefined
                    return (
                        <Tag
                            key={i}
                            href={logo.link || undefined}
                            target={logo.link ? "_blank" : undefined}
                            rel={logo.link ? "noreferrer" : undefined}
                            className="ob-logo-cell"
                            style={{
                                aspectRatio: p.cellAspect,
                                background: p.cellBackground,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textDecoration: "none",
                                color: "inherit",
                                padding: "10%",
                                boxSizing: "border-box",
                                minWidth: 0,
                            }}
                        >
                            {img ? (
                                <img
                                    src={img.src}
                                    srcSet={img.srcSet}
                                    alt={img.alt || logo.name}
                                    style={{ maxWidth: `${p.logoWidth}%`, maxHeight: "60%", objectFit: "contain", filter: logoFilter, opacity: p.logoOpacity }}
                                />
                            ) : (
                                <span style={{ ...labelCss(p.font, nameSize, p.textColor), letterSpacing: "0.05em", textAlign: "center", opacity: p.logoOpacity, lineHeight: 1.2 }}>
                                    {logo.name}
                                </span>
                            )}
                        </Tag>
                    )
                })}
            </div>
            <style>{`.ob-logo-cell { transition: background-color .25s ease } a.ob-logo-cell:hover { background: ${p.cellHover} !important }`}</style>
        </section>
    )
}

type Logo = { name: string; link: string; image?: { src: string; srcSet?: string; alt?: string } }

type LogoGridProps = {
    label: string
    logos: Logo[]
    columns: number
    mobileColumns: number
    cellAspect: string
    logoStyle: "white" | "ink" | "original"
    logoWidth: number
    logoOpacity: number
    font?: FramerFont
    labelSize: number
    nameSize: number
    textColor: string
    mutedColor: string
    hairline: string
    cellBackground: string
    cellHover: string
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const LOGO_DEFAULTS: LogoGridProps = {
    label: "Trusted by leaders",
    logos: [
        { name: "Microsoft", link: "" },
        { name: "Trevor Noah", link: "" },
        { name: "Steven Bartlett", link: "" },
        { name: "Attio", link: "" },
        { name: "Webflow", link: "" },
        { name: "Notion", link: "" },
        { name: "Ramp", link: "" },
        { name: "Loom", link: "" },
        { name: "Miro", link: "" },
        { name: "Linear", link: "" },
    ],
    columns: 5,
    mobileColumns: 2,
    cellAspect: "2 / 1",
    logoStyle: "white",
    logoWidth: 60,
    logoOpacity: 0.9,
    font: undefined,
    labelSize: 13,
    nameSize: 15,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hairline: HAIRLINE,
    cellBackground: INK,
    cellHover: "rgba(229, 228, 224, 0.05)",
    background: INK,
    padding: 20,
    topSpace: 120,
    bottomSpace: 120,
}

addPropertyControls(LogoGrid, {
    label: { type: ControlType.String, title: "Label", defaultValue: LOGO_DEFAULTS.label },
    logos: {
        type: ControlType.Array,
        title: "Logos",
        maxCount: 20,
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Name", defaultValue: "Client" },
                image: { type: ControlType.ResponsiveImage, title: "Logo" },
                link: { type: ControlType.Link, title: "Link" },
            },
        },
        defaultValue: LOGO_DEFAULTS.logos,
    },
    columns: { type: ControlType.Number, title: "Columns", min: 2, max: 8, step: 1, defaultValue: 5 },
    mobileColumns: { type: ControlType.Number, title: "Phone columns", min: 1, max: 3, step: 1, defaultValue: 2 },
    cellAspect: { type: ControlType.Enum, title: "Cell shape", options: ["2 / 1", "3 / 2", "1 / 1"], optionTitles: ["Wide", "Landscape", "Square"], defaultValue: "2 / 1" },
    logoStyle: {
        type: ControlType.Enum,
        title: "Logo colour",
        description: "White flattens every logo to Parchment for the dark canvas. Ink does the same for a light one.",
        options: ["white", "ink", "original"],
        optionTitles: ["White", "Ink", "Original"],
        defaultValue: "white",
    },
    logoWidth: { type: ControlType.Number, title: "Logo width", min: 20, max: 100, step: 1, unit: "%", defaultValue: 60 },
    logoOpacity: { type: ControlType.Number, title: "Logo opacity", min: 0.2, max: 1, step: 0.05, defaultValue: 0.9 },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    nameSize: { type: ControlType.Number, title: "Name @1440", min: 10, max: 28, step: 1, unit: "px", defaultValue: 15 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: LOGO_DEFAULTS.mutedColor },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    cellBackground: { type: ControlType.Color, title: "Cell fill", description: "Match the section background for hairlines only, or use Paper #ffffff for white cells.", defaultValue: INK },
    cellHover: { type: ControlType.Color, title: "Cell hover", defaultValue: LOGO_DEFAULTS.cellHover },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
})
