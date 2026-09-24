import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"
// @include helpers

/**
 * OFF+BRAND Statement — a stacked display paragraph (the manifesto voice)
 * that reveals word by word as it scrolls into view, with an optional ghost
 * link underneath and a faint ring ornament behind.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function Statement(props: Partial<StatementProps>) {
    const p = { ...STATEMENT_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w, h } = useSize(ref, { w: 1440, h: 600 })
    const mobile = w < 720
    const reduced = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const reveal = p.reveal && !reduced && !isCanvas
    const size = fluid(p.size, w, p.minSize, p.maxSize)
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const words = p.text.split(/\s+/).filter(Boolean)
    const n = Math.max(1, words.length)

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] })
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        ref.current?.style.setProperty("--ob-p", String(v))
    })
    React.useEffect(() => {
        ref.current?.style.setProperty("--ob-p", String(reveal ? scrollYProgress.get() : 1))
    }, [reveal, scrollYProgress])

    const ring = Math.round(Math.min(w, Math.max(h, 400)) * 0.9)

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                ...props.style,
                position: "relative",
                overflow: "hidden",
                background: p.background,
                color: p.textColor,
                padding: `${p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: p.align === "center" ? "center" : "flex-start",
                gap: Math.round(size * 0.5),
                ["--ob-p" as any]: reveal ? 0 : 1,
            }}
        >
            {p.rings && (
                <div aria-hidden="true" style={{ position: "absolute", right: mobile ? "-30%" : "6%", top: "50%", width: ring, height: ring, transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                    <div style={{ position: "absolute", inset: "18%", borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                </div>
            )}
            {p.label && <p style={{ ...labelCss(p.font, labelSize, p.mutedColor), position: "relative" }}>{p.label}</p>}
            <p
                style={{
                    ...fontCss(p.font, 500),
                    position: "relative",
                    fontSize: size,
                    lineHeight: p.lineHeight,
                    letterSpacing: "0.01em",
                    textTransform: p.uppercase ? "uppercase" : "none",
                    margin: 0,
                    maxWidth: `${p.maxWidth}%`,
                    textAlign: p.align === "center" ? "center" : "left",
                    textWrap: "balance" as any,
                }}
            >
                {words.map((word, i) => (
                    <span
                        key={i}
                        style={{
                            display: "inline",
                            opacity: reveal ? `clamp(${p.dim}, var(--ob-p, 0) * ${n + 2} - ${i}, 1)` : 1,
                            transition: reveal ? "opacity .2s linear" : undefined,
                        }}
                    >
                        {word}
                        {i < words.length - 1 ? " " : ""}
                    </span>
                ))}
            </p>
            {p.linkLabel && (
                <div style={{ position: "relative" }}>
                    <TextLink label={p.linkLabel} href={p.link} size={labelSize} color={p.textColor} font={p.font} />
                </div>
            )}
        </section>
    )
}

type StatementProps = {
    label: string
    text: string
    linkLabel: string
    link: string
    font?: FramerFont
    size: number
    minSize: number
    maxSize: number
    lineHeight: number
    uppercase: boolean
    align: "left" | "center"
    maxWidth: number
    reveal: boolean
    dim: number
    rings: boolean
    ringColor: string
    labelSize: number
    textColor: string
    mutedColor: string
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const STATEMENT_DEFAULTS: StatementProps = {
    label: "Manifesto",
    text: "We believe the best brands are built off the beaten path. No templates. No safe choices. Just work that people remember.",
    linkLabel: "Read the manifesto",
    link: "",
    font: undefined,
    size: 70,
    minSize: 32,
    maxSize: 120,
    lineHeight: 0.95,
    uppercase: true,
    align: "left",
    maxWidth: 92,
    reveal: true,
    dim: 0.18,
    rings: true,
    ringColor: HAIRLINE,
    labelSize: 13,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    background: INK,
    padding: 20,
    topSpace: 160,
    bottomSpace: 160,
}

addPropertyControls(Statement, {
    label: { type: ControlType.String, title: "Label", defaultValue: STATEMENT_DEFAULTS.label },
    text: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: STATEMENT_DEFAULTS.text },
    linkLabel: { type: ControlType.String, title: "Link label", defaultValue: STATEMENT_DEFAULTS.linkLabel },
    link: { type: ControlType.Link, title: "Link" },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    size: { type: ControlType.Number, title: "Size @1440", min: 24, max: 160, step: 1, unit: "px", defaultValue: 70 },
    minSize: { type: ControlType.Number, title: "Min size", min: 18, max: 80, step: 1, unit: "px", defaultValue: 32 },
    maxSize: { type: ControlType.Number, title: "Max size", min: 40, max: 240, step: 1, unit: "px", defaultValue: 120 },
    lineHeight: { type: ControlType.Number, title: "Line height", min: 0.8, max: 1.4, step: 0.05, defaultValue: 0.95 },
    uppercase: { type: ControlType.Boolean, title: "Uppercase", defaultValue: true },
    align: { type: ControlType.Enum, title: "Align", options: ["left", "center"], optionTitles: ["Left", "Center"], displaySegmentedControl: true, defaultValue: "left" },
    maxWidth: { type: ControlType.Number, title: "Max width", min: 40, max: 100, step: 1, unit: "%", defaultValue: 92 },
    reveal: { type: ControlType.Boolean, title: "Scroll reveal", description: "Words brighten one by one as the block scrolls into view.", defaultValue: true },
    dim: { type: ControlType.Number, title: "Resting opacity", min: 0, max: 0.6, step: 0.02, defaultValue: 0.18, hidden: (p: { reveal?: boolean }) => !p.reveal },
    rings: { type: ControlType.Boolean, title: "Rings", defaultValue: true },
    ringColor: { type: ControlType.Color, title: "Ring colour", defaultValue: HAIRLINE, hidden: (p: { rings?: boolean }) => !p.rings },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: STATEMENT_DEFAULTS.mutedColor },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 400, step: 1, unit: "px", defaultValue: 160 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 400, step: 1, unit: "px", defaultValue: 160 },
})
