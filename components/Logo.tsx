// MATIN wordmark with the "RUGGED SMARTWATCHES" tagline as live text,
// so the tagline stays readable at header size.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <img src="/matin-wordmark.svg" alt="MATIN" width={1971} height={347} />
      <span className="logo-tag">
        <i />
        Rugged Smartwatches
        <i />
      </span>
    </span>
  );
}
