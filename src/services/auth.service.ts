import _core from "./core.service";

class _serviceAuth extends _core {
    constructor() {
        super();
    }

    private baseUrl = _core.getBaseUrl();

    async sendLoginMahasiswa(data: Object) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/auth/login/mahasiswa`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const resData = await res.json();
            if (resData.status === false && resData.error) {
                return resData;
            } else {
                return resData.data.token;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async login(role: string, email: string, password: string) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/auth/login${
                    role === "ukm"
                        ? "/ukm"
                        : role === "organisasi"
                        ? "/organisasi"
                        : role === "umum"
                        ? "/umum"
                        : ""
                }`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const resData = await res.json();
            if (resData.status === false && resData.error) {
                return resData;
            } else {
                return resData.data.token;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async sendRegisterMahasiswa(data: FormData) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/auth/register/mahasiswa`,
                {
                    method: "POST",
                    body: data,
                }
            );

            const resData = await res.json();
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async sendRegisterUmum(data: FormData) {
        try {
            const res = await fetch(`${this.baseUrl}/api/auth/register/umum`, {
                method: "POST",
                body: data,
            });

            const resData = await res.json();
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async sendRegisterDosen(data: FormData) {
        try {
            const res = await fetch(`${this.baseUrl}/api/auth/register/dosen`, {
                method: "POST",
                body: data,
            });

            const resData = await res.json();
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async sendRegisterUKM(data: FormData) {
        try {
            const res = await fetch(`${this.baseUrl}/api/auth/register/ukm`, {
                method: "POST",
                body: data,
            });

            const resData = await res.json();
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async sendRegisterOrganisasi(data: FormData) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/auth/register/organisasi`,
                {
                    method: "POST",
                    body: data,
                }
            );

            const resData = await res.json();
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default _serviceAuth;
