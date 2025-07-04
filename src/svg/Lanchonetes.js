export default function LanchonetesIcon({ className, active }) {
  return (
    <img
      src="/assets/img/logovaiRapidoCardapioOnlines.png"
      alt={active ? "Story Active Icon" : "Story Default Icon"}
      className={`scale-125 ${className}`}
    />
  );
}
