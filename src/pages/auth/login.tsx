import { useState, useEffect, ChangeEvent } from "react";
import { AuthForm } from "@/components/auth-form";
import { BsInstagram } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";

import { useRouter } from "next/router";

interface Cookies {
    CERT: string;
}

export default function Login() {
    const router = useRouter();
    const [role, setRole] = useState("mahasiswa");
    const [isLogin, setIsLogin] = useState(false);

    const changeLogin = (role: string) => {
        setRole(role);
    };

    useEffect(() => {
        const cookiesGet = document.cookie.split(";").reduce((res, c) => {
            const [key, val] = c.trim().split("=");
            try {
                return Object.assign(res, { [key]: JSON.parse(val) });
            } catch (e) {
                return Object.assign(res, { [key]: val });
            }
        }, {});
        const cookies = cookiesGet as Cookies;

        if (cookies.CERT) {
            router.push(`/`);
        } else {
            setIsLogin(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleButton = () => {
        router.push("/auth/registrasi");
    };

    return (
        <div className="">
            {isLogin ? (
                <div className="h-screen flex items-center justify-center bg-[#F7F8FA] overflow-hidden text-black gap-24">
                    <div className="h-full hidden xl:flex xl:flex-col xl:justify-between xl:py-12">
                        <h1 className="font-medium text-[50px] w-[600px] ">
                            Selamat Datang di Website Reservasi Fasilitas UPN
                            Veteran Jawa Timur !
                        </h1>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-5">
                                <BsInstagram className="text-[35px]" />
                                <h1 className="font-medium text-[30px]">
                                    bpu upn jatim
                                </h1>
                            </div>
                            <div className="flex items-center gap-5">
                                <AiOutlineMail className="text-[35px]" />
                                <h1 className="font-medium text-[30px]">
                                    bpu@upnjatim.ac.id
                                </h1>
                            </div>
                            <div className="flex items-center gap-5">
                                <IoCallOutline className="text-[35px]" />
                                <h1 className="font-medium text-[30px]">
                                    081332944520
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="lg:p-20 xl:border-[2px] xl:p-8 xl:rounded-xl xl:border-black">
                        <div className="flex flex-col items-start justify-center">
                            <h1 className="text-[30px] font-medium mb-5 md:mb-2 md:text-[40px] lg:text-[35px]">
                                Login
                            </h1>
                            <AuthForm
                                role={role}
                                auth={router.pathname.split("/")[2]}
                            />
                        </div>
                        <div className="">
                            <h1 className="text-[16px] font-bold mt-10 md:text-[21px] xl:text-[18px]">
                                Lupa password?{" "}
                                <span className="text-[#322A7D]">Reset</span>
                            </h1>
                            {role === "mahasiswa" ? (
                                <div className="">
                                    <h1 className="text-[16px] font-bold mt-1 md:text-[21px] xl:text-[18px]">
                                        Login sebagai Umum?{" "}
                                        <span
                                            className="text-[#322A7D] cursor-pointer "
                                            onClick={() => changeLogin("umum")}
                                        >
                                            Login
                                        </span>
                                    </h1>
                                    <h1 className="text-[16px] font-bold mt-1 md:text-[21px] xl:text-[18px]">
                                        Login sebagai Dosen?{" "}
                                        <span
                                            className="text-[#322A7D] cursor-pointer "
                                            onClick={() => changeLogin("dosen")}
                                        >
                                            Login
                                        </span>
                                    </h1>
                                </div>
                            ) : (
                                <div className="">
                                    {role === "umum" ? (
                                        <div className="">
                                            <h1 className="text-[16px] font-bold mt-1 md:text-[21px] xl:text-[18px]">
                                                Login sebagai Mahasiswa?{" "}
                                                <span
                                                    className="text-[#322A7D] cursor-pointer"
                                                    onClick={() =>
                                                        changeLogin("mahasiswa")
                                                    }
                                                >
                                                    Login
                                                </span>
                                            </h1>
                                            <h1 className="text-[16px] font-bold mt-1 md:text-[21px] xl:text-[18px]">
                                                Login sebagai Dosen?{" "}
                                                <span
                                                    className="text-[#322A7D] cursor-pointer"
                                                    onClick={() =>
                                                        changeLogin("dosen")
                                                    }
                                                >
                                                    Login
                                                </span>
                                            </h1>
                                        </div>
                                    ) : (
                                        <div className="">
                                            <h1 className="text-[16px] font-bold mt-1 md:text-[21px] xl:text-[18px]">
                                                Login sebagai Mahasiswa?{" "}
                                                <span
                                                    className="text-[#322A7D] cursor-pointer"
                                                    onClick={() =>
                                                        changeLogin("mahasiswa")
                                                    }
                                                >
                                                    Login
                                                </span>
                                            </h1>
                                            <h1 className="text-[16px] font-bold mt-1 md:text-[21px] xl:text-[18px]">
                                                Login sebagai Umum?{" "}
                                                <span
                                                    className="text-[#322A7D] cursor-pointer"
                                                    onClick={() =>
                                                        changeLogin("umum")
                                                    }
                                                >
                                                    Login
                                                </span>
                                            </h1>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-center mt-8">
                            <div className="w-[120px] h-[1px] bg-black md:w-[210px]"></div>
                            <div className="text-center mx-5 md:text-[25px] xl:text-[20px]">
                                OR
                            </div>
                            <div className="w-[120px] h-[1px] bg-black md:w-[210px]"></div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-[20px] font-bold mt-10 md:mt-5 xl:text-[18px]">
                                Belum punya akun?{" "}
                                <span
                                    className="text-[#322A7D]"
                                    onClick={handleButton}
                                >
                                    Daftar
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-screen flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
        </div>
    );
}
