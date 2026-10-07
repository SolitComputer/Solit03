import CurvedLoop from "./ui/CurvedLoop";

/**
 * TextRibbon — pembatas visual berupa pita teks melengkung yang berjalan loop.
 */
export default function TextRibbon() {
  return (
    <section className="py-6 md:py-9 bg-surface-muted overflow-hidden border-y border-border/60">
      <CurvedLoop
        text="SOLIT 03  ✦  LAPTOP SECOND BERGARANSI  ✦  QUALITY CONTROL  ✦  GARANSI RESMI  ✦  "
        curve={40}
        speed={55}
        fontClassName="fill-current text-blue-600 text-[2.5rem] sm:text-[3rem] md:text-[3.5rem]"
      />
    </section>
  );
}