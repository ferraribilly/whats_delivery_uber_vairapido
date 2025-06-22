export default function StoryIcon({ className, active }) {
  if (active) {
    return (
      <img
        src="/assets/img/ifood.ico"
        alt="Story Active Icon"
        className={className}
      />
    );
  } else {
    return (
      <img
        src="/assets/img/ifood.ico"
        alt="Story Default Icon"
        className={className}
      />
    );
  }
}
