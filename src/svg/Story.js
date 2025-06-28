export default function StoryIcon({ className, active }) {
  return (
    <img
      src="/assets/icons/pngegg.png"
      alt={active ? "Story Active Icon" : "Story Default Icon"}
      className={`scale-125 ${className}`}
    />
  );
}
