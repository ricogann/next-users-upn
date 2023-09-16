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
                            } absolute right-1 w-[100px]`}
                        >
                            <div className="bg-[#cdcdcd] flex flex-col gap-2 p-3 rounded-md">
                                <button className=" text-black font-semibold">
                                    Home
                                </button>
                                <button
                                    name="login"
                                    className="text-black font-semibold"
                                    onClick={handleAuth}
                                >
                                    Sign Up
                                </button>
                                <button
                                    name="register"
                                    className=" text-black font-semibold"
                                >
                                    Login
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
