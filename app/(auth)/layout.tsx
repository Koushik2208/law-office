import Image from "next/image";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      {/* Image Section */}
      <div className="w-1/2 h-screen relative max-md:hidden">
        <Image
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop"
          alt="Law Office"
          className="object-cover"
          fill
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Law Office</h1>
            <p className="text-lg">Manage your legal cases efficiently</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-1/2 p-8 h-screen overflow-y-auto flex flex-col gap-8 max-md:w-full">
        {children}
        <SocialAuthForm />
      </div>
    </div>
  );
};

export default AuthLayout;