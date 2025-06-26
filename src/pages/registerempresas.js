import RegisterFormEmpresas from "../components/auth/RegisterFormEmpresas";

export default function RegisterEmpresas() {
  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Register form */}
        <RegisterFormEmpresas />
      </div>
    </div>
  );
}
