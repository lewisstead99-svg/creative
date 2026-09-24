import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// @include helpers

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
