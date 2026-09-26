import type { CSSProperties } from 'react'

// Pixel-art sprite tizimi: har bir belgi = bitta piksel rangi, '.' = shaffof.
const PALETTE: Record<string, string> = {
  K: '#15151b',
  E: '#2b2b3a',
  k: '#3d3d52',
  W: '#ffffff',
  w: '#cfd8dc',
  S: '#9aa0aa',
  s: '#6b7079',
  G: '#5fbf3a',
  g: '#3f8f2a',
  D: '#8b5a2b',
  d: '#6b4220',
  R: '#ff3b3b',
  r: '#b71c1c',
  B: '#29b6f6',
  b: '#0277bd',
  C: '#4dd0e1',
  c: '#00838f',
  Y: '#ffd54f',
  y: '#ff8f00',
  P: '#b388ff',
  p: '#7c4dff',
  N: '#b0703a',
  n: '#6d3a1a',
  M: '#ff2e88',
  L: '#c6ff00',
  F: '#f1c27d',
  f: '#d9a066',
  H: '#2b1d14',
  T: '#00e5ff',
  t: '#0097a7',
}

export const SPRITES: Record<string, string[]> = {
  mountain: [
    '............',
    '.....WW.....',
    '....WWWW....',
    '...WSWWSW...',
    '...SSSWSS...',
    '..SSsSSSSS.W',
    '..SsSSSSsSWW',
    '.SSSSSsSSSSS',
    '.SSsSSSSSSsS',
    'GGSSSSGGSSSG',
    'GgGGGGGGgGGG',
    'GGGgGGGGGGgG',
  ],
  pickaxe: [
    '...cCCCCC...',
    '..cCCCCCCC..',
    '.cC....NCCC.',
    '.C....N..CCc',
    '.....N....Cc',
    '....N.....Cc',
    '...N.......c',
    '..N.........',
    '.N..........',
    'N...........',
  ],
  monitor: [
    'SSSSSSSSSSSS',
    'SEEEEEEEEEES',
    'SELEEEEEEEES',
    'SEELEEEEEEES',
    'SELEEWWWEEES',
    'SEEEEEEEEEES',
    'SSSSSSSSSSSS',
    '.....ss.....',
    '...ssssss...',
  ],
  clapper: [
    'MMWWMMWWMMWW',
    '.MMWWMMWWMMW',
    '............',
    'WWWWWWWWWWWW',
    'WEEEEEEEEEEW',
    'WEMMEEEEEEEW',
    'WEEEEEEEEEEW',
    'WEEEEMMMMEEW',
    'WEEEEEEEEEEW',
    'WWWWWWWWWWWW',
  ],
  star: [
    '.....P.....',
    '.....P.....',
    '....PWP....',
    '...PWWWP...',
    'PPPWWWWWPPP',
    '...PWWWP...',
    '....PWP....',
    '.....P.....',
    '.....P.....',
  ],
  chart: [
    '........LLLL',
    '.........LLL',
    '........L.LL',
    '.......L...L',
    '.L....L.....',
    'L.L..L......',
    '...LL.......',
    '............',
    '.......GG.GG',
    '....GG.GG.GG',
    '.GG.GG.GG.GG',
    'SSSSSSSSSSSS',
  ],
  glove: [
    '..RRRRRR....',
    '.RRWRRRRRR..',
    'RRWRRRRRRRR.',
    'RRRRRRRRRRRR',
    'RRRRRRRRRRRR',
    'rRRRRRRRRRRr',
    '.rRRRRRRRRr.',
    '..rrRRRRrr..',
    '...WWWWWW...',
    '...WwwwwW...',
    '...RRRRRR...',
    '...rrrrrr...',
  ],
  jacket: [
    '.BBB....BBB.',
    'BBBBW..WBBBB',
    'BBBBBWWBBBBB',
    'BBBBBWWBBBBB',
    'bBBBBWWBBBBb',
    '.BBBBWWBBBB.',
    '..BBBWWBBB..',
    '..RRRRRRRR..',
    '..BBBWWBBB..',
    '..BBBWWBBB..',
    '..bbbbbbbb..',
  ],
  gi: [
    '..WWW..WWW..',
    '.WWWWw.wWWW.',
    'WWWWWWwWWWWW',
    'WWWWWWWWWWWW',
    'wWWWWWWWWWWw',
    'wWWWWWWWWWWw',
    'kkkkkkkkkkkk',
    'kSSSSkkSSSSk',
    '....kkkk....',
    '...kk..kk...',
    '..kk....kk..',
    '..k......k..',
  ],
  ball: [
    '....wwww....',
    '..wwWWWWww..',
    '.wWWWEEWWWw.',
    '.wWWEEEEWWw.',
    'wWWWWEEWWWWw',
    'wEWWWWWWWWEw',
    'wEEWWWWWWEEw',
    'wWWWWEEWWWWw',
    '.wWWEEEEWWw.',
    '.wWWWEEWWWw.',
    '..wwWWWWww..',
    '....wwww....',
  ],
  wave: [
    '............',
    '..BBB.....BB',
    '.BWWBB...BWB',
    'BB..BBB.BB..',
    '.....BBBB...',
    '............',
    '..bbb.....bb',
    '.bBBbb...bBb',
    'bb..bbb.bb..',
    '.....bbbb...',
  ],
  book: [
    '.NNNNNNNNNN.',
    'NWWWWWNWWWWN',
    'NWKKKWNWKKWN',
    'NWWWWWNWWWWN',
    'NWKKKWNWKKKN',
    'NWWWWWNWWWWN',
    'NWKKWWNWKKWN',
    'NWWWWWNWWWWN',
    'NNNNNNNNNNNN',
    '.....nn.....',
  ],
  diamond: [
    '...CCCCCC...',
    '..CWWCCCCC..',
    '.CWCCCCCCcC.',
    'CCCCCCCCCCCC',
    '.cCCCcCCCCc.',
    '..cCCCCCCc..',
    '...cCCCCc...',
    '....cCCc....',
    '.....cc.....',
  ],
  envelope: [
    'YYYYYYYYYYYY',
    'YWYWWWWWWYWY',
    'YWWYWWWWYWWY',
    'YWWWYWWYWWWY',
    'YWWWWYYWWWWY',
    'YWWWWWWWWWWY',
    'YYYYYYYYYYYY',
  ],
  heart: [
    '.RR...RR.',
    'RWRR.RRRR',
    'RWRRRRRRR',
    'RRRRRRRRR',
    '.RRRRRRr.',
    '..RRRRr..',
    '...RRr...',
    '....r....',
  ],
  grass: [
    'GGGGGGGGGGGG',
    'GgGGGgGGGgGG',
    'GGgGGGGgGGGg',
    'DgDDGDDDgDDG',
    'DDDDDDDDDDDD',
    'DdDDDDdDDDDd',
    'DDDDdDDDDdDD',
    'DDdDDDDDdDDD',
    'DDDDDDdDDDDD',
    'DdDDDDDDDDdD',
    'DDDDdDDdDDDD',
    'DDDDDDDDDDDD',
  ],
  // Personaj: T = kiyim rangi, H = soch, P = shim (palette orqali almashtiriladi)
  hero: [
    '...HHHHHH...',
    '..HHHHHHHH..',
    '..HFFFFFFH..',
    '..FEFFFFEF..',
    '..FFFFFFFF..',
    '..FFFffFFF..',
    '...FFFFFF...',
    '..TTTTTTTT..',
    '.FTTTTTTTTF.',
    '.FTTtTTtTTF.',
    '.FTTTTTTTTF.',
    '..TTTTTTTT..',
    '..PPPPPPPP..',
    '..PPP..PPP..',
    '..PPP..PPP..',
    '..KKK..KKK..',
  ],
}

type Props = {
  name: keyof typeof SPRITES | string
  size?: number
  className?: string
  style?: CSSProperties
  colors?: Record<string, string>
  title?: string
}

export function Pixel({ name, size = 32, className, style, colors, title }: Props) {
  const rows = SPRITES[name]
  if (!rows) return null
  const w = rows[0].length
  const h = rows.length
  const pal = colors ? { ...PALETTE, ...colors } : PALETTE
  const rects: React.ReactElement[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < w) {
      const ch = row[x]
      if (ch === '.') {
        x++
        continue
      }
      let run = 1
      while (x + run < w && row[x + run] === ch) run++
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={pal[ch] ?? '#f0f'} />)
      x += run
    }
  })
  const scale = size / Math.max(w, h)
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rects}
    </svg>
  )
}
