import { useState, useEffect, ReactNode } from "react";
import { Navbar } from "./navbar";
import { useRouter } from "next/router";

type Cookies = {
    CERT: string;
};

type LayoutProps = {
    children: ReactNode;
};

export default function LayoutPage({ children }: LayoutProps) {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const getCookies = document.cookie.split(";").reduce((res, c) => {
            const [key, val] = c.trim().split("=");
            try {
                return Object.assign(res, { [key]: JSON.parse(val) });
            } catch (e) {
                return Object.assign(res, { [key]: val });
            }
        }, {}) as Cookies;

        if (getCookies.CERT) {
            setIsLogin(true);
        } else {
            router.push("/auth/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="">
            {isLogin ? (
                <div className="">
                    <Navbar isLogin={isLogin} />
                    {children}
                </div>
            ) : (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 text-white z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    );
}
