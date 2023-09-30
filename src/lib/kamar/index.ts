import _serviceKamar from "@/services/kamar.service";

class _libKamar {
    serviceKamar = new _serviceKamar("https://api.ricogann.com");

    async deleteExpiredMahasiswa(id: number) {
        try {
            const data = await this.serviceKamar.deleteExpiredMahasiswa(id);

            return data;
        } catch (error) {
            console.error("deleteExpiredMahasiswa error", error);
            throw error;
        }
    }
}

export default _libKamar;
