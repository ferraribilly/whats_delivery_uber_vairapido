export default function LogoutIcon({ className, active }) {
  return (
    <img
      src="/assets/img/logout.png"
      alt={active ? "Story Active Icon" : "Story Default Icon"}
      className={`scale-105 ${className}`}
    />
  );
}
