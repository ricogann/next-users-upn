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
}

export default _serviceUsers;
