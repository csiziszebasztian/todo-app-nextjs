import {MainNav} from "@/components/navigation/main-nav";
import {UserNav} from "@/components/navigation/user-nav";
import {ModeToggle} from "@/components/mode-toggle";

export default function MainNavLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <MainNav className="mx-6"/>
                        <div className="ml-auto flex items-center space-x-4">
                            <ModeToggle/>
                            <UserNav/>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </>
    );
}