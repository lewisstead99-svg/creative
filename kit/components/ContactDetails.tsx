import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// @include helpers

/**
 * OFF+BRAND Contact Details — a hairline grid of ways to reach the studio
 * (email, phone, address, socials). Pair it with Framer's native Form block
 * for the enquiry form.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function ContactDetails(props: Partial<ContactProps>) {
    const p = { ...CONTACT_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const cols = mobile ? 1 : p.columns
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const valueSize = fluid(p.valueSize, w, 18, 40)
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
                display: "flex",
                flexDirection: "column",
                gap: Math.round(labelSize * 3),
            }}
        >
            {p.label && <p style={labelCss(p.font, labelSize, p.mutedColor)}>{p.label}</p>}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 1, background: p.hairline, border: `1px solid ${p.hairline}` }}>
                {p.items.map((item, i) => {
                    const Tag: any = item.link ? "a" : "div"
                    return (
                        <Tag
                            key={i}
                            href={item.link || undefined}
                            target={item.link && item.newTab ? "_blank" : undefined}
                            rel={item.link && item.newTab ? "noreferrer" : undefined}
                            className="ob-contact-cell"
                            style={{
                                background: p.cellBackground,
                                padding: `${Math.round(valueSize * 1.1)}px ${Math.round(valueSize * 0.9)}px`,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: Math.round(valueSize * 1.2),
                                minHeight: valueSize * 5,
                                color: "inherit",
                                textDecoration: "none",
                                boxSizing: "border-box",
                                minWidth: 0,
                            }}
                        >
                            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...labelCss(p.font, labelSize, p.mutedColor) }}>
                                {item.label}
                                {item.link && <span className="ob-contact-arrow" style={{ display: "inline-flex", color: p.textColor, fontSize: labelSize * 1.3 }}><ArrowNE /></span>}
                            </span>
                            <span style={{ ...fontCss(p.font, 500), fontSize: valueSize, lineHeight: 1.15, letterSpacing: "0.006em", whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                                {item.value}
                            </span>
                        </Tag>
                    )
                })}
            </div>
            {p.note && <p style={{ ...fontCss(p.font, 400), fontSize: Math.round(labelSize * 1.15), lineHeight: 1.45, letterSpacing: "0.013em", color: p.mutedColor, margin: 0, maxWidth: "60ch" }}>{p.note}</p>}
            <style>{`
                .ob-contact-cell { transition: background-color .25s ease }
                a.ob-contact-cell:hover { background: ${p.cellHover} !important }
                .ob-contact-arrow { transition: transform .3s cubic-bezier(.2,.7,.2,1) }
                a.ob-contact-cell:hover .ob-contact-arrow { transform: translate(3px, -3px) }
            `}</style>
        </section>
    )
}

type ContactItem = { label: string; value: string; link: string; newTab: boolean }

type ContactProps = {
    label: string
    items: ContactItem[]
    note: string
    columns: number
    font?: FramerFont
    labelSize: number
    valueSize: number
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

const CONTACT_DEFAULTS: ContactProps = {
    label: "Get in touch",
    items: [
        { label: "New business", value: "hello@itsoffbrand.com", link: "mailto:hello@itsoffbrand.com", newTab: false },
        { label: "Phone", value: "+44 20 3000 0000", link: "tel:+442030000000", newTab: false },
        { label: "Studio", value: "Studio 4, 21 Rivington Street\nLondon EC2A 3DT", link: "", newTab: true },
        { label: "Instagram", value: "@itsoffbrand", link: "", newTab: true },
    ],
    note: "We reply within one working day. For new projects, tell us what you are building, when you need it and roughly what you have set aside for it.",
    columns: 2,
    font: undefined,
    labelSize: 13,
    valueSize: 26,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hairline: HAIRLINE,
    cellBackground: INK,
    cellHover: "rgba(229, 228, 224, 0.05)",
    background: INK,
    padding: 20,
    topSpace: 80,
    bottomSpace: 140,
}

addPropertyControls(ContactDetails, {
    label: { type: ControlType.String, title: "Label", defaultValue: CONTACT_DEFAULTS.label },
    items: {
        type: ControlType.Array,
        title: "Details",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Email" },
                value: { type: ControlType.String, title: "Value", displayTextArea: true, defaultValue: "" },
                link: { type: ControlType.Link, title: "Link" },
                newTab: { type: ControlType.Boolean, title: "New tab", defaultValue: false },
            },
        },
        defaultValue: CONTACT_DEFAULTS.items,
    },
    note: { type: ControlType.String, title: "Note", displayTextArea: true, defaultValue: CONTACT_DEFAULTS.note },
    columns: { type: ControlType.Number, title: "Columns", min: 1, max: 4, step: 1, defaultValue: 2 },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    valueSize: { type: ControlType.Number, title: "Value @1440", min: 16, max: 48, step: 1, unit: "px", defaultValue: 26 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: CONTACT_DEFAULTS.mutedColor },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    cellBackground: { type: ControlType.Color, title: "Cell fill", defaultValue: INK },
    cellHover: { type: ControlType.Color, title: "Cell hover", defaultValue: CONTACT_DEFAULTS.cellHover },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 80 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 140 },
})
