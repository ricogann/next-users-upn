import CookiesDTO from "@/interfaces/cookiesDTO";
import AccountDTO from "@/interfaces/accountDTO";

class _libCookies {
    async getCookies(): Promise<CookiesDTO> {
        try {
            const cookies = document.cookie.split(";").reduce((res, c) => {
                const [key, val] = c.trim().split("=");
                try {
                    return Object.assign(res, { [key]: JSON.parse(val) });
                } catch (e) {
                    return Object.assign(res, { [key]: val });
                }
            }, {} as CookiesDTO);

            return cookies;
        } catch (error) {
            console.error("get cookies error", error);
            throw error;
        }
    }

    async setCookie(name: string, value: string, days: number) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/`;
            document.cookie = cookieString;

            return true;
        } catch (error) {
            console.error("set cookies error", error);
            throw error;
        }
    }

    async parseJwt(token: CookiesDTO): Promise<AccountDTO> {
        try {
            return JSON.parse(atob(token.CERT.split(".")[1]));
        } catch (error) {
            console.error("parse jwt cookies error", error);
            throw error;
        }
    }
}

export default _libCookies;
