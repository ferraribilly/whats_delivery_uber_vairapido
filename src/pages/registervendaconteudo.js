import RegisterFormVendaConteudo from "../components/auth/RegisterFormVendaConteudo";

export default function RegisterVendaConteudo() {
  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Register form */}
        <RegisterFormVendaConteudo />
      </div>
    </div>
  );
}
