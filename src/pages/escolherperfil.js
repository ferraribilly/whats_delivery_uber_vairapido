import EscolherPerfil from "../components/auth/EscolherPerfil"

export default function escolherperfil() {
  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Register form */}
        <EscolherPerfil />
      </div>
    </div>
  );
}
