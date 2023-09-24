class _serviceAuth {
    constructor(private baseUrl: string) {}

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
                throw new Error(resData.error);
            }
            return resData.data.token;
        } catch (error) {
            console.log(error);
        }
    }

    async login(role: string, email: string, password: string) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/auth/login${
                    role === "dosen" ? "/dosen" : "/umum"
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
                throw new Error(resData.error);
            }
            return resData.data.token;
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
}

export default _serviceAuth;
