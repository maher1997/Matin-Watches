export default function Home() {
  return (
    <>
      <header className="header">
        <a href="/" className="header-logo" aria-label="MATIN home">
          <img
            src="/matin-logo.svg"
            alt="MATIN Rugged Smartwatches"
            width={1971}
            height={587}
          />
        </a>
      </header>
      <main className="page">
        <h1 className="hero-logo">
          <img
            src="/matin-logo.svg"
            alt="MATIN Rugged Smartwatches"
            width={1971}
            height={587}
          />
        </h1>
        <p className="soon">Coming soon</p>
        <footer className="footer">© {new Date().getFullYear()} MATIN Watches</footer>
      </main>
    </>
  );
}
