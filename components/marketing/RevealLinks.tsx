"use client";

import { motion } from "framer-motion";

import { echtSocialLinks } from "@/lib/social-links";

const DURATION = 0.25;
const STAGGER = 0.025;

type FlipLinkProps = {
  children: string;
  href: string;
};

function FlipLink({ children, href }: FlipLinkProps) {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase text-zinc-950 sm:text-7xl md:text-8xl lg:text-9xl"
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {children.split("").map((letter, i) => (
          <motion.span
            key={`top-${i}`}
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
          >
            {letter === " " ? "\u00a0" : letter}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((letter, i) => (
          <motion.span
            key={`bot-${i}`}
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
          >
            {letter === " " ? "\u00a0" : letter}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
}

export function RevealLinks() {
  return (
    <section className="grid w-full place-content-center gap-2 bg-green-300 px-8 py-24 text-black">
      <FlipLink href={echtSocialLinks.x}>Twitter</FlipLink>
      <FlipLink href={echtSocialLinks.linkedin}>LinkedIn</FlipLink>
      <FlipLink href={echtSocialLinks.instagram}>Instagram</FlipLink>
    </section>
  );
}
