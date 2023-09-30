class _serviceUsers {
    constructor(private baseUrl: string) {}

    async getAccountById(id: number) {
        try {
            const res = await fetch(`${this.baseUrl}/api/users/account/${id}`);

            const data = await res.json();
            return data.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async checkExpiredMahasiswa(id: number) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/users/mahasiswa/check/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
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
