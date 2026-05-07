import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer>
        <div className="footer-brand">
          <Link href="/" className="nav-logo" style={{ display: 'block', marginBottom: 14 }}>
            JZ<span>AI</span>
          </Link>
          <p>Engineering Intelligence — AI-powered solutions and cutting-edge web development.</p>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#">AI &amp; ML Solutions</a>
          <a href="#">Web Development</a>
          <a href="#">Cloud &amp; DevOps</a>
          <a href="#">Data Engineering</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Our Team</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:jahanzaibtahir2006@gmail.com">jahanzaibtahir2006@gmail.com</a>
          <a href="https://linkedin.com/in/jahanzaibtahir" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/jahanzaibtahir2006" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="#">Rawalpindi, PK</a>
        </div>
      </footer>
      <div className="footer-bottom">
        <span>© 2026 <span className="red">JZAI</span>. All rights reserved.</span>
        <a href="https://websitelaunches.com/site/jzai.store" target="_blank" rel="noopener">
          <Image
            src="https://websitelaunches.com/badge/jzai.store.svg"
            alt="Established online"
            width={180}
            height={40}
            className="launch-badge"
          />
        </a>
        <span>Built with precision &amp; passion 🔴</span>
      </div>
    </>
  )
}
