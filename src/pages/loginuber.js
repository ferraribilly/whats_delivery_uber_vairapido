import LoginFormUber from "../components/auth/LoginFormUber";

export default function LoginUber() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Login Form */}
        <LoginFormUber />
      </div>
    </div>
  );
}
