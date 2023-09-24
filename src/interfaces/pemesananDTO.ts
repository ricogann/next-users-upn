interface Mahasiswa {
    nama: string;
}

interface Dosen {
    nama: string;
}

interface Umum {
    nama: string;
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
}

export default interface PemesananDTO {
    Account: Account;
    Fasilitas: Fasilitas;
    Harga: Harga;
    id_pemesanan: number;
    jam_checkin: string;
    jam_checkout: string;
    total_harga: number;
    tanggal_pemesanan: string;
    status: string;
    createdAt: string;
}
