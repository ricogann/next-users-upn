import _core from "./core.service";

class _serviceUsers extends _core {
    constructor() {
        super();
    }

    private baseUrl = _core.getBaseUrl();

    async checkExpiredMahasiswa(id: number, cookie: string) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/users/mahasiswa/check/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            );

            const data = await res.json();
            return data.status;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async checkEmail(email: string) {
        try {
            const res = await fetch(`${this.baseUrl}/api/users/checkemail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            return data.status;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async resetPassword(email: string, password: string) {
        try {
            const res = await fetch(`${this.baseUrl}/api/users/resetpassword`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            return data.status;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async Mahasiswa(id_account: number, data: Object, cookie: string) {
        try {
            const res = await fetch(`${this.baseUrl}/api/users/mahasiswa/${id_account}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getMahasiswa(id_account: number,cookie: string) {
        console.log(cookie);
        try {
             const res = await fetch(`${this.baseUrl}/api/users/mahasiswa/${id_account}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
            });

            const resData = await res.json();
            console.log(resData)
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUkm(id_account: number,cookie: string) {
        console.log(cookie);
        try {
             const res = await fetch(`${this.baseUrl}/api/users/ukm/${id_account}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
            });

            const resData = await res.json();
            console.log(resData)
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getOrganisasi(id_account: number,cookie: string) {
        console.log(cookie);
        try {
             const res = await fetch(`${this.baseUrl}/api/users/organisasi/${id_account}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
            });

            const resData = await res.json();
            console.log(resData)
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUmum(id_account: number,cookie: string) {
        console.log(cookie);
        try {
             const res = await fetch(`${this.baseUrl}/api/users/umum/${id_account}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
            });

            const resData = await res.json();
            console.log(resData)
            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async Organisasi(id_account: number, data: Object, cookie: string) {
        try {
            const res = await fetch(`${this.baseUrl}/api/users/organisasi/${id_account}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async Ukm(id_account: number, data: Object, cookie: string) {
        try {
            const res = await fetch(`${this.baseUrl}/api/users/ukm/${id_account}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async Umum(id_account: number, data: Object, cookie: string) {
        try {
            const res = await fetch(`${this.baseUrl}/api/users/umum/${id_account}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            return resData;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

export default _serviceUsers;
