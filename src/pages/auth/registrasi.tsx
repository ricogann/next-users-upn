import React, { useState } from "react";
import { useRouter } from "next/router";
import { AuthForm } from "@/components/auth-form";

import { BsInstagram } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";

export default function Registrasi() {
    const [role, setRole] = useState("");

    const [regisRole, setRegisRole] = useState("mahasiswa");

    const router = useRouter();

    const handleButton = () => {
        router.push("/auth/login");
    };

    return (
        <div className="py-16 flex items-center justify-center bg-[#F7F8FA] text-black overflow-x-hidden xl:py-10 xl:items-start">
            <div className="xl:p-16 xl:border-[2px] xl:border-black xl:rounded-xl">
                <div className="flex flex-col items-start justify-center">
                    <h1 className="text-[30px] font-medium mb-5">Registrasi</h1>
                    <AuthForm auth={router.pathname.split("/")[2]}></AuthForm>
                </div>

                <div className="flex items-center justify-center mt-8">
                    <div className="w-[120px] h-[1px] bg-black"></div>
                    <div className="text-center mx-5">OR</div>
                    <div className="w-[120px] h-[1px] bg-black"></div>
                </div>
                <div className="text-center">
                    <h1 className="text-[20px] font-bold mt-10">
                        Sudah punya akun?{" "}
                        <span className="text-[#322A7D]" onClick={handleButton}>
                            Login
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    );
}
