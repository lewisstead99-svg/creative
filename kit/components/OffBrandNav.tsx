import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"
// @include helpers


/**
 * OFF+BRAND Nav — wordmark left, links and a ghost "Contact" pill right, a
 * fixed bottom-right menu button that opens a full-screen menu with display-
 * size links, and the bottom-left status dot seen on the live site.
 *
 * Pin this layer as Fixed at the top of the page. Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function OffBrandNav(props: Partial<NavProps>) {
    const p = { ...NAV_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 720
    const logoSize = fluid(p.logoSize, w, 20, 48)
    const linkSize = fluid(p.linkSize, w, 11, 18)
    const pad = mobile ? Math.round(p.padding * 0.7) : p.padding
    const reduced = useReducedMotion()
    const { scrollY } = useScroll()
    const [hidden, setHidden] = React.useState(false)
    useMotionValueEvent(scrollY, "change", (y) => {
        if (!p.hideOnScroll) return
        const prev = scrollY.getPrevious() ?? 0
        setHidden(y > prev && y > 120)
    })
    const [open, setOpen] = React.useState(false)
    React.useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open])
    const menuSize = fluid(p.menuSize, w, 40, 120)

    const link: React.CSSProperties = {
        ...fontCss(p.font, 500),
        fontSize: linkSize,
        letterSpacing: "0.013em",
        textTransform: "uppercase",
        color: p.color,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        borderRadius: 10,
        padding: "5px 0",
    }

    return (
        <>
            <motion.header
                ref={ref}
                animate={{ y: hidden && p.hideOnScroll ? "-110%" : "0%" }}
                transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                style={{
                    width: "100%",
                    ...props.style,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: `${pad}px ${pad}px`,
                    boxSizing: "border-box",
                    color: p.color,
                    gap: 24,
                }}
            >
                <a
                    href={p.logoLink || undefined}
                    className="ob-nav-logo"
                    style={{
                        ...fontCss(p.font, 500),
                        fontSize: logoSize,
                        letterSpacing: "0.006em",
                        lineHeight: 1,
                        color: p.color,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        borderRadius: 10,
                    }}
                >
                    {p.logo}
                </a>
                <nav style={{ display: "flex", alignItems: "center", gap: mobile ? 16 : Math.round(linkSize * 1.6) }}>
                    {!mobile &&
                        p.links.map((item, i) => (
                            <a
                                key={i}
                                href={item.link || undefined}
                                target={item.newTab ? "_blank" : undefined}
                                rel={item.newTab ? "noreferrer" : undefined}
                                className="ob-nav-link"
                                style={link}
                            >
                                {item.label}
                                <ArrowNE />
                            </a>
                        ))}
                    {p.showContact && (
                        <a
                            href={p.contactLink || undefined}
                            className="ob-nav-pill"
                            style={{
                                ...link,
                                padding: `${Math.round(linkSize * 1.35)}px ${Math.round(linkSize * 2.6)}px`,
                                border: `1px solid ${p.borderColor}`,
                                borderRadius: 999,
                                gap: "0.9em",
                            }}
                        >
                            {p.contactLabel}
                            <ArrowE />
                        </a>
                    )}
                </nav>
            </motion.header>

            {p.showMenuButton && (
                <a
                    href={p.menuLink || undefined}
                    onClick={p.menuLink ? undefined : (e) => { e.preventDefault(); setOpen((o) => !o) }}
                    aria-label={open ? "Close menu" : "Menu"}
                    aria-expanded={open}
                    className="ob-nav-menu"
                    style={{
                        position: "fixed",
                        right: 24,
                        bottom: 24,
                        width: 60,
                        height: 60,
                        borderRadius: 10,
                        background: p.menuBackground,
                        border: `1px solid ${p.borderColor}`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 7,
                        boxSizing: "border-box",
                        zIndex: 20,
                    }}
                >
                    <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 8.5 : 0 }} style={{ width: 22, height: 1.5, background: p.color, display: "block" }} />
                    <motion.span animate={{ opacity: open ? 0 : 1 }} style={{ width: 22, height: 1.5, background: p.color, display: "block" }} />
                    <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -8.5 : 0 }} style={{ width: 22, height: 1.5, background: p.color, display: "block" }} />
                </a>
            )}

            <AnimatePresence>
                {open && (
                    <motion.nav
                        key="menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
                        aria-label="Site menu"
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 19,
                            background: p.menuOverlay,
                            color: p.color,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            padding: `${pad}px ${pad}px ${pad + 90}px`,
                            boxSizing: "border-box",
                            overflowY: "auto",
                        }}
                    >
                        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: Math.round(menuSize * 0.12) }}>
                            {p.menuLinks.map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={reduced ? false : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                                >
                                    <a
                                        href={item.link || undefined}
                                        onClick={() => setOpen(false)}
                                        className="ob-nav-menulink"
                                        style={{
                                            ...fontCss(p.font, 500),
                                            fontSize: menuSize,
                                            lineHeight: 0.9,
                                            letterSpacing: "0.01em",
                                            textTransform: "uppercase",
                                            color: "inherit",
                                            textDecoration: "none",
                                            display: "inline-flex",
                                            alignItems: "baseline",
                                            gap: "0.35em",
                                        }}
                                    >
                                        {item.label}
                                        <span style={{ fontSize: Math.round(menuSize * 0.22), letterSpacing: "0.05em", opacity: 0.6 }}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 40, borderTop: `1px solid ${p.borderColor}`, paddingTop: 20 }}>
                            {p.socials.map((item, i) => (
                                <TextLink key={i} label={item.label} href={item.link} size={linkSize} color={p.color} font={p.font} arrow="ne" newTab />
                            ))}
                            {p.menuEmail && (
                                <span style={{ ...labelCss(p.font, linkSize, p.color), marginLeft: "auto", letterSpacing: "0.013em", textTransform: "none" }}>{p.menuEmail}</span>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {p.showStatusDot && (
                <span
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        left: 20,
                        bottom: 26,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: p.dotColor,
                        zIndex: 20,
                    }}
                />
            )}

            <style>{`
                .ob-nav-link, .ob-nav-logo, .ob-nav-pill, .ob-nav-menu { transition: opacity .25s ease, background-color .25s ease, color .25s ease }
                .ob-nav-link:hover, .ob-nav-logo:hover { opacity: .6 }
                .ob-nav-pill:hover { background: ${p.color}; color: ${p.hoverText} }
                .ob-nav-menu:hover { opacity: .8 }
                .ob-nav-menulink { transition: opacity .25s ease } .ob-nav-menulink:hover { opacity: .5 }
            `}</style>
        </>
    )
}



type NavLink = { label: string; link: string; newTab: boolean }

type NavProps = {
    logo: string
    logoLink: string
    links: NavLink[]
    contactLabel: string
    contactLink: string
    showContact: boolean
    font?: FramerFont
    logoSize: number
    linkSize: number
    padding: number
    color: string
    hoverText: string
    borderColor: string
    hideOnScroll: boolean
    showMenuButton: boolean
    menuLink: string
    menuLinks: NavLink[]
    socials: NavLink[]
    menuEmail: string
    menuSize: number
    menuOverlay: string
    menuBackground: string
    showStatusDot: boolean
    dotColor: string
    style?: React.CSSProperties
}

const NAV_DEFAULTS: NavProps = {
    logo: "OFF+BRAND.",
    logoLink: "",
    links: [
        { label: "Manifesto", link: "", newTab: false },
        { label: "Webflow Enterprise", link: "", newTab: false },
    ],
    contactLabel: "Contact",
    contactLink: "",
    showContact: true,
    font: undefined,
    logoSize: 34,
    linkSize: 13,
    padding: 24,
    color: "#e5e4e0",
    hoverText: "#1d1d1d",
    borderColor: "rgba(229, 228, 224, 0.28)",
    hideOnScroll: true,
    showMenuButton: true,
    menuLink: "",
    menuLinks: [
        { label: "Work", link: "", newTab: false },
        { label: "Manifesto", link: "", newTab: false },
        { label: "Studio", link: "", newTab: false },
        { label: "Contact", link: "", newTab: false },
    ],
    socials: [
        { label: "Instagram", link: "", newTab: true },
        { label: "LinkedIn", link: "", newTab: true },
        { label: "Dribbble", link: "", newTab: true },
    ],
    menuEmail: "hello@itsoffbrand.com",
    menuSize: 88,
    menuOverlay: "rgba(29, 29, 29, 0.96)",
    menuBackground: "#212121",
    showStatusDot: true,
    dotColor: "#e5e4e0",
}

addPropertyControls(OffBrandNav, {
    logo: { type: ControlType.String, title: "Wordmark", defaultValue: NAV_DEFAULTS.logo },
    logoLink: { type: ControlType.Link, title: "Wordmark link" },
    links: {
        type: ControlType.Array,
        title: "Links",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Link" },
                link: { type: ControlType.Link, title: "Link" },
                newTab: { type: ControlType.Boolean, title: "New tab", defaultValue: false },
            },
        },
        defaultValue: NAV_DEFAULTS.links,
    },
    showContact: { type: ControlType.Boolean, title: "Contact pill", defaultValue: true },
    contactLabel: { type: ControlType.String, title: "Pill label", defaultValue: "Contact", hidden: (p: { showContact?: boolean }) => !p.showContact },
    contactLink: { type: ControlType.Link, title: "Pill link", hidden: (p: { showContact?: boolean }) => !p.showContact },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    logoSize: { type: ControlType.Number, title: "Wordmark @1440", min: 16, max: 72, step: 1, unit: "px", defaultValue: 34 },
    linkSize: { type: ControlType.Number, title: "Links @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    padding: { type: ControlType.Number, title: "Padding", min: 0, max: 80, step: 1, unit: "px", defaultValue: 24 },
    color: { type: ControlType.Color, title: "Text", defaultValue: NAV_DEFAULTS.color },
    hoverText: { type: ControlType.Color, title: "Pill hover text", defaultValue: NAV_DEFAULTS.hoverText },
    borderColor: { type: ControlType.Color, title: "Hairline", defaultValue: NAV_DEFAULTS.borderColor },
    hideOnScroll: {
        type: ControlType.Boolean,
        title: "Hide on scroll",
        description: "Slides the bar away while scrolling down and brings it back on the way up, so it never sits on top of a white card.",
        defaultValue: true,
    },
    showMenuButton: {
        type: ControlType.Boolean,
        title: "Menu button",
        description: "Fixed bottom-right, 10px radius. Shows in its real spot in Preview.",
        defaultValue: true,
    },
    menuLink: {
        type: ControlType.Link,
        title: "Menu link",
        description: "Leave empty and the button opens the built-in full-screen menu below.",
        hidden: (p: { showMenuButton?: boolean }) => !p.showMenuButton,
    },
    menuLinks: {
        type: ControlType.Array,
        title: "Menu items",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Page" },
                link: { type: ControlType.Link, title: "Link" },
                newTab: { type: ControlType.Boolean, title: "New tab", defaultValue: false },
            },
        },
        defaultValue: NAV_DEFAULTS.menuLinks,
        hidden: (p: { showMenuButton?: boolean; menuLink?: string }) => !p.showMenuButton || !!p.menuLink,
    },
    socials: {
        type: ControlType.Array,
        title: "Menu socials",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Instagram" },
                link: { type: ControlType.Link, title: "Link" },
                newTab: { type: ControlType.Boolean, title: "New tab", defaultValue: true },
            },
        },
        defaultValue: NAV_DEFAULTS.socials,
        hidden: (p: { showMenuButton?: boolean; menuLink?: string }) => !p.showMenuButton || !!p.menuLink,
    },
    menuEmail: { type: ControlType.String, title: "Menu email", defaultValue: NAV_DEFAULTS.menuEmail, hidden: (p: { showMenuButton?: boolean; menuLink?: string }) => !p.showMenuButton || !!p.menuLink },
    menuSize: { type: ControlType.Number, title: "Menu size @1440", min: 32, max: 160, step: 1, unit: "px", defaultValue: 88, hidden: (p: { showMenuButton?: boolean; menuLink?: string }) => !p.showMenuButton || !!p.menuLink },
    menuOverlay: { type: ControlType.Color, title: "Menu overlay", defaultValue: NAV_DEFAULTS.menuOverlay, hidden: (p: { showMenuButton?: boolean; menuLink?: string }) => !p.showMenuButton || !!p.menuLink },
    menuBackground: { type: ControlType.Color, title: "Menu fill", defaultValue: NAV_DEFAULTS.menuBackground, hidden: (p: { showMenuButton?: boolean }) => !p.showMenuButton },
    showStatusDot: { type: ControlType.Boolean, title: "Status dot", defaultValue: true },
    dotColor: { type: ControlType.Color, title: "Dot color", defaultValue: NAV_DEFAULTS.dotColor, hidden: (p: { showStatusDot?: boolean }) => !p.showStatusDot },
})
