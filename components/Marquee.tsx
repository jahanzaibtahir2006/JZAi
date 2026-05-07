const items = [
  'Artificial Intelligence', 'Machine Learning', 'Web Development',
  'Cloud Architecture', 'Data Engineering', 'UI / UX Design',
  'DevOps & CI/CD', 'NLP & Chatbots',
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
