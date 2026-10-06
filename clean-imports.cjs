const fs = require("fs");

const fileConfigs = [
  {
    path: "src/routes/edit.tsx",
    remove: [
      'import { useState, useEffect, useRef } from "react";',
      'import { motion, useMotionTemplate, useMotionValue } from "framer-motion";',
      'import { Film, Scissors, Music2, Zap, Clapperboard, Wand2, Play, Check, ArrowRight } from "lucide-react";',
      'import SpotlightCard from "@/components/site/SpotlightCard";',
      'import StarBorder from "@/components/site/StarBorder";',
      'import { Button } from "@/components/ui/button";',
      'import { cn } from "@/lib/utils";',
    ],
    replace: [
      {
        from: "import { PlayDoodle, WaveDoodle, FilmStrip, VideoEditorSimulator, Hero, ServiceCard, Services, Portfolio, Testimonials, PackageCard, Packages, shortFormItems, cinematicItems } from '@/components/edit/EditSections';",
        to: "import { Hero, Services, Portfolio, Packages, shortFormItems, cinematicItems } from '@/components/edit/EditSections';",
      },
    ],
  },
  {
    path: "src/routes/design.tsx",
    remove: [
      'import * as React from "react";',
      'import { motion, useMotionTemplate, useMotionValue } from "framer-motion";',
      'import { ArrowUpRight, Palette, Layers, Type, Sparkles, Frame, Brush } from "lucide-react";',
      'import SpotlightCard from "@/components/site/SpotlightCard";',
      'import { Button } from "@/components/ui/button";',
      'import StarBorder from "@/components/site/StarBorder";',
      'import { cn } from "@/lib/utils";',
      'import CardSwap, { Card } from "@/components/site/CardSwap";',
      'import { MagicGrid, MagicCard } from "@/components/site/MagicBento";',
    ],
    replace: [
      {
        from: "import { StarDoodle, SquiggleDoodle, CircleArrowDoodle, Hero, DesignServiceCard, Services, Portfolio, designReviews } from '@/components/design/DesignSections';",
        to: "import { Hero, Services, Portfolio, designReviews } from '@/components/design/DesignSections';",
      },
    ],
  },
  {
    path: "src/components/edit/EditSections.tsx",
    remove: [
      "import { createFileRoute } from '@tanstack/react-router'",
      'import { PageShell } from "@/components/site/PageShell";',
      'import { LogoMarquee } from "@/components/site/Marquee";',
      'import { Reviews } from "@/components/site/Reviews";',
      'import { CombinedPackage } from "@/components/site/CombinedPackage";',
    ],
  },
  {
    path: "src/components/design/DesignSections.tsx",
    remove: [
      'import { createFileRoute } from "@tanstack/react-router";',
      'import { PageShell } from "@/components/site/PageShell";',
      'import { LogoMarquee } from "@/components/site/Marquee";',
      'import { Reviews } from "@/components/site/Reviews";',
      'import { CombinedPackage } from "@/components/site/CombinedPackage";',
      'import { Footer } from "@/components/site/Footer";',
      'import SpotlightCard from "@/components/site/SpotlightCard";',
    ],
  },
];

for (const config of fileConfigs) {
  let content = fs.readFileSync(config.path, "utf8");

  if (config.remove) {
    for (const r of config.remove) {
      // Create a regex to match the import line along with its optional \r\n
      const regex = new RegExp(r.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&") + "\\\\r?\\\\n", "g");
      content = content.replace(regex, "");
    }
  }

  if (config.replace) {
    for (const r of config.replace) {
      content = content.replace(r.from, r.to);
    }
  }

  fs.writeFileSync(config.path, content);
}
console.log("Cleaned up unused imports.");
