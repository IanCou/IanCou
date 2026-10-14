import { useEffect, useRef, useState, type CSSProperties } from 'react'

type Item = {
  text?: string
  link?: { href: string; label: string }
  subs: string[]
}

type Section = {
  heading: string
  items: Item[]
}

const EMAIL = 'iancoutinho40@gmail.com'

// Signature letters with their staggered animation delays (--d),
// matching the original handwriting-draw effect.
const SIGNATURE_LETTERS: [string, string][] = [
  ['I', '0s'],
  ['a', '.13s'],
  ['n', '.26s'],
  [' ', '.39s'],
  ['C', '.52s'],
  ['o', '.65s'],
  ['u', '.78s'],
  ['t', '.91s'],
  ['i', '1.04s'],
  ['n', '1.17s'],
  ['h', '1.3s'],
  ['o', '1.43s'],
]

const SECTIONS: Section[] = [
  {
    heading: 'Current Roles',
    items: [
      { text: 'Sysadmin & Developer @ UMIACS', subs: ['GPU clusters, Slurm, Puppet, RHEL'] },
      { text: 'SWE intern @ Bold Insight', subs: ['Participant recruitment platform, Discord analytics pipelines'] },
      { text: 'Director of Technical Operations @ App Dev Club', subs: ['400+ members, People Portal, cut AWS costs 80%'] },
    ],
  },
  {
    heading: 'Projects',
    items: [
      { text: '3-node Proxmox homelab on ewaste machines', subs: ['50+ self-hosted services'] },
      {
        link: { href: 'https://devpost.com/software/replay-wq5isz', label: 'Replay' },
        subs: ['Full-body 3D motion capture from a single camera, built at Bitcamp'],
      },
      {
        link: { href: 'https://devpost.com/software/splatt-72dxb8', label: 'Splatt' },
        subs: ['Phone video to 3D Gaussian splats, $1K win'],
      },
    ],
  },
  {
    heading: 'Thinking About',
    items: [
      { text: 'Founding something', subs: ['Maybe YC someday'] },
      { text: 'How grateful I am to have supportive friends', subs: [] },
    ],
  },
]

function Signature() {
  return (
    <svg className="signature" viewBox="0 0 640 190" role="img" aria-label="Ian Coutinho">
      <text x="320" y="132" textAnchor="middle" className="sig-text" aria-hidden="true">
        {SIGNATURE_LETTERS.map(([ch, d], i) => (
          <tspan key={i} style={{ '--d': d } as CSSProperties}>
            {ch}
          </tspan>
        ))}
      </text>
    </svg>
  )
}

function EmailButton() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const showCopied = () => {
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }

  const fallbackCopy = () => {
    const ta = document.createElement('textarea')
    ta.value = EMAIL
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      // clipboard unavailable; still show feedback
    }
    document.body.removeChild(ta)
    showCopied()
  }

  const handleClick = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(EMAIL)
        showCopied()
      } catch {
        fallbackCopy()
      }
    } else {
      fallbackCopy()
    }
  }

  return (
    <button
      className={`copy-email${copied ? ' copied' : ''}`}
      title="Click to copy"
      onClick={handleClick}
    >
      {copied ? 'copied!' : EMAIL}
    </button>
  )
}

export default function App() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).style.transitionDelay = `${i * 90}ms`
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main>
      <header className="hero">
        <Signature />
        <p className="honors">CS @ UMD, QUEST Honors</p>
        <p className="tagline">I do infrastructure. I like performant and efficient systems.</p>
        <p className="links">
          <a href="https://www.linkedin.com/in/iancoutinho">LinkedIn</a>
          <a href="https://github.com/IanCou">GitHub</a>
          <EmailButton />
        </p>
      </header>

      {SECTIONS.map((section) => (
        <section key={section.heading} className="reveal">
          <h2>{section.heading}</h2>
          <ul>
            {section.items.map((item, i) => (
              <li key={i}>
                <div className="li-body">
                  <span>
                    {item.link ? (
                      <a href={item.link.href}>{item.link.label}</a>
                    ) : (
                      item.text
                    )}
                  </span>
                  {item.subs.length > 0 && (
                    <ul className="sub">
                      {item.subs.map((sub, j) => (
                        <li key={j}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
