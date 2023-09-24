import { useState, ChangeEvent } from "react";
import { AuthButton } from "./auth-button";

import { AiOutlineClose } from "react-icons/ai";

import _libAuth from "@/lib/auth";

interface Props {
    setModal: () => void;
    changeModal: () => void;
}

const Login: React.FC<Props> = ({ setModal, changeModal }) => {
    const libAuth = new _libAuth();

    const [role, setRole] = useState("mahasiswa");

    const [npm, setNpm] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hasError, setHasError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [allError, setAllError] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
            setAllError(false);
            setHasError(false);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
            setPasswordError(false);
            setAllError(false);
        } else if (e.target.name === "npm") {
            setNpm(e.target.value);
            setAllError(false);
            setHasError(false);
        }
    };

    const handleLogin = async () => {
        if (role === "mahasiswa") {
            if (npm === "") {
                setHasError(true);
                setAllError(true);
            } else if (password === "") {
                setPasswordError(true);
                setAllError(true);
            } else {
                await libAuth.loginMahasiswa(npm, password);
            }
        } else {
            if (email === "") {
                setHasError(true);
                setAllError(true);
            } else if (password === "") {
                setPasswordError(true);
                setAllError(true);
            } else {
                await libAuth.login(role, email, password);
            }
        }
    };

    return (
        <div className="">
            <div className="p-5 text-black">
                <div className="flex justify-end" onClick={setModal}>
                    <AiOutlineClose className="text-2xl cursor-pointer" />
                </div>
                <h1 className="text-[30px] font-medium mb-5 md:mb-2 md:text-[40px] lg:text-[35px] mt-3">
                    Login
                </h1>

                <div className="">
                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                        {role === "mahasiswa" ? "npm" : "email"}
                    </h1>
                    <input
                        name={`${role === "mahasiswa" ? "npm" : "email"}`}
                        type="text"
                        className={`bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 ${
                            hasError ? "border-red-500" : ""
                        } ${allError ? "border-red-500" : ""}`}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                        password
                    </h1>
                    <input
                        name={`password`}
                        type="password"
                        className={`bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 ${
                            passwordError ? "border-red-500" : ""
                        } ${allError ? "border-red-500" : ""}`}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="px-5">
                <AuthButton message={`Login`} handleLogin={handleLogin} />
                <h1 className="text-[16px] font-bold mt-8 md:text-[21px] xl:text-[18px] flex gap-3">
                    Login sebagai?{" "}
                    <span
                        className={`${
                            role === "mahasiswa" ? "hidden" : "block"
                        } text-[#322A7D]`}
                        onClick={() => setRole("mahasiswa")}
                    >
                        Mahasiswa
                    </span>{" "}
                    <span
                        className={`${
                            role === "dosen" ? "hidden" : "block"
                        } text-[#322A7D]`}
                        onClick={() => setRole("dosen")}
                    >
                        Dosen
                    </span>{" "}
                    <span
                        className={`${
                            role === "umum" ? "hidden" : "block"
                        } text-[#322A7D]`}
                        onClick={() => setRole("umum")}
                    >
                        Umum
                    </span>
                </h1>

                <h1 className="text-[16px] font-bold mt-3 md:text-[21px] xl:text-[18px]">
                    Lupa password? <span className="text-[#322A7D]">Reset</span>
                </h1>
            </div>
            <div className="flex items-center justify-center mt-8">
                <div className="w-[120px] h-[1px] bg-black md:w-[210px]"></div>
                <div className="text-center mx-5 md:text-[25px] xl:text-[20px]">
                    OR
                </div>
                <div className="w-[120px] h-[1px] bg-black md:w-[210px]"></div>
            </div>
            <div className="text-center mb-5">
                <h1 className="text-[20px] font-bold mt-10 md:mt-5 xl:text-[18px]">
                    Belum punya akun?{" "}
                    <span
                        className="text-[#322A7D] cursor-pointer"
                        onClick={changeModal}
                    >
                        Daftar
                    </span>
                </h1>
            </div>
        </div>
    );
};

export { Login };
