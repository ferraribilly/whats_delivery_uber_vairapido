export default function SobreAppIcon({ className, active }) {
  return (
    <img
      src="/assets/img/apps.png"
      alt={active ? "Story Active Icon" : "Story Default Icon"}
      className={`scale-105 ${className}`}
    />
  );
}
