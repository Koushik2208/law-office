import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return <div>
        {children}
        <SocialAuthForm />
    </div>;
};

export default AuthLayout;