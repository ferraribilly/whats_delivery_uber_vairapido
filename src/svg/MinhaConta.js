export default function MinhaContaIcon({ className, active }) {
  return (
    <img
      src="/assets/img/computador-portatil.png"
      alt={active ? "Story Active Icon" : "Story Default Icon"}
      className={`scale-105 ${className}`}
    />
  );
}
