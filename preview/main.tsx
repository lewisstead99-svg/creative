// Preview site: the components assembled into the pages a real Framer build
// would have (Home, Work, Manifesto, Contact). Routing is by path on the
// deployed build and by #hash inside the artifact viewer.
import * as React from "react"
import { createRoot } from "react-dom/client"
import OffBrandNav from "../framer/OffBrandNav"
import OffBrandHero from "../framer/OffBrandHero"
import FeaturedWork from "../framer/FeaturedWork"
import IntroBlock from "../framer/IntroBlock"
import LogoGrid from "../framer/LogoGrid"
import Services from "../framer/Services"
import Statement from "../framer/Statement"
import Testimonials from "../framer/Testimonials"
import CTA from "../framer/CTA"
import Footer from "../framer/Footer"
import PageHeader from "../framer/PageHeader"
import ContactDetails from "../framer/ContactDetails"

declare const __ROUTE_MODE__: "path" | "hash"

const ROUTES = ["home", "work", "manifesto", "contact"] as const
type Route = (typeof ROUTES)[number]

const href = (r: Route) => (__ROUTE_MODE__ === "path" ? (r === "home" ? "/" : `/${r}`) : r === "home" ? "#home" : `#${r}`)

function readRoute(): Route {
    const segment = (window.location.pathname.split("/").filter(Boolean).pop() ?? "").replace(/\.html$/, "")
    const hash = window.location.hash.replace(/^#\/?/, "")
    const candidates = __ROUTE_MODE__ === "path" ? [segment, hash] : [hash, segment]
    const found = candidates.find((c) => (ROUTES as readonly string[]).includes(c)) as Route | undefined
    return found ?? "home"
}

function useRoute(): Route {
    const [route, setRoute] = React.useState<Route>(readRoute)
    React.useEffect(() => {
        const update = () => {
            setRoute(readRoute())
            window.scrollTo(0, 0)
        }
        window.addEventListener("hashchange", update)
        window.addEventListener("popstate", update)
        return () => {
            window.removeEventListener("hashchange", update)
            window.removeEventListener("popstate", update)
        }
    }, [])
    return route
}

const navLinks = [
    { label: "Work", link: href("work"), newTab: false },
    { label: "Manifesto", link: href("manifesto"), newTab: false },
]
const menuLinks = [
    { label: "Home", link: href("home"), newTab: false },
    { label: "Work", link: href("work"), newTab: false },
    { label: "Manifesto", link: href("manifesto"), newTab: false },
    { label: "Contact", link: href("contact"), newTab: false },
]
const sitemap = [
    { label: "Work", link: href("work") },
    { label: "Manifesto", link: href("manifesto") },
    { label: "Contact", link: href("contact") },
]

const workCards = [
    { title: "Microsoft Windows", link: "" },
    { title: "Trevor Noah", link: "" },
    { title: "Steven Bartlett", link: "" },
    { title: "Attio", link: "" },
    { title: "Kin Health", link: "" },
    { title: "Nomad Bank", link: "" },
    { title: "Loop Sport", link: "" },
    { title: "Studio Ferra", link: "" },
]

function Nav() {
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
            <OffBrandNav logoLink={href("home")} links={navLinks} contactLink={href("contact")} menuLinks={menuLinks} />
        </div>
    )
}

function Home() {
    return (
        <>
            <OffBrandHero style={{ height: "100vh" }} cueLink="#work-section" />
            <div id="work-section" />
            <FeaturedWork buttonLink={href("work")} cards={workCards.slice(0, 4)} />
            <IntroBlock link={href("manifesto")} />
            <LogoGrid />
            <Services />
            <Statement link={href("manifesto")} />
            <Testimonials />
            <CTA buttonLink={href("contact")} />
            <Footer sitemap={sitemap} wordmarkLink={href("home")} />
        </>
    )
}

function Work() {
    return (
        <>
            <PageHeader eyebrow="Work" title="Selected work" count={String(workCards.length)} />
            <FeaturedWork showAside={false} stagger={false} cards={workCards} topSpace={60} />
            <CTA buttonLink={href("contact")} />
            <Footer sitemap={sitemap} wordmarkLink={href("home")} />
        </>
    )
}

function Manifesto() {
    return (
        <>
            <PageHeader
                eyebrow="Manifesto"
                title="Off the beaten path"
                count=""
                intro="Three things we believe about building brands, and the reason the studio exists."
            />
            <Statement
                label="01"
                text="Sameness is the default. Every category has a look, a tone and a template, and most brands adopt it without noticing."
                linkLabel=""
                rings={false}
                topSpace={140}
                bottomSpace={80}
            />
            <Statement
                label="02"
                text="Difference is a discipline. It comes from sharper strategy, braver typography and the details most people would not bother with."
                linkLabel=""
                topSpace={80}
                bottomSpace={80}
            />
            <Statement
                label="03"
                text="So we make fewer things and we make them properly. If it could belong to anyone, it is not finished."
                linkLabel="Work with us"
                link={href("contact")}
                rings={false}
                topSpace={80}
                bottomSpace={160}
            />
            <IntroBlock
                eyebrow="Founders"
                lead="Started in 2019 by two designers who kept being asked for the same site. We said no, and built a studio around the answer."
                linkLabel="See the work"
                link={href("work")}
                body={"Today the studio is a team of eleven across London and Lisbon: strategists, designers, motion artists and Webflow engineers. We take on a small number of projects at a time, and every one is led by a founder from the first workshop to launch.\n\nWe are a Webflow Enterprise Partner and we build every site to be run by your team, not ours."}
            />
            <CTA buttonLink={href("contact")} />
            <Footer sitemap={sitemap} wordmarkLink={href("home")} />
        </>
    )
}

function Contact() {
    return (
        <>
            <PageHeader eyebrow="Contact" title="Let's talk" count="" intro="Tell us what you are building. We reply within one working day." />
            <ContactDetails />
            <Footer sitemap={sitemap} wordmarkLink={href("home")} />
        </>
    )
}

function Site() {
    const route = useRoute()
    const Page = { home: Home, work: Work, manifesto: Manifesto, contact: Contact }[route]
    return (
        <>
            <Nav />
            <main key={route}>
                <Page />
            </main>
        </>
    )
}

createRoot(document.getElementById("root")!).render(<Site />)
