import _core from "./core.service";

class _serviceKamar extends _core {
    constructor() {
        super();
    }

    private baseUrl = _core.getBaseUrl();

    async deleteExpiredMahasiswa(id: number) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/kamar/mahasiswa/delete-expired/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            return data;
        } catch (error) {}
    }
}

export default _serviceKamar;
