interface Mahasiswa {
    nama: string;
}

interface Dosen {
    nama: string;
}

interface Umum {
    nama: string;
}

interface UKM {
    nama_ukm: string;
}

interface Organisasi {
    nama_organisasi: string;
}

interface Fasilitas {
    nama: string;
}

interface Harga {
    harga: number;
}

interface Account {
    Dosen: Dosen[];
    Mahasiswa: Mahasiswa[];
    Umum: Umum[];
    UKM: UKM[];
    Organisasi: Organisasi[];
}

export default interface PemesananDTO {
    Account: Account;
    Fasilitas: Fasilitas;
    Harga: Harga;
    id_pemesanan: number;
    id_fasilitas: number;
    jam_checkin: string;
    jam_checkout: string;
    durasi: number;
    total_harga: number;
    tanggal_pemesanan: string;
    status: string;
    createdAt: string;
}
