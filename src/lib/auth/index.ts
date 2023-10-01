import { useRouter } from "next/router";

import _serviceAuth from "@/services/auth.service";

import _libCookies from "../cookies";

class _libAuth {
    private router = useRouter();
    private cookies = new _libCookies();

    serviceAuth = new _serviceAuth("https://api.ricogann.com");

    async loginMahasiswa(npm: string, password: string) {
        try {
            const token = await this.serviceAuth.sendLoginMahasiswa({
                npm,
                password,
            });

            return token;
        } catch (error) {
            console.error("loginMahasiswa error", error);
            throw error;
        }
    }

    async login(role: string, email: string, password: string) {
        try {
            const token = await this.serviceAuth.login(role, email, password);

            return token;
        } catch (error) {
            console.error("login error", error);
            throw error;
        }
    }

    async sendRegisterMahasiswa(data: FormData) {
        try {
            const res = await this.serviceAuth.sendRegisterMahasiswa(data);

            if (res.status === false && res.error) {
                throw new Error(res.error);
            } else {
                return res.status;
            }
        } catch (error) {
            console.error("sendRegisterMahasiswa error", error);
            throw error;
        }
    }

    async sendRegisterDosen(data: FormData) {
        try {
            const res = await this.serviceAuth.sendRegisterDosen(data);

            if (res.status === false && res.error) {
                throw new Error(res.error);
            } else {
                return res.status;
            }
        } catch (error) {
            console.error("sendRegisterDosen error", error);
            throw error;
        }
    }

    async sendRegisterUmum(data: FormData) {
        try {
            const res = await this.serviceAuth.sendRegisterUmum(data);

            if (res.status === false && res.error) {
                throw new Error(res.error);
            } else {
                return res.status;
            }
        } catch (error) {
            console.error("sendRegisterUmum error", error);
            throw error;
        }
    }
}

export default _libAuth;
