
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
