// Site-wide facts. Everything here is editable; anything marked TODO is a
// placeholder to confirm before the site goes public.
export const site = {
  name: "Fabricatr",
  domain: "https://www.fabricatr.com",
  // Real positioning, taken from fabricatr.com.
  tagline: "Independent design studio fabricating brands, websites, AI products and motion systems people can't forget.",
  short: "Independent design studio. Brands, websites, AI products and motion systems people can't forget.",
  email: "hello@fabricatr.com", // TODO confirm
  locations: ["London", "Poole"], // TODO confirm
  timezone: "Europe/London",
  availability: "Taking on new projects", // shown as the status line; edit freely
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" }, // TODO
    { label: "LinkedIn", href: "https://www.linkedin.com/" }, // TODO
    { label: "Framer", href: "https://www.framer.com/" }, // TODO
  ],
  // Optional form endpoint (e.g. Formspree). Empty → the form composes an email instead.
  formEndpoint: "",
  clients: [
    "Sandbanks Concierge", "Private Market Club", "Drift Homes", "ReShot",
    "52 Pearce Avenue", "Berkeleys Drummond", "Acorn",
  ],
  capabilities: [
    { n: "01", name: "Brand", line: "Identities engineered to be remembered.", items: ["Strategy", "Naming", "Identity systems", "Brand worlds"], weave: "twill" },
    { n: "02", name: "Digital", line: "Products and platforms people return to.", items: ["Product design", "Interfaces", "Agents", "Prototyping"], weave: "basket" },
    { n: "03", name: "Web", line: "Websites that hold attention and convert it.", items: ["Web design", "E‑commerce", "Framer", "Content systems"], weave: "plain" },
    { n: "04", name: "Motion", line: "Movement with intent, from interface to film.", items: ["Motion systems", "Interface animation", "Launch films", "Kinetic type"], weave: "herringbone" },
    { n: "05", name: "Development", line: "Built properly. Fast, accessible, maintainable.", items: ["Creative development", "Framer code", "Front‑end", "Performance"], weave: "pinstripe" },
    { n: "06", name: "Creative Technology", line: "WebGL, AI and the parts nobody has named yet.", items: ["WebGL", "Generative systems", "AI products", "R&D"], weave: "satin" },
  ],
}
