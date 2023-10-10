import _core from "./core.service";

class _serviceFasilitas extends _core {
    constructor() {
        super();
    }

    private baseUrl = _core.getBaseUrl();

    async getFasilitas() {
        try {
            const response = await fetch(`${this.baseUrl}/api/fasilitas`);
            const data = await response.json();

            return data.data;
        } catch (error) {
            console.error("get fasilitas api error", error);
        }
    }

    async getFasilitasById(id: number) {
        try {
            const response = await fetch(`${this.baseUrl}/api/fasilitas/${id}`);
            const data = await response.json();

            return data.data;
        } catch (error) {
            console.error("get fasilitas by id api error", error);
        }
    }

    async getHarga(id: number) {
        try {
            const response = await fetch(
                `${this.baseUrl}/api/harga/fasilitas/${id}`
            );
            const data = await response.json();

            return data.data;
        } catch (error) {
            console.error("get harga by id error", error);
        }
    }
}

export default _serviceFasilitas;
