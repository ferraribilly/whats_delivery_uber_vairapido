import RegisterFormComercios from "../components/auth/RegisterFormComercios";

export default function RegisterComercios() {
  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Register form */}
        <RegisterFormComercios />
      </div>
    </div>
  );
}
