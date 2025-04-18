import { auth } from "@/auth";
import { ModeToggle } from "@/components/mode-toggle";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();

    if (!session?.user?.id) redirect("/sign-in");
    return <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <div className="flex min-h-screen w-full overflow-hidden">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <div className="max-w-[1400px] mx-auto w-full">
                    <div className="fixed top-4 right-4 max-md:hidden">
                        <ModeToggle />
                    </div>
                    {children}
                </div>
            </main>
        </div>
    </ThemeProvider>;
};

export default RootLayout;

