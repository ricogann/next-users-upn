import { useState, ChangeEvent } from "react";
import { AuthButton } from "./auth-button";
import Loading from "./loading";

import { AiOutlineClose } from "react-icons/ai";

import _libAuth from "@/lib/auth";
import _libCookies from "@/lib/cookies";

interface Props {
    setModal: () => void;
    changeModal: () => void;
}

const Login: React.FC<Props> = ({ setModal, changeModal }) => {
    const libAuth = new _libAuth();
    const libCookies = new _libCookies();

    const [role, setRole] = useState("mahasiswa");

    const [npm, setNpm] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [allError, setAllError] = useState(false);
    const [npmError, setNpmError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [messageError, setMessageError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
            setAllError(false);
            setEmailError(false);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
            setAllError(false);
            setPasswordError(false);
        } else if (e.target.name === "npm") {
            setNpm(e.target.value);
            setAllError(false);
            setNpmError(false);
        }
    };

    const handleLogin = async () => {
        if (role === "mahasiswa") {
            if (npm === "" || password === "") {
                setAllError(true);
                setMessageError("Data tidak boleh kosong");
            } else {
                setLoading(true);
                const mahasiswa = await libAuth.loginMahasiswa(npm, password);

                if (mahasiswa.status === false) {
                    setLoading(false);
                    if (mahasiswa.error.includes("NPM")) {
                        setNpmError(true);
                        setMessageError("NPM tidak terdaftar");
                    }
                    if (mahasiswa.error.includes("password")) {
                        setPasswordError(true);
                        setMessageError("Password salah");
                    }
                } else {
                    const status = JSON.parse(
                        atob(mahasiswa.split(".")[1])
                    ).status;

                    if (status === false) {
                        setLoading(false);
                        setAllError(true);
                        setMessageError("Akun anda belum aktif");
                    } else {
                        await libCookies.setCookie("CERT", mahasiswa, 1);
                        window.location.reload();
                        setLoading(false);
                    }
                }
            }
        } else {
            if (email === "" || password === "") {
                setAllError(true);
                setMessageError("Data tidak boleh kosong");
            } else {
                setLoading(true);
                const login = await libAuth.login(role, email, password);
                if (login.status === false) {
                    setLoading(false);
                    if (login.error.includes("Email")) {
                        setNpmError(true);
                        setMessageError("Email tidak terdaftar");
                    }
                    if (login.error.includes("password")) {
                        setPasswordError(true);
                        setMessageError("Password salah");
                    }
                } else {
                    const status = JSON.parse(atob(login.split(".")[1])).status;

                    if (status === false) {
                        setLoading(false);
                        setAllError(true);
                        setMessageError("Akun anda belum aktif");
                    } else {
                        await libCookies.setCookie("CERT", login, 1);
                        window.location.reload();
                        setLoading(false);
                    }
                }
            }
        }
    };

    return (
        <div className="relative">
            {loading && (
                <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                    <Loading />
                </div>
            )}
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
                        className={`bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 
                        ${
                            allError && npm === ""
                                ? "border-red-500"
                                : npmError
                                ? "border-red-500"
                                : allError
                                ? "border-red-500"
                                : emailError && email === ""
                                ? "border-red-500"
                                : ""
                        }`}
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
                            allError && password === ""
                                ? "border-red-500"
                                : passwordError
                                ? "border-red-500"
                                : allError
                                ? "border-red-500"
                                : ""
                        }`}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="px-5">
                <h1
                    className={`${
                        allError === true ||
                        npmError === true ||
                        passwordError === true ||
                        emailError === true
                            ? "block"
                            : "hidden"
                    } mb-3 font-bold text-red-500`}
                >
                    {messageError}
                </h1>
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
