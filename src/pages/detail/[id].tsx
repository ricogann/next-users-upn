import Image from "next/image";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { BsFillPinMapFill } from "react-icons/bs";
import { MdOutlineWatchLater, MdPayment } from "react-icons/md";
import { BiCalendar, BiBookmark } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import Footer from "@/components/footer";

import { Login } from "@/components/login-form";
import { Regis } from "@/components/registration-form";

// Services
import _serviceFasilitas from "@/services/fasilitas.service";
import _serviceBooking from "@/services/booking.service";

// Lib
import _libCookies from "@/lib/cookies";

// Interfaces
import CookiesDTO from "@/interfaces/cookiesDTO";
import HargaDTO from "@/interfaces/hargaDTO";
import FasilitasDTO from "@/interfaces/fasilitasDTO";
import PemesananDTO from "@/interfaces/pemesananDTO";

export default function DetailFasilitas() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [harga, setHarga] = useState<HargaDTO[]>([]);
    const [date, setDate] = useState("");
    const [pemesanan, setPemesanan] = useState<PemesananDTO[]>([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [cookies, setCookies] = useState<CookiesDTO>();
    const [data, setData] = useState<FasilitasDTO>();
    const [nama, setNama] = useState("");
    const [id, setId] = useState("");

    const [dataBooked, setDataBooked] = useState<PemesananDTO[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [openRegisModal, setOpenRegisModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleModal = () => {
        setOpenModal(!openModal);
    };
    const handleRegisModal = () => {
        setOpenRegisModal(!openRegisModal);
    };
    const changeModal = () => {
        setOpenModal(!openModal);
        setOpenRegisModal(!openRegisModal);
    };

    useEffect(() => {
        if (router.isReady) {
            setId(router.query.id as string);
        }
    }, [router.isReady]);

    const libCookies = new _libCookies();
    const booking = new _serviceBooking();
    const fasilitas = new _serviceFasilitas();

    useEffect(() => {
        const init = async (id: number) => {
            const data = await fasilitas.getFasilitasById(Number(id));
            const harga = await fasilitas.getHarga(Number(id));
            const cookies: CookiesDTO = await libCookies.getCookies();

            setData(data);
            setHarga(harga);

            const dataBooking = await booking.getPemesanan(cookies.CERT);
            setPemesanan(dataBooking);

            if (cookies.CERT !== undefined) {
                setIsLogin(true);
                setCookies(cookies);
                setNama(JSON.parse(atob(cookies.CERT.split(".")[1])).nama);
            } else {
                setIsLogin(false);
            }
        };

        if (id !== "") {
            init(Number(id));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setDate(date);
    };

    const checkAvailability = async () => {
        let dataBooked: PemesananDTO[] = [];
        setLoading(true);
        pemesanan.map((item) => {
            if (item.durasi > 1) {
                const dbDate = new Date(item.tanggal_pemesanan.split("T")[0]);
                for (let i = 0; i < item.durasi; i++) {
                    const temp = dbDate.setDate(dbDate.getDate() + 1);
                    const dayAfter = new Date(temp).toISOString().split("T")[0];

                    if (dayAfter === date) {
                        dataBooked.push(item);
                    }
                }
            }
            if (
                item.tanggal_pemesanan.split("T")[0] === date &&
                item.id_fasilitas === Number(id)
            ) {
                dataBooked.push(item);
            }
        });

        if (
            dataBooked.length > 0 &&
            dataBooked.filter((item) => item.status !== "Dibatalkan").length > 0
        ) {
            setIsAvailable(false);
            setLoading(false);
        } else {
            setIsAvailable(true);
            setLoading(false);
        }

        setDataBooked(dataBooked);
    };

    const handleBook = async () => {
        const cookies: CookiesDTO = await libCookies.getCookies();

        if (cookies.CERT === undefined) {
            setOpenModal(true);
            return;
        } else {
            setLoading(true);
            router.push(`/booking/${id}`);
        }
    };

    const isLoading = () => {
        setLoading(!loading);
    };

    return (
        <div className="bg-[#2C666E] font-montserrat relative">
            {loading && (
                <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                    <Loading />
                </div>
            )}
            <Navbar
                isLogin={isLogin}
                nama={nama}
                setModal={handleModal}
                setRegisModal={handleRegisModal}
                isLoading={isLoading}
            />
            <div
                className={`${
                    openModal ? "flex" : "hidden"
                } fixed top-0 left-0 w-full h-full items-center justify-center z-50 backdrop-blur-sm`}
            >
                <div className="bg-white p-4 rounded-lg shadow-xl border-black border-2">
                    <Login setModal={handleModal} changeModal={changeModal} />
                </div>
            </div>
            <div
                className={`${
                    openRegisModal ? "flex" : "hidden"
                } fixed top-0 left-0 w-full h-full items-center justify-center z-50 backdrop-blur-sm`}
            >
                <div className="bg-white p-4 rounded-lg shadow-xl border-black border-2">
                    <Regis
                        setRegisModal={handleRegisModal}
                        changeModal={changeModal}
                    />
                </div>
            </div>
            <div className="p-10 xl:mx-24">
                <div className="carousel carousel-center md:hidden">
                    <div className="carousel-item grid grid-cols-2 gap-3 mx-5">
                        {data &&
                            JSON.parse(data.foto).map(
                                (item: string, index: number) => (
                                    <Image
                                        src={`https://api.ricogann.com/assets/${item}`}
                                        alt="asrama"
                                        key={index}
                                        width={150}
                                        height={150}
                                        className="rounded-xl w-[150px] h-[150px]"
                                    />
                                )
                            )}
                    </div>
                </div>

                {/* Tab & Desktop */}
                <div className="hidden md:flex carousel w-full">
                    {data &&
                        JSON.parse(data.foto).map(
                            (item: string, index: number) => (
                                <div
                                    id={`slide${index + 1}`}
                                    className="carousel-item relative w-full"
                                    key={index}
                                >
                                    <Image
                                        src={`https://api.ricogann.com/assets/${item}`}
                                        alt="asrama"
                                        key={index}
                                        width={500}
                                        height={500}
                                        className="rounded-xl w-full h-[500px]"
                                    />
                                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                        <a
                                            href={
                                                index === 0
                                                    ? `#slide${
                                                          JSON.parse(data.foto)
                                                              .length
                                                      }`
                                                    : `#slide${index}`
                                            }
                                            className="btn btn-circle"
                                        >
                                            ❮
                                        </a>
                                        <a
                                            href={`#slide${index + 2}`}
                                            className="btn btn-circle"
                                        >
                                            ❯
                                        </a>
                                    </div>
                                </div>
                            )
                        )}
                </div>

                <div className={`mt-5 bg-[#FFFFFF] rounded-[13px] border`}>
                    <div className="p-5 lg:p-0">
                        <div className="flex items-start md:items-center justify-between lg:px-14 lg:py-10">
                            <div className="">
                                <h1 className="font-bold md:text-[25px] xl:text-[40px] text-black">
                                    {data?.nama}
                                </h1>
                                <div className="flex items-center gap-8 mt-3 justify-start">
                                    <BiBookmark className="text-black font-bold text-3xl" />

                                    <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black w-[100px] md:w-1/2">
                                        {data?.deskripsi}
                                    </h2>
                                </div>
                            </div>
                            <button
                                className="w-24 bg-[#07393C] hover:bg-[#2C666E] text-white font-bold py-2 px-2 text-[12px] xl:text-[17px] xl:w-32 rounded-lg"
                                onClick={handleBook}
                            >
                                Book Now
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 xl:block xl:border-t-black xl:border-[2px] lg:px-14 lg:py-4 lg:mt-0">
                            <div className="flex flex-col xl:gap-5">
                                <div className="flex flex-col md:flex-row items-start md:gap-[90px]">
                                    <div className="flex gap-8 mt-3">
                                        <BsFillPinMapFill className="text-black font-bold text-3xl" />
                                        <div className="flex flex-col">
                                            <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black flex flex-col">
                                                <div className="w-[200px] xl:w-[300px]">
                                                    {data?.alamat}
                                                </div>
                                                <a href="">Get directions</a>
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 mt-3">
                                        <MdOutlineWatchLater className="text-black font-bold text-3xl" />
                                        <div className="flex flex-col">
                                            <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                {data?.buka_hari}
                                            </h2>
                                            <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                {`${data?.jam_buka} am - ${data?.jam_tutup} pm`}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 mt-3">
                                        <MdPayment className="text-black font-bold text-3xl" />
                                        <div className="flex flex-col">
                                            <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                Mode Of Payment
                                            </h2>
                                            <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                Virtual Account
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-10">
                                    <div className="flex items-center gap-8 mt-3 xl:items-start">
                                        <FaDollarSign className="text-black font-bold text-3xl" />

                                        <select className="p-2 bg-[#ffffff] text-[10px] md:text-[12px] xl:text-[17px] border-black border-[2px] rounded-xl text-black w-[150px] md:w-full">
                                            {harga &&
                                                harga.map((item, index) => (
                                                    <option
                                                        className=""
                                                        key={index}
                                                    >
                                                        {`Rp${item.harga
                                                            .toString()
                                                            .replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                "."
                                                            )} - ${item.nama}`}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-8">
                                            <BiCalendar className="text-black font-bold text-3xl" />
                                            <div className="flex flex-col gap-2">
                                                <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                    Cek Ketersediaan Fasilitas
                                                </h2>
                                                <div className="flex flex-col md:flex-row items-start gap-5">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="date"
                                                            className="border rounded-md px-2 py-1 w-[100px] text-[10px] xl:text-[15px] h-[20px] xl:h-[30px] xl:w-[150px] focus:outline-none focus:border-blue-500"
                                                            onChange={
                                                                handleDate
                                                            }
                                                        />
                                                        <button
                                                            className="bg-[#07393C] hover:bg-[#2C666E] text-white font-bold p-[4px] text-[12px] xl:text-[15px] xl:w-24 rounded-lg"
                                                            onClick={
                                                                checkAvailability
                                                            }
                                                        >
                                                            Check
                                                        </button>
                                                    </div>
                                                    <div className="">
                                                        {isAvailable ? (
                                                            <div className="flex text-black items-center gap-3">
                                                                <div className="">
                                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                                </div>
                                                                <h1>
                                                                    Available
                                                                </h1>
                                                            </div>
                                                        ) : (
                                                            <div className="">
                                                                <div className="text-black flex items-center gap-3">
                                                                    <div className="w-2 h-2 xl:w-3 xl:h-3 bg-red-500 rounded-full"></div>
                                                                    <h1 className="text-[15px] xl:text-[17px]">
                                                                        Booked
                                                                    </h1>
                                                                </div>
                                                                <div className="">
                                                                    {dataBooked.map(
                                                                        (
                                                                            item,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="text-[#0A090C] flex gap-3"
                                                                            >
                                                                                <div
                                                                                    className={`text-[15px] xl:text-[17px] ${
                                                                                        item.status ===
                                                                                        "Dibatalkan"
                                                                                            ? "hidden"
                                                                                            : "flex gap-2"
                                                                                    }`}
                                                                                >
                                                                                    <h1>
                                                                                        Oleh
                                                                                    </h1>
                                                                                    {item
                                                                                        .Account
                                                                                        .Mahasiswa[0]
                                                                                        ? item
                                                                                              .Account
                                                                                              .Mahasiswa[0]
                                                                                              .nama
                                                                                        : item
                                                                                              .Account
                                                                                              .Umum[0]
                                                                                        ? item
                                                                                              .Account
                                                                                              .Umum[0]
                                                                                              .nama
                                                                                        : item
                                                                                              .Account
                                                                                              .UKM[0]
                                                                                        ? item
                                                                                              .Account
                                                                                              .UKM[0]
                                                                                              .nama_ukm
                                                                                        : item
                                                                                              .Account
                                                                                              .Organisasi[0]
                                                                                              .nama_organisasi}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
