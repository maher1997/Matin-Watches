export default function Home() {
  return (
    <main className="page">
      <div className="mark" aria-hidden="true">
        <span className="hand hour" />
        <span className="hand minute" />
      </div>
      <h1 className="brand">MATIN</h1>
      <p className="tagline">Watches</p>
      <div className="rule" />
      <p className="soon">Coming soon</p>
      <footer className="footer">© {new Date().getFullYear()} MATIN Watches</footer>
    </main>
  );
}
