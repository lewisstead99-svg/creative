// Preview page: stacks the three components exactly the way they go on a
// Framer page (fixed nav, 100vh hero, content-sized featured work).
import * as React from "react"
import { createRoot } from "react-dom/client"
import OffBrandNav from "../framer/OffBrandNav"
import OffBrandHero from "../framer/OffBrandHero"
import FeaturedWork from "../framer/FeaturedWork"

function Page() {
    return (
        <>
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
                <OffBrandNav />
            </div>
            <OffBrandHero style={{ height: "100vh" }} />
            <FeaturedWork />
            <div style={{ height: "40vh" }} />
        </>
    )
}

createRoot(document.getElementById("root")!).render(<Page />)
