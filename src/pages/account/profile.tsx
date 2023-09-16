import { Navbar } from "@/components/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { FaLocationDot } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";

import Image from "next/image";

import picture_giriloka from "../../../public/images/fasilitas_giriloka.jpg";

interface Cookies {
    CERT: string;
}

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
}

interface RemainingTime {
    tanggal_pemesanan: string;
    remainingTime: string;
}

export default function Profile() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);

    const [activeTab, setActiveTab] = useState("OnProcces");

    const toggleTab = (tab: string) => {
        setActiveTab(tab);
    };

    //start auth check
    useEffect(() => {
        const cookiesGet = document.cookie.split(";").reduce((res, c) => {
            const [key, val] = c.trim().split("=");
            try {
                return Object.assign(res, { [key]: JSON.parse(val) });
            } catch (e) {
                return Object.assign(res, { [key]: val });
            }
        }, {});

        const cookies = cookiesGet as Cookies;
        if (cookies.CERT === undefined) {
            setIsLogin(false);
            router.push("/auth/login");
        } else {
            setAccount(cookiesGet as Cookies);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [idAccount, setIdAccount] = useState<number>(0);
    const [namaAccount, setNamaAccount] = useState<string>("");
    const [noTelpAccount, setNoTelpAccount] = useState<string>("");

    const setAccount = (cookies: Cookies) => {
        setIdAccount(parseJwt(cookies).id_account);
        setNamaAccount(parseJwt(cookies).nama);
        setNoTelpAccount(parseJwt(cookies).no_telp);
    };

    const parseJwt = (token: Cookies) => {
        try {
            return JSON.parse(atob(token.CERT.split(".")[1]));
        } catch (e) {
            return null;
        }
    };
    //end auth check

    //start get data booking user
    const [dataBookingOnProcess, setDataBookingOnProcess] = useState<
        Pemesanan[]
    >([]);
    const [dataBookingOnGoing, setDataBookingOnGoing] = useState<Pemesanan[]>(
        []
    );
    const [dataBookingFinished, setDataBookingFinished] = useState([]);
    const [remainingTime, setRemainingTime] = useState<RemainingTime[]>([]);
    async function getDataBookingByIdUser(idAccount: number) {
        try {
            const res = await fetch(
                `http://localhost:5000/api/booking/user/${idAccount}`
            );
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData(idAccount: number) {
            const data = await getDataBookingByIdUser(idAccount);

            if (data.data.length > 0) {
                const dataOnProcess = data.data.filter(
                    (item: Pemesanan) => item.status === "Menunggu Pembayaran"
                );

                const dataOnGoing = data.data.filter(
                    (item: Pemesanan) => item.status === "Menunggu Konfirmasi"
                );

                const dataFinished = data.data.filter(
                    (item: Pemesanan) => item.status === "Dikonfirmasi"
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
                setDataBookingFinished(dataFinished);
            }
        }

        fetchData(idAccount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idAccount]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime.length > 0) {
                const updatedRemaining = countdown(remainingTime);
                setRemainingTime(updatedRemaining);
            }
        }, 1000);

        return () => {
            clearInterval(interval); // Clear the interval on unmount
        };
    }, [remainingTime]);

    function countdown(tanggalPemesanan: RemainingTime[]) {
        const updatedRemainingTime = tanggalPemesanan.map((item) => {
            const targetDateTime =
                new Date(item.tanggal_pemesanan).getTime() +
                24 * 60 * 60 * 1000;

            const currentTime = new Date().getTime();

            const difference = targetDateTime - currentTime;

            if (difference <= 0) {
                return {
                    tanggal_pemesanan: item.tanggal_pemesanan,
                    remainingTime: "Waktu Habis",
                };
            } else if (difference > 0) {
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                return {
                    tanggal_pemesanan: item.tanggal_pemesanan,
                    remainingTime: `${hours}:${minutes}:${
                        seconds < 10 ? `0${seconds}` : seconds
                    }`,
                };
            }
        });

        return updatedRemainingTime as RemainingTime[];
    }

    return (
        <div className="flex flex-col bg-[#F7F8FA] ">
            <Navbar isLogin={isLogin} />

            {/* Start Of Card */}
            <h1 className="ml-8 mt-4 font-semibold xl:block xl:text-[36px]">
                Profile Anda
            </h1>
            <div className=" bg-[#FFFFFF] flex m-8 mt-4 flex-col gap-3 p-8 rounded-[15px] shadow-lg xl:flex-row ">
                <div className="m-4 gap-2 flex flex-col xl:flex-grow">
                    <div className="">
                        <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4]">
                            Nama
                        </h2>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                            {namaAccount}
                        </h2>
                    </div>
                    <div className="">
                        <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4]">
                            No. Telpon
                        </h2>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                            {noTelpAccount}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-lg mx-8 p-6 rounded-xl">
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
                                On Going
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
                    </div>
                </div>

                {/* Start Of div Card On Proccess*/}
                {activeTab === "OnProcces" && (
                    <div className="flex flex-col xl:flex-row gap-3 p-3">
                        <div className="flex flex-col gap-5 rounded-[15px] xl:m-4">
                            {dataBookingOnProcess.map((item: any, index) => (
                                <div
                                    className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border border-[#FFA101]  xl:w-[300px]"
                                    key={index}
                                >
                                    <div className="flex flex-col">
                                        <Image
                                            src={picture_giriloka}
                                            alt="foto"
                                            className="rounded-xl"
                                        />
                                        <h2 className="text-[16px] lg:text-[12px] font-bold my-3 ">
                                            {item.Fasilitas.nama}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[12px] font-regulat ">
                                            {`Booking ref # : ${item.id_pemesanan}`}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[12px] font-regulat ">
                                            {new Date(
                                                item.tanggal_pemesanan
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}{" "}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[12px] font-regulat ">
                                            {`Rp${item.total_harga
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    "."
                                                )}`}
                                        </h2>
                                    </div>

                                    <div className="border-t border-gray-500 xl:hidden"></div>
                                    <div className="text-center ">
                                        <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                                            Selesaikan Pembayaran Dalam
                                        </h2>
                                        <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#FFA101]">
                                            {remainingTime[index].remainingTime}
                                        </h2>
                                        <h2 className="text-[16px] lg:text-[12px] font-semibold mt-5">
                                            Batas akhir pembayaran <br />
                                            Sabtu, 02 September 2023 <br />
                                            12:59
                                        </h2>
                                        <h2 className="text-[16px] lg:text-[12px] font-semibold mt-6">
                                            Kode BNI VA
                                        </h2>
                                        <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#FFA101]">
                                            1693547942887
                                        </h2>
                                    </div>
                                    <h2 className="text-[16px] lg:text-[12px] font-bold xl:hidden">
                                        Upload Bukti Pembayaran
                                    </h2>

                                    <input
                                        type="file"
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                    />

                                    <button className=" bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-3 rounded-lg xl:hidden">
                                        Submit
                                    </button>
                                </div>
                            ))}
                            {/* Start The Card */}
                        </div>
                        {/* <div className="hidden xl:flex flex-col gap-5 bg-[#FFFFFF] w-full p-10 rounded-[15px] mt-4 mb-4">
                            <h1 className="font-semibold text-[36px] text-black">
                                Sun 16 July 2023 at 5:00pm
                            </h1>
                            <div className="rounded-[12px] bg-[#FFA101] w-[108px] text-center text-[#FFFFFF]">
                                On Process
                            </div>
                            <div className="flex flex-row gap-4">
                                <Image
                                    src={picture_giriloka}
                                    alt="foto"
                                    className="rounded-xl w-[250px] h-[250px]"
                                />
                                <div className="flex flex-col mt-3">
                                    <h1 className="font-medium text-[35px] text-black">
                                        Giri Loka
                                    </h1>
                                    <h1 className="font-regular text-[20px] text-black">
                                        Booking ref # : 65742695
                                    </h1>
                                    <h1 className="font-regular text-[20px] text-black">
                                        Rp1.000.000
                                    </h1>
                                </div>
                                <div className="flex flex-col justify-center items-center gap-3">
                                    <div className="bg-[#F7F8FA] p-5 rounded-[12px]">
                                        <FaLocationDot className="w-[60px] h-[50px]" />
                                    </div>
                                    <h1>Location</h1>
                                </div>
                                <div className="flex flex-col justify-center items-center gap-3">
                                    <div className="bg-[#F7F8FA] p-5 rounded-[12px]">
                                        <GiCancel className="w-[60px] h-[50px]" />
                                    </div>
                                    <h1>Cancel</h1>
                                </div>
                            </div>
                            <div className="border-b w-full border-gray-500"></div>
                            <h2 className="text-[16px] lg:text-[12px] font-bold ">
                                Upload Bukti Pembayaran
                            </h2>
                            <form className="flex">
                                <div className="shrink-0"></div>
                                <label className="block">
                                    <span className="sr-only">
                                        Choose profile photo
                                    </span>
                                    <input
                                        type="file"
                                        className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
                                    />
                                </label>
                            </form>

                            <button className=" bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-3 rounded-lg ">
                                Submit
                            </button>
                        </div> */}
                    </div>
                )}

                {activeTab === "On Going" && (
                    <div className="flex flex-col xl:flex-row gap-3 p-3">
                        <div className="flex flex-col gap-5 rounded-[15px] xl:m-4">
                            {
                                dataBookingOnGoing.map(
                                    (item: Pemesanan, index) => (
                                        <div
                                            className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border border-[#FFA101]  xl:w-[300px]"
                                            key={index}
                                        >
                                            <div className="flex flex-col">
                                                <Image
                                                    src={picture_giriloka}
                                                    alt="foto"
                                                    className="rounded-xl"
                                                />
                                                <h2 className="text-[16px] lg:text-[12px] font-bold my-3 ">
                                                    {item.Fasilitas.nama}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[12px] font-regulat ">
                                                    {`Booking ref # : ${item.id_pemesanan}`}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[12px] font-regulat ">
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
                                                <h2 className="text-[12px] lg:text-[12px] font-regulat ">
                                                    {`Rp${item.total_harga
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            "."
                                                        )}`}
                                                </h2>
                                            </div>

                                            <div className="border-t border-gray-500 xl:hidden"></div>
                                            <div className="text-black">
                                                <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                                                    Status
                                                </h2>
                                                <h1 className="text-[#FFA101]">
                                                    Menunggu Persetujuan
                                                </h1>
                                            </div>
                                        </div>
                                    )
                                ) /* Start The Card */
                            }
                        </div>
                        <div className="hidden xl:flex flex-col gap-5 bg-[#FFFFFF] w-full p-10 rounded-[15px] mt-4 mb-4">
                            <h1 className="font-semibold text-[36px]">
                                Sun 16 July 2023 at 5:00pm
                            </h1>
                            <div className="rounded-[12px] bg-[#2EC114] w-[108px] text-center text-[#FFFFFF]">
                                Sukses
                            </div>
                            <div className="flex flex-row gap-4">
                                <Image src={picture_giriloka} alt="foto" />
                                <div className="flex flex-col gap-3 w-full">
                                    <h1 className="font-bold text-[24px]">
                                        Giri Loka
                                    </h1>
                                    <h1 className="font-semibold text-[16px]">
                                        Booking ref # : 65742695
                                    </h1>
                                    <h1 className="font-semibold text-[16px]">
                                        Rp1.000.000
                                    </h1>
                                </div>
                                <div className="flex flex-col justify-center items-center gap-3">
                                    <div className="bg-[#F7F8FA] p-5 rounded-[12px]">
                                        <FaLocationDot className="w-[60px] h-[50px]" />
                                    </div>
                                    <h1>Location</h1>
                                </div>
                            </div>
                            <div className="border-b w-full border-gray-500"></div>

                            <button className=" bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-3 rounded-lg ">
                                Print Invoice
                            </button>
                        </div>
                    </div>
                )}
                {/* End of The div Card On Going*/}

                {/* Start Of div Card On Going*/}
                {activeTab === "Finished" && (
                    <div className="flex flex-col xl:flex-row gap-3 p-3">
                        <div className="flex flex-col gap-5 rounded-[15px]">
                            {dataBookingFinished.map(
                                (item: Pemesanan, index) => (
                                    <div
                                        className=" bg-[#FFFFFF] flex flex-col w-full p-5 gap-4 rounded-[15px] shadow-lg border border-[#2EC114]  xl:w-[300px]"
                                        key={index}
                                    >
                                        <div className="flex flex-col  w-full gap-4">
                                            <Image
                                                src={picture_giriloka}
                                                alt="foto"
                                            />
                                            <div className="flex flex-col">
                                                <h2 className="text-[16px] lg:text-[12px] font-bold ">
                                                    {item.Fasilitas.nama}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[12px] font-regulat ">
                                                    Booking ref # :{" "}
                                                    {item.id_pemesanan}
                                                </h2>
                                                <h2 className="text-[12px] lg:text-[12px] font-regulat ">
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
                                                <h2 className="text-[12px] lg:text-[12px] font-regulat ">
                                                    {`Rp${item.total_harga
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            "."
                                                        )}`}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-500 xl:hidden"></div>
                                        <button className=" bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-3 rounded-lg xl:hidden">
                                            Print Invoice
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="hidden xl:flex flex-col gap-5 bg-[#FFFFFF] w-full p-10 rounded-[15px] mt-4 mb-4">
                            <h1 className="font-semibold text-[36px]">
                                Sun 16 July 2023 at 5:00pm
                            </h1>
                            <div className="rounded-[12px] bg-[#2EC114] w-[108px] text-center text-[#FFFFFF]">
                                Sukses
                            </div>
                            <div className="flex flex-row gap-4">
                                <Image src={picture_giriloka} alt="foto" />
                                <div className="flex flex-col gap-3 w-full">
                                    <h1 className="font-bold text-[24px]">
                                        Giri Loka
                                    </h1>
                                    <h1 className="font-semibold text-[16px]">
                                        Booking ref # : 65742695
                                    </h1>
                                    <h1 className="font-semibold text-[16px]">
                                        Rp1.000.000
                                    </h1>
                                </div>
                                <div className="flex flex-col justify-center items-center gap-3">
                                    <div className="bg-[#F7F8FA] p-5 rounded-[12px]">
                                        <FaLocationDot className="w-[60px] h-[50px]" />
                                    </div>
                                    <h1>Location</h1>
                                </div>
                            </div>
                            <div className="border-b w-full border-gray-500"></div>
                            <div className="text-black">
                                <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                                    Status
                                </h2>
                                <h1 className="text-[#FFA101]">
                                    Menunggu Persetujuan
                                </h1>
                            </div>

                            <button className=" bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-3 rounded-lg ">
                                Print Invoice
                            </button>
                        </div>
                    </div>
                )}
                {/* End of The div Card On Going*/}
            </div>
        </div>
    );
}
