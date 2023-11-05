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
            const cookies: CookiesDTO = await libCookies.getCookies();
            const dataMisc: misc = await misc.getDataMisc();

            setMiscData(dataMisc);
            setCookies(cookies.CERT);
            const dataCookies = await libCookies.parseJwt(cookies);

            if (cookies.CERT !== undefined) {
                setIsLogin(true);

                setIdAccount(dataCookies.id_account);
                setNamaAccount(dataCookies.nama);
                setNoTelpAccount(dataCookies.no_telp);
                setRoleAccount(dataCookies.role);
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

    //end auth check

    //start get data booking user
    const [dataBookingOnProcess, setDataBookingOnProcess] = useState<
        Pemesanan[]
    >([]);
    const [dataBookingOnGoing, setDataBookingOnGoing] = useState<Pemesanan[]>(
        []
    );
    const [dataBookingReview, setDataBookingReview] = useState<Pemesanan[]>([]);
    const [dataBookingFinished, setDataBookingFinished] = useState<Pemesanan[]>(
        []
    );
    const [dataBookingCanceled, setDataBookingCanceled] = useState<Pemesanan[]>(
        []
    );

    const [remainingTime, setRemainingTime] = useState<RemainingTime[]>([]);

    const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);
    const [buktiSik, setBuktiSik] = useState<File | null>(null);

    useEffect(() => {
        async function fetchData(idAccount: number, cookies: string) {
            const data = await booking.getPemesananByIdUser(idAccount, cookies);

            if (data.data.length > 0) {
                const dataOnProcess = data.data.filter(
                    (item: Pemesanan) => item.status === "Menunggu Konfirmasi"
                );

                const dataOnGoing = data.data.filter(
                    (item: Pemesanan) => item.status === "Menunggu Berkas"
                );

                const dataReview = data.data.filter(
                    (item: Pemesanan) => item.status === "Review Berkas"
                );

                const dataFinished = data.data.filter(
                    (item: Pemesanan) => item.status === "Dikonfirmasi"
                );

                const dataCanceled = data.data.filter(
                    (item: Pemesanan) => item.status === "Dibatalkan"
                );

                const dataDate: RemainingTime[] = dataOnProcess.map(
                    (item: Pemesanan) => {
                        return {
                            tanggal_pemesanan: item.createdAt,
                            remainingTime: "",
                        };
                    }
                );

                setRemainingTime(dataDate);
                setDataBookingOnProcess(dataOnProcess);
                setDataBookingOnGoing(dataOnGoing);
                setDataBookingReview(dataReview);
                setDataBookingFinished(dataFinished);
                setDataBookingCanceled(dataCanceled);
            }
        }

        if (cookies) {
            fetchData(idAccount, cookies);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idAccount]);

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

    const handleUpload = async (id: number) => {
        if (!buktiSik) {
            setLoading(true);
            const data = new FormData();
            data.append("bukti_pembayaran", buktiPembayaran as File);
            const res = await booking.uploadBuktiPembayaran(
                data,
                Number(id),
                cookies
            );
            if (res.status === true) {
                router.reload();
            }
        } else if (!buktiPembayaran) {
            setLoading(true);
            const data = new FormData();
            data.append("SIK", buktiSik as File);
            const res = await booking.uploadSIK(data, Number(id), cookies);
            if (res.status === true) {
                router.reload();
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
            <Navbar isLogin={isLogin} nama={namaAccount} />

            <div className="xl:m-24 text-[#F0EDEE]">
                <h1 className="ml-8 mt-4 font-bold xl:block xl:text-[36px]">
                    Profile Anda
                </h1>
                <div className=" bg-[#FFFFFF] flex m-8 mt-4 flex-col gap-3 p-8 rounded-[15px] shadow-lg xl:flex-row text-[#0A090C]">
                    <div className="m-4 gap-2 flex flex-col xl:flex-grow">
                        <div className="">
                            <h2 className="text-[16px] lg:text-[18px] font-semibold">
                                Nama
                            </h2>
                            <h2 className="text-[16px] lg:text-[18px] font-semibold ">
                                {namaAccount}
                            </h2>
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[18px] font-semibold">
                                No. Telpon
                            </h2>
                            <h2 className="text-[16px] lg:text-[18px] font-semibold ">
                                {noTelpAccount}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-lg mx-8 p-6 rounded-xl text-[#0A090C]">
                    <div className="flex flex-col">
                        <h1 className="text-[25px] font-semibold text-[#11141A]">
                            Riwayat Pemesanan
                        </h1>
                        <div className="flex flex-row items-start border-b border-[#E2E7EE] mt-3 ">
                            <a href="#" onClick={() => toggleTab("OnProcces")}>
                                <h2
                                    className={`text-[14px] font-regular mb-3 mr-5 ${
                                        activeTab === "OnProcces"
                                            ? "border-b-2 border-[#FFA101] font-bold"
                                            : ""
                                    }`}
                                >
                                    On Process
                                </h2>
                            </a>
                            <a href="#" onClick={() => toggleTab("On Going")}>
                                <h2
                                    className={`text-[14px] font-regular mb-3 mr-5 ${
                                        activeTab === "On Going"
                                            ? "border-b-2 border-[#FFA101] font-bold"
                                            : ""
                                    }`}
                                >
                                    Upload Data
                                </h2>
                            </a>
                            <a href="#" onClick={() => toggleTab("Review")}>
                                <h2
                                    className={`text-[14px] font-regular mb-3 mr-5 ${
                                        activeTab === "Review"
                                            ? "border-b-2 border-[#FFA101] font-bold"
                                            : ""
                                    }`}
                                >
                                    Review Berkas
                                </h2>
                            </a>
                            <a href="#" onClick={() => toggleTab("Finished")}>
                                <h2
                                    className={`text-[14px] font-regular mb-3 mr-5 ${
                                        activeTab === "Finished"
                                            ? "border-b-2 border-[#FFA101] font-bold"
                                            : ""
                                    }`}
                                >
                                    Finished
                                </h2>
                            </a>
                            <a href="#" onClick={() => toggleTab("Canceled")}>
                                <h2
                                    className={`text-[14px] font-regular mb-3 mr-5 ${
                                        activeTab === "Canceled"
                                            ? "border-b-2 border-[#FFA101] font-bold"
                                            : ""
                                    }`}
                                >
                                    Canceled
                                </h2>
                            </a>
                        </div>
                    </div>

                    {/* Start Of div Card On Proccess*/}
                    {activeTab === "OnProcces" && (
                        <div className="flex flex-col gap-5 rounded-[15px] xl:grid xl:grid-cols-3 xl:w-full xl:justify-items-center xl:mt-4">
                            {dataBookingOnProcess.map((item: any, index) => (
                                <div
                                    className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border-2 border-[#FFA101] xl:w-[300px]"
                                    key={index}
                                >
                                    <div className="flex flex-col">
                                        <h2 className="text-[16px] lg:text-[20px] font-bold">
                                            {item.Fasilitas.nama}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                            {`Booking ref # : ${item.id_pemesanan}`}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                            {new Date(
                                                item.tanggal_pemesanan
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}{" "}
                                        </h2>
                                    </div>

                                    <div className="border-t border-gray-500 xl:hidden"></div>
                                    <div className="text-black">
                                        <h2 className="text-[16px] lg:text-[15px] font-semibold ">
                                            Status
                                        </h2>
                                        <h1 className="text-[#FFA101] font-bold">
                                            Menunggu Persetujuan
                                        </h1>
                                    </div>
                                </div>
                            ))}
                            {/* Start The Card */}
                        </div>
                    )}

                    {activeTab === "On Going" && (
                        <div className="flex flex-col gap-5 rounded-[15px] xl:m-4 xl:grid xl:grid-cols-3 xl:gap-10 xl:ml-10 ">
                            {
                                dataBookingOnGoing.map(
                                    (item: Pemesanan, index) => (
                                        <div
                                            className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border-2 border-[#FFA101] xl:w-[300px]"
                                            key={index}
                                        >
                                            <div className="flex flex-col">
                                                <h2 className="text-[16px] lg:text-[20px] font-bold my-3 ">
                                                    {item.Fasilitas.nama}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[15px] font-regulat ">
                                                    {`Booking ref # : ${item.id_pemesanan}`}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[15px] font-regulat ">
                                                    {new Date(
                                                        item.tanggal_pemesanan
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}{" "}
                                                </h2>
                                            </div>

                                            <div className="border-t border-gray-500 xl:hidden"></div>
                                            <div
                                                className={`text-center ${
                                                    roleAccount !== "umum"
                                                        ? item.Fasilitas
                                                              .nama === "Asrama"
                                                            ? "block"
                                                            : "hidden"
                                                        : "flex flex-col gap-2"
                                                }`}
                                            >
                                                <h2 className="text-[16px] lg:text-[15px] font-semibold">
                                                    Kode BNI VA
                                                </h2>
                                                <h2 className="text-[16px] lg:text-[20px] font-semibold text-[#FFA101]">
                                                    1693547942887
                                                </h2>
                                            </div>
                                            <div
                                                className={`text-center ${
                                                    roleAccount !== "umum"
                                                        ? item.Fasilitas
                                                              .nama === "Asrama"
                                                            ? "block"
                                                            : "hidden"
                                                        : "flex"
                                                }`}
                                            >
                                                <h2 className="text-[16px] lg:text-[12px] font-bold xl:hidden">
                                                    Upload Bukti Pembayaran
                                                </h2>

                                                <div>
                                                    <h1>
                                                        Upload Bukti Pembayaran
                                                    </h1>
                                                    <input
                                                        name="bukti_pembayaran"
                                                        type="file"
                                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                                        onChange={
                                                            handleInputFoto
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                className={`text-center ${
                                                    roleAccount !== "umum"
                                                        ? item.Fasilitas
                                                              .nama === "Asrama"
                                                            ? "hidden"
                                                            : "block"
                                                        : "hidden"
                                                }`}
                                            >
                                                <h1>Upload SIK</h1>
                                                <input
                                                    name="bukti_sik"
                                                    type="file"
                                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                                    onChange={handleInputFoto}
                                                />
                                            </div>

                                            <button
                                                className={` bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-3 rounded-lg`}
                                                onClick={() =>
                                                    handleUpload(
                                                        item.id_pemesanan
                                                    )
                                                }
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )
                                ) /* Start The Card */
                            }
                        </div>
                    )}
                    {/* End of The div Card On Going*/}

                    {activeTab === "Review" && (
                        <div className="flex flex-col gap-5 rounded-[15px] xl:grid xl:grid-cols-3 xl:w-full xl:justify-items-center xl:mt-4">
                            {dataBookingReview.map((item: any, index) => (
                                <div
                                    className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border-2 border-[#FFA101] xl:w-[300px]"
                                    key={index}
                                >
                                    <div className="flex flex-col">
                                        <h2 className="text-[16px] lg:text-[20px] font-bold">
                                            {item.Fasilitas.nama}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                            {`Booking ref # : ${item.id_pemesanan}`}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                            {new Date(
                                                item.tanggal_pemesanan
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}{" "}
                                        </h2>
                                    </div>

                                    <div className="border-t border-gray-500 xl:hidden"></div>
                                    <div className="text-black">
                                        <h2 className="text-[16px] lg:text-[15px] font-semibold ">
                                            Status
                                        </h2>
                                        <h1 className="text-[#FFA101] font-bold">
                                            Menunggu Review Berkas
                                        </h1>
                                    </div>
                                </div>
                            ))}
                            {/* Start The Card */}
                        </div>
                    )}

                    {/* Start Of div Card On Going*/}
                    {activeTab === "Finished" && (
                        <div className="flex flex-col gap-5 rounded-[15px] xl:grid xl:grid-cols-3 p-3 xl:ml-10 xl:gap-10">
                            {dataBookingFinished.map(
                                (item: Pemesanan, index) => (
                                    <div
                                        className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border-2 border-[#2EC114] xl:w-[300px]"
                                        key={index}
                                    >
                                        <div className="flex flex-col w-full gap-4">
                                            <div className="flex flex-col">
                                                <h2 className="text-[16px] lg:text-[20px] font-bold ">
                                                    {item.Fasilitas.nama}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                                    Booking ref # :{" "}
                                                    {item.id_pemesanan}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                                    {new Date(
                                                        item.tanggal_pemesanan
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}{" "}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-500 xl:hidden"></div>
                                        <PDFDownloadLink
                                            document={
                                                <PDFDocument
                                                    nama={namaAccount}
                                                    no_invoice={
                                                        item.id_pemesanan
                                                    }
                                                    nama_fasilitas={
                                                        item.Fasilitas.nama
                                                    }
                                                    harga={item.total_harga}
                                                    tanggal_pemesanan={
                                                        item.tanggal_pemesanan
                                                    }
                                                    data={miscData as misc}
                                                />
                                            }
                                            fileName={`invoice-${item.id_pemesanan}.pdf`}
                                        >
                                            {({
                                                blob,
                                                url,
                                                loading,
                                                error,
                                            }) => (
                                                <button className=" bg-[#07393C] hover:bg-[#2C666E] text-[#F0EDEE] font-bold p-3 rounded-lg w-full">
                                                    Download Invoice
                                                </button>
                                            )}
                                        </PDFDownloadLink>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {activeTab === "Canceled" && (
                        <div className="flex flex-col gap-5 rounded-[15px] xl:grid xl:grid-cols-3 xl:w-full xl:justify-items-center xl:mt-4">
                            {dataBookingCanceled.map(
                                (item: Pemesanan, index) => (
                                    <div
                                        className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border-2 border-red-500 xl:w-[300px]"
                                        key={index}
                                    >
                                        <div className="flex flex-col">
                                            <h2 className="text-[16px] lg:text-[20px] font-bold">
                                                {item.Fasilitas.nama}
                                            </h2>
                                            <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                                {`Booking ref # : ${item.id_pemesanan}`}
                                            </h2>
                                            <h2 className="text-[12px] lg:text-[15px] font-regular ">
                                                {new Date(
                                                    item.tanggal_pemesanan
                                                ).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}{" "}
                                            </h2>
                                        </div>

                                        <div className="border-t border-gray-500 xl:hidden"></div>
                                        <div className="text-black">
                                            <h2 className="text-[16px] lg:text-[15px] font-semibold ">
                                                Status
                                            </h2>
                                            <h1 className="text-red-500 font-bold">
                                                Ditolak
                                            </h1>
                                        </div>
                                        <div className="text-black">
                                            <h2 className="text-[16px] lg:text-[15px] font-semibold ">
                                                Keterangan
                                            </h2>
                                            <h1 className="text-red-500 font-bold">
                                                {item.keterangan_tolak}
                                            </h1>
                                        </div>
                                    </div>
                                )
                            )}
                            {/* Start The Card */}
                        </div>
                    )}
                    {/* End of The div Card On Going*/}
                </div>
            </div>
            <Footer />
        </div>
    );
}
