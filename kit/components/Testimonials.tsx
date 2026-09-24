import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
// @include helpers

/**
 * OFF+BRAND Testimonials — one large quote at a time with the client's name
 * and role, a position counter and ghost prev/next buttons. Optional
 * autoplay.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function Testimonials(props: Partial<TestimonialProps>) {
    const p = { ...TESTIMONIAL_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const reduced = useReducedMotion()
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const quoteSize = fluid(p.quoteSize, w, 20, 52)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const count = Math.max(1, p.items.length)
    const [index, setIndex] = React.useState(0)
    const [dir, setDir] = React.useState(1)
    const go = (d: number) => {
        setDir(d)
        setIndex((i) => (i + d + count) % count)
    }
    React.useEffect(() => {
        if (!p.autoplay || count < 2) return
        const id = window.setInterval(() => go(1), Math.max(2, p.interval) * 1000)
        return () => window.clearInterval(id)
    }, [p.autoplay, p.interval, count])
    const item = p.items[Math.min(index, count - 1)] ?? { quote: "", name: "", role: "" }

    const arrowButton = (d: number, label: string) => (
        <button
            type="button"
            aria-label={label}
            onClick={() => go(d)}
            className="ob-quote-btn"
            style={{
                width: Math.round(labelSize * 3.4),
                height: Math.round(labelSize * 3.4),
                borderRadius: "50%",
                border: `1px solid ${p.hairline}`,
                background: "transparent",
                color: p.textColor,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                fontSize: labelSize,
                transform: d < 0 ? "scaleX(-1)" : undefined,
            }}
        >
            <ArrowE />
        </button>
    )

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
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "1fr 2fr",
                gap: mobile ? 32 : 24,
                borderTop: `1px solid ${p.hairline}`,
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
                {p.label && <p style={labelCss(p.font, labelSize, p.mutedColor)}>{p.label}</p>}
                {!mobile && count > 1 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {arrowButton(-1, "Previous")}
                        {arrowButton(1, "Next")}
                        <span style={{ ...labelCss(p.font, labelSize, p.mutedColor), marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>
                            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                        </span>
                    </div>
                )}
            </div>
            <div style={{ minHeight: quoteSize * 4.2, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 40 }}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.figure
                        key={index}
                        initial={reduced ? false : { opacity: 0, y: 14 * dir }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: -14 * dir }}
                        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                        style={{ margin: 0, display: "flex", flexDirection: "column", gap: Math.round(quoteSize * 0.9) }}
                    >
                        <blockquote
                            style={{
                                ...fontCss(p.font, 500),
                                fontSize: quoteSize,
                                lineHeight: 1.18,
                                letterSpacing: "0.006em",
                                margin: 0,
                                maxWidth: "26ch",
                                textWrap: "balance" as any,
                            }}
                        >
                            “{item.quote}”
                        </blockquote>
                        <figcaption style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <span style={labelCss(p.font, labelSize, p.textColor)}>{item.name}</span>
                            {item.role && <span style={{ ...labelCss(p.font, labelSize, p.mutedColor), textTransform: "none", letterSpacing: "0.013em" }}>{item.role}</span>}
                        </figcaption>
                    </motion.figure>
                </AnimatePresence>
                {mobile && count > 1 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {arrowButton(-1, "Previous")}
                        {arrowButton(1, "Next")}
                        <span style={{ ...labelCss(p.font, labelSize, p.mutedColor), marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>
                            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                        </span>
                    </div>
                )}
            </div>
            <style>{`.ob-quote-btn { transition: background-color .25s ease, color .25s ease } .ob-quote-btn:hover { background: ${p.textColor}; color: ${p.hoverText} } .ob-quote-btn:focus-visible { outline: 1px solid ${p.textColor}; outline-offset: 3px }`}</style>
        </section>
    )
}

type Quote = { quote: string; name: string; role: string }

type TestimonialProps = {
    label: string
    items: Quote[]
    autoplay: boolean
    interval: number
    font?: FramerFont
    labelSize: number
    quoteSize: number
    textColor: string
    mutedColor: string
    hoverText: string
    hairline: string
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const TESTIMONIAL_DEFAULTS: TestimonialProps = {
    label: "Kind words",
    items: [
        { quote: "They rebuilt our site in eight weeks and it looks like nothing else in the category. Enquiries doubled in the first quarter.", name: "Dan Whitfield", role: "Founder, Series B fintech" },
        { quote: "They pushed back on every safe idea we had, and they were right every time.", name: "Priya Raman", role: "Head of Brand, consumer app" },
        { quote: "The first studio that treated Webflow like an engineering platform rather than a page builder.", name: "Tom Alder", role: "CTO, enterprise SaaS" },
    ],
    autoplay: false,
    interval: 7,
    font: undefined,
    labelSize: 13,
    quoteSize: 34,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hoverText: INK,
    hairline: HAIRLINE,
    background: INK,
    padding: 20,
    topSpace: 100,
    bottomSpace: 120,
}

addPropertyControls(Testimonials, {
    label: { type: ControlType.String, title: "Label", defaultValue: TESTIMONIAL_DEFAULTS.label },
    items: {
        type: ControlType.Array,
        title: "Quotes",
        maxCount: 12,
        control: {
            type: ControlType.Object,
            controls: {
                quote: { type: ControlType.String, title: "Quote", displayTextArea: true, defaultValue: "" },
                name: { type: ControlType.String, title: "Name", defaultValue: "" },
                role: { type: ControlType.String, title: "Role", defaultValue: "" },
            },
        },
        defaultValue: TESTIMONIAL_DEFAULTS.items,
    },
    autoplay: { type: ControlType.Boolean, title: "Autoplay", defaultValue: false },
    interval: { type: ControlType.Number, title: "Every", min: 2, max: 20, step: 1, unit: "s", defaultValue: 7, hidden: (p: { autoplay?: boolean }) => !p.autoplay },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    quoteSize: { type: ControlType.Number, title: "Quote @1440", min: 18, max: 64, step: 1, unit: "px", defaultValue: 34 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: TESTIMONIAL_DEFAULTS.mutedColor },
    hoverText: { type: ControlType.Color, title: "Button hover text", defaultValue: INK },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 100 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
})
