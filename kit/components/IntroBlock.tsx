import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// @include helpers

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
