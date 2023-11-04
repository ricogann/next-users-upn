import { useState, ChangeEvent } from "react";
import { AuthButton } from "./auth-button";
import Loading from "./loading";

import { AiOutlineClose } from "react-icons/ai";

import _libCookies from "@/lib/cookies";

import _serviceAuth from "@/services/auth.service";

interface Props {
    setResetModal: () => void;
    changeModal: () => void;
}

const ResetPassword: React.FC<Props> = ({ setResetModal, changeModal }) => {
    const auth = new _serviceAuth();
    const libCookies = new _libCookies();

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
                <div className="flex justify-end" onClick={setResetModal}>
                    <AiOutlineClose className="text-2xl cursor-pointer" />
                </div>
                <h1 className="text-[30px] mb-5 md:mb-2 md:text-[40px] lg:text-[35px] mt-3 font-semibold lg:mb-5">
                    Login
                </h1>
                <div className="">
                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                        Email
                    </h1>
                    <input
                        name={`email`}
                        type="text"
                        className={`bg-[#ffffff] text-black border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 
                        ${allError ? "border-red-500" : ""}`}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="px-5">
                <h1
                    className={`${
                        allError === true ? "block" : "hidden"
                    } mb-3 font-bold text-red-500`}
                >
                    {messageError}
                </h1>
                <AuthButton message={`NEXT`} />
            </div>
        </div>
    );
};

export { ResetPassword };
