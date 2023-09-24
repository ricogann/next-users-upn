class _serviceCampus {
    constructor(private baseUrl: string) {}

    async getFakultas() {
        try {
            const res = await fetch(`${this.baseUrl}/api/campus/fakultas`);

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getProdi() {
        try {
            const res = await fetch(`${this.baseUrl}/api/campus/prodi`);

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTahunAjaran() {
        try {
            const res = await fetch(`${this.baseUrl}/api/campus/tahun-ajaran`);

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default _serviceCampus;
