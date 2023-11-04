import { useState, ChangeEvent } from "react";
import { AuthButton } from "./auth-button";
import Loading from "./loading";

import { AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";

import _libCookies from "@/lib/cookies";

import _serviceAuth from "@/services/auth.service";
import _serviceUsers from "@/services/users.service";

interface Props {
    setModal: () => void;
    changeModal: () => void;
}

const Login: React.FC<Props> = ({ setModal, changeModal }) => {
    const auth = new _serviceAuth();
    const users = new _serviceUsers();
    const libCookies = new _libCookies();

    const [role, setRole] = useState("mahasiswa");

    const [npm, setNpm] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [resetEmail, setResetEmail] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [resetConfirmPassword, setResetConfirmPassword] = useState("");
    const [isReset, setIsReset] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);

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
        } else if (e.target.name === "email-reset") {
            setResetEmail(e.target.value);
            setAllError(false);
        } else if (e.target.name === "password-reset") {
            setResetPassword(e.target.value);
            setAllError(false);
        } else if (e.target.name === "confirm-password") {
            if (resetPassword !== e.target.value) {
                setAllError(true);
                setMessageError("Password tidak sama");
            } else {
                setAllError(false);
                setResetConfirmPassword(e.target.value);
            }
        }
    };

    const handleLogin = async () => {
        if (role === "mahasiswa") {
            if (npm === "" || password === "") {
                setAllError(true);
                setMessageError("Data tidak boleh kosong");
            } else {
                setLoading(true);
                const mahasiswa = await auth.sendLoginMahasiswa({
                    npm,
                    password,
                });

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
        } else if (role === "umum" || role === "ukm" || role === "organisasi") {
            if (email === "" || password === "") {
                setAllError(true);
                setMessageError("Data tidak boleh kosong");
            } else {
                setLoading(true);
                const login = await auth.login(role, email, password);
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

    const handleResetEmail = async () => {
        if (resetEmail === "") {
            setAllError(true);
            setMessageError("Data tidak boleh kosong");
        } else {
            setLoading(true);
            const checkEmail = await users.checkEmail(resetEmail);
            // const reset = await auth.resetPassword(resetEmail);
            if (checkEmail === false) {
                setLoading(false);
                setAllError(true);
                setMessageError("Email tidak terdaftar");
            } else {
                setLoading(false);
                setIsReset(false);
                setIsResetPassword(true);
            }
        }
    };

    const handleResetPassword = async () => {
        if (resetPassword === "" || resetConfirmPassword === "") {
            setAllError(true);
            setMessageError("Data tidak boleh kosong");
        } else {
            setLoading(true);
            const reset = await users.resetPassword(resetEmail, resetPassword);
            if (reset === false) {
                setLoading(false);
                setAllError(true);
                setMessageError("Reset password gagal");
            } else {
                setLoading(false);
                setIsReset(false);
                setIsResetPassword(false);
            }
        }
    };
    return (
        <div className="">
            <div
                className={`relative ${
                    isReset || isResetPassword ? "hidden" : "block"
                }`}
            >
                {loading && (
                    <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                        <Loading />
                    </div>
                )}
                <div className="p-5 text-black">
                    <div className="flex justify-end" onClick={setModal}>
                        <AiOutlineClose className="text-2xl cursor-pointer" />
                    </div>
                    <h1 className="text-[30px] mb-5 md:mb-2 md:text-[40px] lg:text-[35px] mt-3 font-semibold lg:mb-5">
                        Login
                    </h1>
                    <div className="">
                        <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                            login sebagai
                        </h1>
                        <select
                            className="bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-3"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="umum">Umum</option>
                            <option value="ukm">UKM</option>
                            <option value="organisasi">Organisasi</option>
                        </select>
                    </div>
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

                    <h1 className="text-[16px] font-bold mt-7 md:text-[21px] xl:text-[18px]">
                        Lupa password?{" "}
                        <span
                            className="text-[#07393C]"
                            onClick={() => setIsReset(true)}
                        >
                            Reset Password
                        </span>
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
                            className="text-[#07393C] cursor-pointer"
                            onClick={changeModal}
                        >
                            Daftar
                        </span>
                    </h1>
                </div>
            </div>
            <div className={`relative ${isReset ? "block" : "hidden"}`}>
                {loading && (
                    <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                        <Loading />
                    </div>
                )}
                <div
                    className="flex justify-start"
                    onClick={() => setIsReset(false)}
                >
                    <AiOutlineArrowLeft className="text-2xl cursor-pointer text-black" />
                </div>
                <h1 className="text-[30px] mb-2 text-black md:mb-2 md:text-[40px] lg:text-[35px] mt-3 font-semibold lg:mb-5">
                    Reset Password
                </h1>
                <div className="">
                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px] text-black">
                        Email
                    </h1>
                    <input
                        name={`email-reset`}
                        type="text"
                        className={`bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 
                        ${allError ? "border-red-500" : ""}`}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <h1
                        className={`${
                            allError === true ? "block" : "hidden"
                        } mb-3 font-bold text-red-500`}
                    >
                        {messageError}
                    </h1>
                    <div className="" onClick={handleResetEmail}>
                        <AuthButton message={`NEXT`} />
                    </div>
                </div>
            </div>
            <div className={`relative ${isResetPassword ? "block" : "hidden"}`}>
                {loading && (
                    <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                        <Loading />
                    </div>
                )}
                <div
                    className="flex justify-start"
                    onClick={() => {
                        setIsReset(true);
                        setIsResetPassword(false);
                    }}
                >
                    <AiOutlineArrowLeft className="text-2xl cursor-pointer text-black" />
                </div>
                <h1 className="text-[30px] mb-2 text-black md:mb-2 md:text-[40px] lg:text-[35px] mt-3 font-semibold lg:mb-5">
                    Reset Password
                </h1>
                <div className="">
                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px] text-black">
                        New Password
                    </h1>
                    <input
                        name={`password-reset`}
                        type="password"
                        className={`bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 
                        ${allError ? "border-red-500" : ""}`}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px] text-black">
                        Confirm Password
                    </h1>
                    <input
                        name={`confirm-password`}
                        type="password"
                        className={`bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 
                        ${allError ? "border-red-500" : ""}`}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <h1
                        className={`${
                            allError === true ? "block" : "hidden"
                        } mb-3 font-bold text-red-500`}
                    >
                        {messageError}
                    </h1>
                    <div className="" onClick={handleResetPassword}>
                        <AuthButton message={`RESET`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Login };
