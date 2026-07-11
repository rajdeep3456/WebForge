import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen md:my-4 h-full">
      <SignUp />
    </div>
  );
}
