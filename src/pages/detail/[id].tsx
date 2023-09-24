import Image from "next/image";
import { useState, useEffect } from "react";
import picture_kantin from "../../../public/images/fasilitas_kantin.jpg";
import picture_tennis from "../../../public/images/fasilitas_tennis.jpg";
import picture_giriloka from "../../../public/images/fasilitas_giriloka.jpg";
import { Navbar } from "@/components/navbar";
import { BsFillPinMapFill } from "react-icons/bs";
import { MdOutlineWatchLater, MdPayment } from "react-icons/md";
import { BiCalendar, BiBookmark } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa";
import { useRouter } from "next/router";

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
    const { id } = router.query;
    const [isLogin, setIsLogin] = useState(false);
    const [harga, setHarga] = useState<HargaDTO[]>([]);
    const [date, setDate] = useState("");
    const [pemesanan, setPemesanan] = useState<PemesananDTO[]>([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [cookies, setCookies] = useState<CookiesDTO>();
    const [data, setData] = useState<FasilitasDTO>();
    const [nama, setNama] = useState("");

    useEffect(() => {
        const init = async () => {
            const fasilitas = new _serviceFasilitas("https://api.ricogann.com");
            const data = await fasilitas.getFasilitasById(Number(id));
            const harga = await fasilitas.getHarga(Number(id));
            setData(data);
            setHarga(harga);

            const booking = new _serviceBooking("httpsL//api.ricogann.com");
            const dataBooking = await booking.getPemesanan(Number(id));
            setPemesanan(dataBooking);

            const libCookies = new _libCookies();
            const cookies: CookiesDTO = await libCookies.getCookies();

            if (cookies.CERT !== undefined) {
                setIsLogin(true);
                setCookies(cookies);
                setNama(JSON.parse(atob(cookies.CERT.split(".")[1])).nama);
            } else {
                setIsLogin(false);
            }
        };

        init();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setDate(date);
    };

    useEffect(() => {
        setIsAvailable(true);

        const datePemesanan = pemesanan.map((item) => {
            console.log("11", item.tanggal_pemesanan.split("T")[0]);
            console.log("12", date);
            if (
                item.tanggal_pemesanan
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-") === date.split("-").reverse().join("-")
            ) {
                setIsAvailable(false);
            }
        });

        const dataBooking = pemesanan.filter((item) => {
            return (
                item.tanggal_pemesanan
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-") === date
            );
        });

        setPemesanan(dataBooking);
    }, [date]);

    return (
        <div className="bg-[#D2D7DF] font-montserrat">
            <Navbar isLogin={isLogin} nama={nama} />
            <div className="p-10 xl:mx-24">
                <div className="carousel carousel-center md:hidden">
                    <div className="carousel-item grid grid-cols-2 gap-3 mx-5">
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                    </div>
                    <div className="carousel-item grid grid-cols-2 gap-2">
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                    </div>
                </div>

                {/* Tab & Desktop */}
                <div className="hidden md:flex carousel w-full">
                    <div
                        id="slide1"
                        className="carousel-item relative w-full grid grid-cols-3 grid-row-2 gap-4"
                    >
                        <div className="row-span-2">
                            <Image
                                src={picture_kantin}
                                alt="asrama"
                                className="h-full"
                            />
                        </div>
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide4" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide2" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                    <div id="slide2" className="carousel-item relative w-full">
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={100}
                            height={100}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide1" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide3" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                    <div id="slide3" className="carousel-item relative w-full">
                        <Image
                            src={picture_giriloka}
                            alt="asrama"
                            width={100}
                            height={100}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide2" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide4" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                    <div id="slide4" className="carousel-item relative w-full">
                        <Image
                            src={picture_tennis}
                            alt="asrama"
                            width={100}
                            height={100}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide3" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide1" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                </div>

                <div className={`mt-5 bg-[#FFFFFF] rounded-[13px] border`}>
                    <div className="p-5 lg:p-14">
                        <div className="">
                            <h1 className="font-bold md:text-[25px] xl:text-[35px] text-black  xl:text-center">
                                {data?.nama}
                            </h1>

                            <div className="flex flex-col gap-2 mt-6 xl:flex-row xl:justify-evenly">
                                <div className="flex flex-col">
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
                                    <div className="flex items-center gap-8 mt-3 xl:items-start">
                                        <FaDollarSign className="text-black font-bold text-3xl" />

                                        <div className="flex flex-col">
                                            {harga.map((item, index) => (
                                                <h2
                                                    className="text-[10px] md:text-[12px] xl:text-[17px] text-black"
                                                    key={index}
                                                >
                                                    {`Rp${item.harga
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            "."
                                                        )} - ${item.nama}`}
                                                </h2>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
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
                                        <BiCalendar className="text-black font-bold text-3xl" />
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                Cek Ketersediaan Fasilitas
                                            </h2>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="date"
                                                    className="border rounded-md px-2 py-1 w-[100px] text-[10px] xl:text-[15px] h-[20px] xl:h-[30px] xl:w-[150px] focus:outline-none focus:border-blue-500"
                                                    onChange={handleDate}
                                                />
                                            </div>
                                            <div className=" gap-2 mt-2">
                                                {isAvailable ? (
                                                    <div className=" flex text-black items-center gap-3">
                                                        <div className="">
                                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        </div>
                                                        <h1>Available</h1>
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
                                                            {pemesanan.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="text-black flex gap-3"
                                                                    >
                                                                        <h1 className="text-[15px] xl:text-[17px]">
                                                                            {index +
                                                                                1}
                                                                            .
                                                                        </h1>
                                                                        <div className="text-[15px] xl:text-[17px]">
                                                                            {
                                                                                item.jam_checkin
                                                                            }
                                                                        </div>
                                                                        <div className="text-[15px] xl:text-[17px]">
                                                                            to
                                                                        </div>
                                                                        <div className="text-[15px] xl:text-[17px]">
                                                                            {
                                                                                item.jam_checkout
                                                                            }
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
                                <div className="">
                                    <div className="flex items-center gap-8 mt-3 justify-center">
                                        <BiBookmark className="text-black font-bold text-3xl" />

                                        <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black w-[180px] md:w-1/2">
                                            {data?.deskripsi}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5">
                                <button
                                    className="w-24 bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold py-2 px-2 text-[12px] xl:text-[17px] xl:w-32 rounded-lg mx-2"
                                    onClick={() =>
                                        router.push(`/booking/${id}`)
                                    }
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Of content */}
            </div>
        </div>
    );
}
