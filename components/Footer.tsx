import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer style={{ opacity: 0, animation: "fadeUp 0.8s ease 0.1s forwards" }}>
        <div className="footer-brand">
          <Link href="/" className="nav-logo" style={{ display: 'block', marginBottom: 14 }}>
            JZ<span>AI</span>
          </Link>
          <p>Build custom AI chatbots for your business. Capture leads, support customers 24/7.</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <Link href="/create-chatbot">Create Chatbot</Link>
          <Link href="/pricing">Pricing</Link>
          <a href="/#process">How It Works</a>
          <a href="/#faq">FAQ</a>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link href="/auth">Sign In</Link>
          <Link href="/auth">Sign Up Free</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <a href="mailto:jahanzaibtahir2006@gmail.com" style={{ marginTop: 16, display: 'block' }}>jahanzaibtahir2006@gmail.com</a>
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
