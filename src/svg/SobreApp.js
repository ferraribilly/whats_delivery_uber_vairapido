export default function SobreAppIcon({ className }) {
  return (
   <img
      src="/assets/icons/ok.png"
      alt="Uber Icon"
      className={` border-[100%] border-white rounded-full ${className}`} // Adicionando borda arredondada
    />
  );
}
