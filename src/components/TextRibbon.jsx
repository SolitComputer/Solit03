import CurvedLoop from "./ui/CurvedLoop";

/**
 * TextRibbon — pembatas visual berupa pita teks melengkung yang berjalan loop.
 */
export default function TextRibbon() {
  return (
    <section className="py-8 md:py-12 bg-surface-muted overflow-hidden">
      <CurvedLoop
        text="SOLIT 03  ✦  LAPTOP SECOND BERGARANSI  ✦  QUALITY CONTROL  ✦  "
        curve={40}
        speed={55}
        fontClassName="fill-current text-blue-600"
      />
    </section>
  );
}
