import _serviceFasilitas from "@/services/fasilitas.service";

interface Fasilitas {
    id_fasilitas: number;
    nama: string;
    deskripsi: string;
    alamat: string;
    foto: string;
    jam_buka: string;
    jam_tutup: string;
    buka_hari: string;
    durasi: number;
    no_va: string;
}

class _libFasilitas {
    async splitData(data: Fasilitas[]): Promise<Fasilitas[][]> {
        try {
            const dataFasilitas: Fasilitas[][] = [];
            let groupFasilitas: Fasilitas[] = [];

            for (let i = 0; i < data.length; i++) {
                groupFasilitas.push(data[i]);

                if (groupFasilitas.length === 5 || i === data.length - 1) {
                    dataFasilitas.push(groupFasilitas);
                    groupFasilitas = [];
                }
            }

            return dataFasilitas;
        } catch (error) {
            console.error("splitDataFasilitas error", error);
            throw error;
        }
    }
}

export default _libFasilitas;
