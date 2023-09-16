import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthForm } from "@/components/auth-form";

import { BsInstagram } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";

interface Cookies {
    CERT: string;
}

export default function Registrasi() {
    const [role, setRole] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [regisRole, setRegisRole] = useState("mahasiswa");

    const router = useRouter();

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
        router.push("/auth/login");
    };

    return (
        <div className="">
            {isLogin ? (
                <div className="py-16 flex items-center justify-center bg-[#F7F8FA] text-black overflow-x-hidden xl:py-10 xl:items-start">
                    <div className="xl:p-16 xl:border-[2px] xl:border-black xl:rounded-xl">
                        <div className="flex flex-col items-start justify-center">
                            <h1 className="text-[30px] font-medium mb-5">
                                Registrasi
                            </h1>
                            <AuthForm
                                auth={router.pathname.split("/")[2]}
                            ></AuthForm>
                        </div>

                        <div className="flex items-center justify-center mt-8">
                            <div className="w-[120px] h-[1px] bg-black"></div>
                            <div className="text-center mx-5">OR</div>
                            <div className="w-[120px] h-[1px] bg-black"></div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-[20px] font-bold mt-10">
                                Sudah punya akun?{" "}
                                <span
                                    className="text-[#322A7D]"
                                    onClick={handleButton}
                                >
                                    Login
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
