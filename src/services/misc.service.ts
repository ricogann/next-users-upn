import _core from "./core.service";

class _misc extends _core {
    private baseUrl = _core.getBaseUrl();

    async getDataMisc() {
        try {
            const res = await fetch(`${this.baseUrl}/api/misc`);
            const data = await res.json();

            return data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default _misc;
