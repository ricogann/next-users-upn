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
}

export default _serviceUsers;
