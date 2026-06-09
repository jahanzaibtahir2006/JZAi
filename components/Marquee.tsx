const items = [
  'Lead Capture', 'AI Powered', 'Custom Training',
  'Live Chat Widget', 'Analytics Dashboard', 'Multi-language',
  'Easy Embed', 'Auto Replies', '24/7 Online',
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <div className="marquee-wrap">
      <div className="marquee-inner">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot"></span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
