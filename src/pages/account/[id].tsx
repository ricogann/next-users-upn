import { Navbar } from "@/components/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Loading from "@/components/loading";
import PDFDocument from "@/components/pdf";
import Footer from "@/components/footer";

import _serviceBooking from "@/services/booking.service";
import _misc from "@/services/misc.service";

import _libFasilitas from "@/lib/fasilitas";
import _libCookies from "@/lib/cookies";
import _libBooking from "@/lib/booking";

import CookiesDTO from "@/interfaces/cookiesDTO";
import PemesananDTO from "@/interfaces/pemesananDTO";

import _serviceUsers from "@/services/users.service";

interface Fasilitas {
    nama: string;
}

interface Pemesanan {
    Fasilitas: Fasilitas;
    id_pemesanan: number;
    jam_checkin: string;
    jam_checkout: string;
    total_harga: number;
    tanggal_pemesanan: string;
    status: string;
    createdAt: string;
    remainingTime: string;
    keterangan_tolak: string;
}

interface RemainingTime {
    tanggal_pemesanan: string;
    remainingTime: string;
}

interface misc {
    id_misc: number;
    nama_instansi: string;
    logo_instansi: number;
    no_hp: string;
    email: number;
    instagram: string;
    laman_web: string;
    nama_pic: string;
    nip_pic: string;
    tanda_tangan: string;
}

