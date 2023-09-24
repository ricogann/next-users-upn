import _serviceCampus from "@/services/campus.service";

class _libCampus {
    serviceCampus = new _serviceCampus("https://api.ricogann.com");

    async getFakultas() {
        try {
            const data = await this.serviceCampus.getFakultas();
            return data;
        } catch (error) {
            console.error("getFakultas error", error);
            throw error;
        }
    }

    async getProdi() {
        try {
            const data = await this.serviceCampus.getProdi();
            return data;
        } catch (error) {
            console.error("getProdi error", error);
            throw error;
        }
    }

    async getTahunAjaran() {
        try {
            const data = await this.serviceCampus.getTahunAjaran();
            return data;
        } catch (error) {
            console.error("getTahunAjaran error", error);
            throw error;
        }
    }
}

export default _libCampus;
