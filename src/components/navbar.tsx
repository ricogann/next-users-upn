import Image from "next/image";
import logo_bpu from "../../public/images/logo-bpu.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { RxHamburgerMenu } from "react-icons/rx";
import { BsPersonCircle } from "react-icons/bs";

interface Props {
    isLogin: boolean;
    nama: string;
    setModal?: () => void;
    setRegisModal?: () => void;
    setResetModal?: () => void;
    isLoading: () => void;
}

interface Cookies {
    CERT: string;
}

const Navbar: React.FC<Props> = ({
    isLogin,
    nama,
    setModal,
    setRegisModal,
    setResetModal,
    isLoading,
}) => {
    const router = useRouter();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleProfile = () => {
        router.push("/account/profile");
    };

    const handleLogout = () => {
        deleteCookie("CERT");
        if (router.pathname === "/") {
            router.reload();
        } else {
            router.push("/");
        }
    };

    const deleteCookie = (name: string) => {
        document.cookie =
            name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    };

    return (
        <nav className="bg-[#F0EDEE] shadow-xl">
            <div className=" container mx-auto flex justify-between items-center">
                <div className="flex items-center justify-between w-full px-12 py-3 md:px-8">
                    <div
                        className="text-white font-semibold text-lg"
                        onClick={() => router.push("/")}
                    >
                        <Image
                            src={logo_bpu}
                            alt="logo"
                            className="w-[110px] h-[70px]"
                        />
                    </div>

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
                                    onClick={() => {
                                        isLoading();
                                        router.push("/");
                                    }}
                                >
                                    Home
                                </button>
                                <button
                                    name="login"
                                    className={`text-black font-semibold ${
                                        isLogin ? "hidden" : "block"
                                    }`}
                                    onClick={setRegisModal}
                                >
                                    Sign Up
                                </button>
                                <button
                                    name="login"
                                    className={`text-black font-semibold ${
                                        isLogin ? "hidden" : "block"
                                    }`}
                                    onClick={setModal}
                                >
                                    Login
                                </button>
                                <button
                                    name="register"
                                    className={`text-black font-semibold ${
                                        isLogin ? "block" : "hidden"
                                    }`}
                                    onClick={() => {
                                        isLoading();
                                        handleProfile();
                                    }}
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

                    <div className="hidden md:flex md:gap-14 text-[#0A090C] font-semibold font-montserrat">
                        <button
                            className=""
                            onClick={() => {
                                isLoading();
                                if (router.pathname === "/") {
                                    router.reload();
                                } else {
                                    router.push("/");
                                }
                            }}
                        >
                            Home
                        </button>
                        <button
                            name="register"
                            className={`${isLogin ? "hidden" : "block"}`}
                            onClick={setRegisModal}
                        >
                            Sign Up
                        </button>
                        <button
                            name="login"
                            className={`${isLogin ? "hidden" : "block"}`}
                            onClick={setModal}
                        >
                            Login
                        </button>
                        <div className={`${isLogin ? "relative" : "hidden"}`}>
                            <div
                                className={`relative flex p-3 items-center gap-5 text-[#0A090C] shadow-xl border border-black ${
                                    openProfile
                                        ? `rounded-t-xl border-0`
                                        : ` rounded-xl`
                                } cursor-pointer`}
                                onClick={() => setOpenProfile(!openProfile)}
                            >
                                <BsPersonCircle className={`text-2xl`} />
                                <>{nama && nama.split(" ")[0]}</>
                            </div>
                            <div
                                className={`${
                                    openProfile
                                        ? `flex flex-col gap-2`
                                        : `hidden`
                                } absolute right-0 -bottom-[95px] border w-[200px] p-5 bg-[#ffffff] z-50`}
                            >
                                <div
                                    className=""
                                    onClick={() => {
                                        isLoading();
                                        handleProfile();
                                    }}
                                >
                                    Profile
                                </div>
                                <div className="" onClick={handleLogout}>
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export { Navbar };
