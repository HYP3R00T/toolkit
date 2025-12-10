import setupImage from "@/assets/setup.png";
import type { NavItem, SocialObjects, SiteConfig } from "@/lib/types";

export const SITE: SiteConfig = {
    website: "https://cloudchallenges.hyperoot.dev",
    author: "Rajesh",
    repo: "https://github.com/cloudchallenges/cloudchallenges",
    branch: "main",
    title: "Cloud Challenges",
    description:
        "CloudChallenges is a collection of real-world cloud scenarios that help you learn by solving practical, hands-on projects.",
    image: setupImage,
    imageAlt: "Check out cloudchallenges.hyperoot.dev",
    twitterHandle: "@HYP3R00T",
    starCountThreshold: 0,
    enableLayoutWidthToggle: true
};

export const LOCALE = {
    lang: "en",
};

export const navItems: NavItem[] = [
    { href: "/challenge", label: "Challenges", special: true },
];

export const Socials: SocialObjects[] = [
    {
        name: "github",
        href: "https://github.com/HYP3R00T/",
        linkTitle: `Checkout my GitHub profile`,
        active: true,
    }
];
