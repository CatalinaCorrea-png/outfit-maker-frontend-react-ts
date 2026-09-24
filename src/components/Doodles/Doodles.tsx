import "./doodles.css"

/* Dibujitos para las fotos de la landing, en el mismo idioma visual que
   el resto: trazo de tinta, sombra dura sin blur y la paleta del cuaderno.
   Son decorativos: el texto que los acompaña es el que explica. */

const T_SHIRT =
  "M72 38 L88 30 Q100 44 112 30 L128 38 L152 62 L136 78 L128 70 L128 136 L72 136 L72 70 L64 78 L48 62 Z"
const SMALL_SHIRT =
  "M74 22 L86 16 Q100 28 114 16 L126 22 L144 40 L132 52 L124 44 L124 76 L76 76 L76 44 L68 52 L56 40 Z"
const PANTS = "M78 80 H122 L128 146 H106 L100 104 L94 146 H72 Z"
const HANGER_BODY =
  "M90 83.6 L31.1 136.3 Q24.9 145.6 35.75 145.6 H144.25 Q155.1 145.6 148.9 136.3 Z"
const HANGER_HOOK = "M90 83.6 V75.85 C90 68.1 105.5 66.55 105.5 54.15 A15.5 15.5 0 0 0 74.5 54.15"

type SparkleProps = { cx: number; cy: number; r: number; className?: string }

/* El ✧ del título, como forma */
const sparklePath = ({ cx, cy, r }: SparkleProps) => {
  const k = r * 0.13
  return `M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r} Z`
}

const Sparkle = ({ className = "f-pink", ...props }: SparkleProps) => (
  <path d={sparklePath(props)} className={`${className} ink`} strokeWidth="4" strokeLinejoin="round" />
)

export const DoodleHanger = () => (
  <svg className="doodle" viewBox="0 0 200 160" aria-hidden="true">
    <g transform="translate(10 -10)">
      <g transform="translate(6 6)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
        <path d={HANGER_BODY} className="ink-fill ink" />
        <path d={HANGER_HOOK} className="none ink" />
      </g>
      <path d={HANGER_BODY} className="f-paper ink" strokeWidth="11" strokeLinejoin="round" />
      <path d={HANGER_HOOK} className="none ink" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <Sparkle cx={152} cy={32} r={22} />
  </svg>
)

export const DoodleLogin = () => (
  <svg className="doodle" viewBox="0 0 200 160" aria-hidden="true">
    <rect x="60" y="32" width="100" height="116" rx="10" className="ink-fill" />
    <rect x="54" y="26" width="100" height="116" rx="10" className="f-paper ink" strokeWidth="4" />
    <rect x="68" y="40" width="44" height="8" rx="4" className="f-pink-mid" />
    <rect x="68" y="58" width="72" height="16" rx="6" className="f-lilac-soft ink" strokeWidth="3" />
    <rect x="68" y="82" width="72" height="16" rx="6" className="f-lilac-soft ink" strokeWidth="3" />
    <circle cx="78" cy="90" r="2.5" className="ink-fill" />
    <circle cx="86" cy="90" r="2.5" className="ink-fill" />
    <circle cx="94" cy="90" r="2.5" className="ink-fill" />
    <rect x="68" y="108" width="72" height="20" rx="10" className="f-pink ink" strokeWidth="3" />
    <path
      d="M152 46 C136 35 138 21 146 21 C150 21 152 25 152 25 C152 25 154 21 158 21 C166 21 168 35 152 46 Z"
      className="f-butter ink"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  </svg>
)

export const DoodleAddGarment = () => (
  <svg className="doodle" viewBox="0 0 200 160" aria-hidden="true">
    <path d={T_SHIRT} transform="translate(6 6)" className="ink-fill" />
    <path d={T_SHIRT} className="f-pink-soft ink" strokeWidth="5" strokeLinejoin="round" />
    <rect x="106" y="76" width="14" height="14" rx="2" className="none ink" strokeWidth="3" />
    <circle cx="150" cy="122" r="18" className="ink-fill" />
    <circle cx="146" cy="118" r="18" className="f-mint ink" strokeWidth="4" />
    <path d="M146 109 V127 M137 118 H155" className="ink" strokeWidth="5" strokeLinecap="round" />
  </svg>
)

export const DoodleOutfit = () => (
  <svg className="doodle" viewBox="0 0 200 160" aria-hidden="true">
    <path d={PANTS} transform="translate(5 5)" className="ink-fill" />
    <path d={PANTS} className="f-lilac ink" strokeWidth="5" strokeLinejoin="round" />
    <path d="M78 90 H122" className="ink" strokeWidth="3" />
    <path d={SMALL_SHIRT} transform="translate(5 5)" className="ink-fill" />
    <path d={SMALL_SHIRT} className="f-sky ink" strokeWidth="5" strokeLinejoin="round" />
    <Sparkle cx={162} cy={112} r={14} className="f-butter" />
    <Sparkle cx={40} cy={100} r={9} className="f-pink" />
  </svg>
)

/* Brillitos sueltos para decorar la foto de la IA */
export const DoodleSparkles = () => (
  <svg className="doodle doodle-overlay" viewBox="0 0 200 160" aria-hidden="true">
    <Sparkle cx={170} cy={28} r={16} />
    <Sparkle cx={30} cy={134} r={11} className="f-butter" />
    <Sparkle cx={176} cy={130} r={8} className="f-mint" />
  </svg>
)
