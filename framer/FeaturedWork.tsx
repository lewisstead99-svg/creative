import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * OFF+BRAND Featured Work — a section label, "All work" ghost pill with a
 * superscript count, and a staggered two-column grid of square project cards.
 * Cards without an image show the brand's grid-paper placeholder.
 *
 * Background is transparent by default so the hero's fixed sphere shows
 * through; set the page background to #1d1d1d. Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function FeaturedWork(props: Partial<WorkProps>) {
    const p = { ...WORK_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const cols = mobile ? 1 : Math.max(1, p.columns)
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const titleSize = fluid(p.titleSize, w, 14, 28)
    const gap = mobile ? Math.round(p.gap * 0.6) : p.gap
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const cardPad = mobile ? Math.round(p.cardPadding * 0.7) : p.cardPadding
    const columnsOfCards = Array.from({ length: cols }, (_, c) => p.cards.filter((_, i) => i % cols === c))

    const label: React.CSSProperties = {
        ...fontCss(p.font, 500),
        fontSize: labelSize,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: p.textColor,
        lineHeight: 1,
        margin: 0,
    }

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                ...props.style,
                position: "relative",
                background: p.background,
                padding: `${p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "1fr 2fr",
                gap,
                color: p.textColor,
            }}
        >
            <div
                style={{
                    alignSelf: "start",
                    position: p.stickyLabel && !mobile ? "sticky" : "relative",
                    top: p.stickyLabel && !mobile ? p.topSpace : undefined,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: Math.round(labelSize * 1.6),
                }}
            >
                <p style={label}>{p.label}</p>
                <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 6 }}>
                    <a
                        href={p.buttonLink || undefined}
                        className="ob-work-pill"
                        style={{
                            ...label,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.9em",
                            padding: `${Math.round(labelSize * 1.45)}px ${Math.round(labelSize * 2.6)}px`,
                            border: `1px solid ${p.borderColor}`,
                            borderRadius: 999,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {p.buttonLabel}
                        <svg width="0.8em" height="0.8em" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    {p.count && (
                        <span style={{ ...label, fontSize: Math.max(10, Math.round(labelSize * 0.75)), opacity: 0.8, marginTop: -2 }}>
                            {p.count}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}>
                {columnsOfCards.map((list, c) => (
                    <div
                        key={c}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap,
                            paddingTop: p.stagger && cols > 1 && c % 2 === 0 ? `calc(50% + ${gap / 2}px)` : 0,
                        }}
                    >
                        {list.map((card, i) => (
                            <Card
                                key={i}
                                card={card}
                                radius={p.cardRadius}
                                bg={p.cardBackground}
                                paper={p.gridPaper}
                                paperLine={p.paperLine}
                                titleSize={titleSize}
                                blend={p.blend}
                                color={p.cardText}
                                pad={cardPad}
                                font={p.font}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <style>{`
                .ob-work-pill { transition: background-color .25s ease, color .25s ease }
                .ob-work-pill:hover { background: ${p.textColor}; color: ${p.hoverText} }
                .ob-work-card img { transition: transform .6s cubic-bezier(.2,.7,.2,1) }
                .ob-work-card:hover img { transform: scale(1.03) }
            `}</style>
        </section>
    )
}

type CardProps = {
    card: WorkCard
    radius: number
    bg: string
    paper: boolean
    paperLine: string
    titleSize: number
    blend: boolean
    color: string
    pad: number
    font?: FramerFont
}

function Card({ card, radius, bg, paper, paperLine, titleSize, blend, color, pad, font }: CardProps) {
    const img = card.image?.src ? card.image : undefined
    const showPaper = paper && !img
    const Tag: any = card.link ? "a" : "div"
    const overlay: React.CSSProperties = {
        position: "absolute",
        bottom: pad,
        color,
        mixBlendMode: blend ? "difference" : "normal",
    }
    return (
        <Tag
            href={card.link || undefined}
            className="ob-work-card"
            style={{
                position: "relative",
                display: "block",
                width: "100%",
                aspectRatio: "1 / 1",
                overflow: "hidden",
                borderRadius: radius,
                background: bg,
                backgroundImage: showPaper
                    ? `linear-gradient(${paperLine} 1px, transparent 1px), linear-gradient(90deg, ${paperLine} 1px, transparent 1px)`
                    : undefined,
                backgroundSize: showPaper ? "32px 32px" : undefined,
                isolation: "isolate",
                textDecoration: "none",
            }}
        >
            {img && (
                <img
                    src={img.src}
                    srcSet={img.srcSet}
                    alt={img.alt || card.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            )}
            {showPaper && (
                <span
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: "62%",
                        height: "62%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        border: `1px dotted ${paperLine}`,
                        boxSizing: "border-box",
                    }}
                />
            )}
            <span
                style={{
                    ...overlay,
                    ...fontCss(font, 500),
                    left: pad,
                    fontSize: titleSize,
                    letterSpacing: "0.013em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                    maxWidth: "70%",
                }}
            >
                {card.title}
            </span>
            <svg
                style={{ ...overlay, right: pad, width: titleSize * 1.5, height: titleSize * 1.5 }}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.2" />
            </svg>
        </Tag>
    )
}

type WorkCard = {
    title: string
    link: string
    image?: { src: string; srcSet?: string; alt?: string }
}

type WorkProps = {
    label: string
    count: string
    buttonLabel: string
    buttonLink: string
    cards: WorkCard[]
    columns: number
    stagger: boolean
    stickyLabel: boolean
    gap: number
    padding: number
    topSpace: number
    bottomSpace: number
    cardRadius: number
    cardPadding: number
    cardBackground: string
    gridPaper: boolean
    paperLine: string
    font?: FramerFont
    labelSize: number
    titleSize: number
    textColor: string
    cardText: string
    hoverText: string
    borderColor: string
    blend: boolean
    background: string
    style?: React.CSSProperties
}

const WORK_DEFAULTS: WorkProps = {
    label: "Featured work",
    count: "11",
    buttonLabel: "All work",
    buttonLink: "",
    cards: [
        { title: "Microsoft Windows", link: "" },
        { title: "Trevor Noah", link: "" },
        { title: "Steven Bartlett", link: "" },
        { title: "Attio", link: "" },
    ],
    columns: 2,
    stagger: true,
    stickyLabel: true,
    gap: 24,
    padding: 20,
    topSpace: 120,
    bottomSpace: 120,
    cardRadius: 10,
    cardPadding: 32,
    cardBackground: "#ffffff",
    gridPaper: true,
    paperLine: "#e5e4e0",
    font: undefined,
    labelSize: 13,
    titleSize: 18,
    textColor: "#e5e4e0",
    cardText: "#e5e4e0",
    hoverText: "#1d1d1d",
    borderColor: "rgba(229, 228, 224, 0.28)",
    blend: true,
    background: "rgba(0, 0, 0, 0)",
}

addPropertyControls(FeaturedWork, {
    label: { type: ControlType.String, title: "Label", defaultValue: WORK_DEFAULTS.label },
    buttonLabel: { type: ControlType.String, title: "Button", defaultValue: WORK_DEFAULTS.buttonLabel },
    buttonLink: { type: ControlType.Link, title: "Button link" },
    count: { type: ControlType.String, title: "Count", description: "Superscript next to the button. Leave empty to hide.", defaultValue: "11" },
    cards: {
        type: ControlType.Array,
        title: "Cards",
        maxCount: 12,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title", defaultValue: "Project" },
                image: { type: ControlType.ResponsiveImage, title: "Image" },
                link: { type: ControlType.Link, title: "Link" },
            },
        },
        defaultValue: WORK_DEFAULTS.cards,
    },
    columns: { type: ControlType.Number, title: "Columns", min: 1, max: 3, step: 1, defaultValue: 2 },
    stagger: { type: ControlType.Boolean, title: "Stagger", description: "Drops odd columns by half a card.", defaultValue: true },
    stickyLabel: { type: ControlType.Boolean, title: "Sticky label", defaultValue: true },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    titleSize: { type: ControlType.Number, title: "Title @1440", min: 12, max: 40, step: 1, unit: "px", defaultValue: 18 },
    gap: { type: ControlType.Number, title: "Gap", min: 0, max: 80, step: 1, unit: "px", defaultValue: 24 },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
    cardRadius: { type: ControlType.Number, title: "Card radius", description: "The live site uses ~10px. The style guide says 0 for a sharper, print feel.", min: 0, max: 40, step: 1, unit: "px", defaultValue: 10 },
    cardPadding: { type: ControlType.Number, title: "Card padding", min: 8, max: 80, step: 1, unit: "px", defaultValue: 32 },
    cardBackground: { type: ControlType.Color, title: "Card fill", defaultValue: "#ffffff" },
    gridPaper: { type: ControlType.Boolean, title: "Grid paper", description: "Placeholder pattern for cards with no image.", defaultValue: true },
    paperLine: { type: ControlType.Color, title: "Paper line", defaultValue: "#e5e4e0", hidden: (p: { gridPaper?: boolean }) => !p.gridPaper },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: WORK_DEFAULTS.textColor },
    cardText: { type: ControlType.Color, title: "Card text", defaultValue: WORK_DEFAULTS.cardText },
    blend: { type: ControlType.Boolean, title: "Difference blend", description: "Card titles invert against their image.", defaultValue: true },
    hoverText: { type: ControlType.Color, title: "Pill hover text", defaultValue: WORK_DEFAULTS.hoverText },
    borderColor: { type: ControlType.Color, title: "Hairline", defaultValue: WORK_DEFAULTS.borderColor },
    background: { type: ControlType.Color, title: "Background", defaultValue: WORK_DEFAULTS.background },
})

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers (kept inline so this file pastes into Framer on its own)
// ─────────────────────────────────────────────────────────────────────────────

const FONT_STACK =
    '"Ataero Retina OB Edition", "Ataero Retina OB", Manrope, "Instrument Sans", Inter, ui-sans-serif, system-ui, sans-serif'

type FramerFont = {
    fontFamily?: string
    fontWeight?: number | string
    fontStyle?: string
}

function fontCss(font: FramerFont | undefined, weight = 500): React.CSSProperties {
    return {
        fontFamily: font?.fontFamily ? `${font.fontFamily}, ${FONT_STACK}` : FONT_STACK,
        fontWeight: font?.fontWeight ?? weight,
        fontStyle: font?.fontStyle ?? "normal",
    }
}

function fluid(px1440: number, width: number, min: number, max: number): number {
    return Math.round(Math.min(max, Math.max(min, (width * px1440) / 1440)))
}

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
