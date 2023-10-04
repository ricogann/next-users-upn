import _core from "./core.service";

class _serviceCampus extends _core {
    constructor() {
        super();
    }

    private baseUrl = _core.getBaseUrl();

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
