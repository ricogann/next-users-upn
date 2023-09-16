import Image from "next/image";
import logo_upn from "../../public/images/logo-upn.png";
import { useState } from "react";
import { useRouter } from "next/router";

import { RxHamburgerMenu } from "react-icons/rx";

interface Props {
    isLogin: boolean;
}

const Navbar: React.FC<Props> = ({ isLogin }) => {
    const router = useRouter();

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    if (getCookie("CERT") === undefined) {
        isLogin = false;
    } else {
        isLogin = true;
    }

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleAuth = (e: React.MouseEvent) => {
        const button = event?.target as HTMLButtonElement;

        if (button.name === "login") {
            router.push("/auth/login");
        } else {
            router.push("/auth/registrasi");
        }
    };

    const handleProfile = () => {
        router.push("/account/profile");
    };

    const handleLogout = () => {
        deleteCookie("CERT");
        router.push("/auth/login");
    };

    const deleteCookie = (name: string) => {
        document.cookie =
            name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    };

    return (
        <nav className="p-5">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center justify-between w-full px-6 py-3 md:px-8">
                    <a className="text-white font-semibold text-lg ">
                        <Image
                            src={logo_upn}
                            alt="logo"
                            className="w-[60px] h-[60px]"
                        />
                    </a>

                    <div className="relative">
                        <RxHamburgerMenu
                            className="text-black text-4xl md:hidden"
                            onClick={toggleMobileMenu}
                        />
                        <div
                            className={`md:hidden ${
                                mobileMenuOpen ? "block" : "hidden"
                            } absolute right-1 w-[150px]`}
                        >
                            <div className="bg-[#cdcdcd] flex flex-col gap-2 p-3 rounded-md">
                                <button
                                    className=" text-black font-semibold"
                                    onClick={() => router.push("/")}
                                >
                                    Home
                                </button>
                                <button
                                    name="login"
                                    className={`text-black font-semibold ${
                                        isLogin ? "hidden" : "block"
                                    }`}
                                    onClick={handleAuth}
                                >
                                    Sign Up
                                </button>
                                <button
                                    name="login"
                                    className={`text-black font-semibold ${
                                        isLogin ? "hidden" : "block"
                                    }`}
                                    onClick={() => router.push("/auth/login")}
                                >
                                    Login
                                </button>
                                <button
                                    name="register"
                                    className={`text-black font-semibold ${
                                        isLogin ? "block" : "hidden"
                                    }`}
                                    onClick={handleProfile}
                                >
                                    Profile
                                </button>
                                <button
                                    name="register"
                                    className={`text-black font-semibold ${
                                        isLogin ? "block" : "hidden"
                                    }`}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex md:gap-14">
                        <button className="text-black font-bold">Home</button>
                        <button
                            name="register"
                            className={`text-black font-bold ${
                                isLogin ? "hidden" : "block"
                            }`}
                            onClick={handleAuth}
                        >
                            Sign Up
                        </button>
                        <button
                            name="login"
                            className={`text-black font-bold ${
                                isLogin ? "hidden" : "block"
                            }`}
                            onClick={handleAuth}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Hidden on Large Screens) */}
        </nav>
    );
};

export { Navbar };
