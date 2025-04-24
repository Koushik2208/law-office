import NavLinks from "./NavLinks";
import { Button } from "./ui/button";
import { signOut } from "@/auth";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden flex-shrink-0 md:flex flex-col w-64 h-screen bg-white border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold">Law Office</h1>
        </div>
        <NavLinks />
        <div className="p-4 mt-auto border-t border-slate-200">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              className="w-full cursor-pointer bg-white text-black dark:bg-secondary hover:bg-primary dark:hover:bg-secondary hover:text-white"
              type="submit"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger className="md:hidden p-2 rounded-lg bg-white shadow-md">
            <Image src="/icons/menu.svg" alt="Menu" width={24} height={24} />
          </SheetTrigger>
          <SheetContent
            aria-describedby="navigation"
            side="left"
            className="flex flex-col p-0 w-64 max-h-screen"
          >
            <SheetTitle className="sr-only">Law Office</SheetTitle>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Law Office</h2>
            </div>
            <NavLinks />
            <div className="p-4 mt-auto border-t border-sidebar-border">
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button
                  className="w-full bg-white text-black hover:bg-primary hover:text-white"
                  type="submit"
                >
                  Sign Out
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
