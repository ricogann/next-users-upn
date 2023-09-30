import _serviceUsers from "@/services/users.service";

class _libUsers {
    serviceUsers = new _serviceUsers("https://api.ricogann.com");

    async checkExpiredMahasiswa(id: number) {
        try {
            const data = await this.serviceUsers.checkExpiredMahasiswa(id);

            return data;
        } catch (error) {
            console.error("checkExpiredMahasiswa error", error);
            throw error;
        }
    }

    async getAccountById(id: number) {
        try {
            const data = await this.serviceUsers.getAccountById(id);

            return data;
        } catch (error) {
            console.error("getAccountById error", error);
            throw error;
        }
    }
}

export default _libUsers;
