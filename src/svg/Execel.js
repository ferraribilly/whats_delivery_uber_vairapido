export default function ExecelIcon({ className, active }) {
  return (
    <img
      src="/assets/img/excel.png"
      alt={active ? "Story Active Icon" : "Story Default Icon"}
      className={`scale-105 ${className}`}
    />
  );
}
