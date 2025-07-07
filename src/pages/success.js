import Success from "../components/auth/Success";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container*/}
      <div className="flex w-[1600px] mx-auto h-full">
        {/*Register form */}
        <Success />
      </div>
    </div>
  );
}
