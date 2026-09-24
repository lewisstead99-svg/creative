import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// @include helpers

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