export default function Profile() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [pdfActive, setPdfActive] = useState(false);
    const [cookies, setCookies] = useState<string>("");
    const [miscData, setMiscData] = useState<misc>();
    const users = new _serviceUsers();
    const PDFDownloadLink = dynamic(
        () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
        {
            ssr: false, // Disable server-side rendering for this component
        }
    );

    const libCookies = new _libCookies();
    const libBooking = new _libBooking();

    const misc = new _misc();
    const booking = new _serviceBooking();

    const [activeTab, setActiveTab] = useState("OnProcces");

    const toggleTab = (tab: string) => {
        setActiveTab(tab);
    };

    //start auth check
    useEffect(() => {
        async function startAuth() {
            const Cookies: CookiesDTO = await libCookies.getCookies();
            const dataMisc: misc = await misc.getDataMisc();

            setMiscData(dataMisc);
            setCookies(Cookies.CERT);
            const dataCookies = await libCookies.parseJwt(Cookies);

             if (Cookies.CERT !== undefined) {
                setIsLogin(true);
                setIdAccount(dataCookies.id_account);
                setRoleAccount(dataCookies.role);
                
                if(dataCookies.role==="mahasiswa"){
                    const dataMahasiswa = await users.getMahasiswa(dataCookies.id_account,Cookies.CERT);
                    setNoTelpAccount(dataMahasiswa.data.no_telp);
                    setNamaAccount(dataMahasiswa.data.nama);

                } else if(dataCookies.role==="ukm"){
                    const dataUkm = await users.getUkm(dataCookies.id_account,Cookies.CERT);
                    setNoTelpAccount(dataUkm.data.no_telp);
                    setNamaAccount(dataUkm.data.nama_ukm);
                    setPenanggungJawab(dataUkm.data.nama_pj);
                    
                } else if (dataCookies.role==="organisasi"){
                    const dataOrganisasi = await users.getOrganisasi(dataCookies.id_account,Cookies.CERT);
                    setNoTelpAccount(dataOrganisasi.data.no_telp);
                    setNamaAccount(dataOrganisasi.data.nama_organisasi);
                    setPenanggungJawab(dataOrganisasi.data.nama_pj);
                } else if(dataCookies.role==="umum"){
                    const dataUmum = await users.getUmum(dataCookies.id_account,Cookies.CERT);
                    setNoTelpAccount(dataUmum.data.no_telp);
                    setNamaAccount(dataUmum.data.nama_ukm);
                    setPenanggungJawab(dataUmum.data.nama_pj);
                    
                } 
            } else {
                setIsLogin(false);
                router.push("/");
            }
        }

        startAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [idAccount, setIdAccount] = useState<number>(0);
    const [namaAccount, setNamaAccount] = useState<string>("");
    const [noTelpAccount, setNoTelpAccount] = useState<string>("");
    const [roleAccount, setRoleAccount] = useState<string>("");
    const [penanggungJawab , setPenanggungJawab] = useState<string>("");

    //end auth check


    const [remainingTime, setRemainingTime] = useState<RemainingTime[]>([]);

    const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);
    const [buktiSik, setBuktiSik] = useState<File | null>(null);

    useEffect(() => {
        if (activeTab === "OnProcces") {
            const interval = setInterval(async () => {
                if (remainingTime.length > 0) {
                    const updatedRemaining = await libBooking.countdown(
                        remainingTime
                    );
                    setRemainingTime(updatedRemaining);
                }
            }, 1000);

            return () => {
                clearInterval(interval); // Clear the interval on unmount
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remainingTime]);

    const handleInputFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "bukti_pembayaran") {
            setBuktiPembayaran(e.target.files![0]);
        } else if (e.target.name === "bukti_sik") {
            setBuktiSik(e.target.files![0]);
        }
    };

    const isLoading = () => {
        setLoading(!loading);
    };

    //HandleEditProfile
    const handleEditProfile = async () => {
    if (namaAccount === "" || noTelpAccount === "") {
            alert("Mohon isi semua field!");
            return;
    }
    // Validate input fields before proceeding
    if(roleAccount === "ukm"){
        if (penanggungJawab === "") {
            alert("Mohon isi semua field!");
            return;
        }
         setLoading(true);
        try {
            const data = {
                nama_ukm: namaAccount,
                no_telp: noTelpAccount,
                nama_pj: penanggungJawab,
            };

            const response = await users.Ukm(
                idAccount,
                data,
                cookies
            );

            if (response.status === true) {
                setLoading(false);
                router.push("/account/profile");
            }
        } catch (error) {
            console.error(error);
        }
    } else if (roleAccount === "organisasi"){
        if (penanggungJawab === "") {
            alert("Mohon isi semua field!");
            return;
        }
        setLoading(true);
        try {
            const data = {
                nama_organisasi: namaAccount,
                no_telp: noTelpAccount,
                nama_pj: penanggungJawab,
            };

            const response = await users.Organisasi(
                idAccount,
                data,
                cookies
            );

            if (response.status === true) {
                setLoading(false);
                router.push("/account/profile");
            }
        } catch (error) {
            console.error(error);
        }
    } else if (roleAccount === "mahasiswa"){
        setLoading(true);
        try {
            const data = {
                nama: namaAccount,
                no_telp: noTelpAccount,
            };

            const response = await users.Mahasiswa(
                idAccount,
                data,
                cookies
            );

            if (response.status === true) {
                setLoading(false);
                router.push("/account/profile");
            }
        } catch (error) {
            console.error(error);
        }
    } else if (roleAccount === "umum"){
        setLoading(true);
        try {
            const data = {
                nama: namaAccount,
                no_telp: noTelpAccount,
            };

            const response = await users.Umum(
                idAccount,
                data,
                cookies
            );

            if (response.status === true) {
                setLoading(false);
                alert("Mohon isi semua field!");
                router.push("/account/profile");
            }
        } catch (error) {
            console.error(error);
        }
    }
};
    
    return (
        <div className={`bg-[#2C666E] min-h-screen relative`}>
            {loading && (
                <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                    <Loading />
                </div>
            )}
            <Navbar
                isLogin={isLogin}
                nama={namaAccount}
                isLoading={isLoading}
            />

            <div className="xl:m-24 text-[#F0EDEE]">
                <h1 className="ml-8 mt-4 font-bold xl:block xl:text-[36px]">
                    Edit Profile Anda
                </h1>
                <div className=" bg-[#FFFFFF] flex m-8 mt-4 flex-col gap-3 p-8 rounded-[15px] shadow-lg xl:flex-row text-[#0A090C]">
                    <div className="m-4 gap-2 flex flex-col xl:flex-grow">
                        <div className="">
                            <h2 className="text-[16px] lg:text-[18px] font-semibold">
                                {roleAccount === 'ukm' ? 'Nama UKM' : roleAccount === 'organisasi' ? 'Nama Organisasi' : 'Nama'}
                            </h2>
                            <input
                            type="text"
                            className="input input-bordered input-accent  w-full max-w-xs bg-[#FFFFFF]"
                            value={namaAccount}
                            onChange={(e) => setNamaAccount(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[18px] font-semibold">
                                No. Telpon
                            </h2>
                            <input
                            type="number"
                            className="input input-bordered input-accent  w-full max-w-xs bg-[#FFFFFF]"
                            value={noTelpAccount}
                            onChange={(e) => setNoTelpAccount(e.target.value)}
                            />
                        </div>
                        {roleAccount === 'ukm' || roleAccount === 'organisasi' ? (
                        <div className="">
                            <h2 className="text-[16px] lg:text-[18px] font-semibold">Penanggung Jawab</h2>
                            <input
                            type="text"
                            className="input input-bordered input-accent  w-full max-w-xs bg-[#FFFFFF]"
                            value={penanggungJawab}
                            onChange={(e) => setPenanggungJawab(e.target.value)}
                            />
                        </div>
                        ) : null}
                        <button
                            className={` bg-[#322A7D] hover:bg-[#231d57] text-white font-bold p-2 rounded-lg mt-5`}
                            onClick={handleEditProfile}
                        >
                            Simpan
                        </button>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
