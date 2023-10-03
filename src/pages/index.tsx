import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { BsFillPinMapFill } from "react-icons/bs";
import { MdOutlineWatchLater, MdPayment } from "react-icons/md";
import { useRouter } from "next/router";
import { Login } from "@/components/login-form";
import { Regis } from "@/components/registration-form";
import Loading from "@/components/loading";

// Services
import _serviceFasilitas from "@/services/fasilitas.service";

// Lib
import _libFasilitas from "@/lib/fasilitas";
import _libCookies from "@/lib/cookies";
import _libUsers from "@/lib/users";

// Interfaces
import FasilitasDTO from "@/interfaces/fasilitasDTO";
import CookiesDTO from "@/interfaces/cookiesDTO";
import AccountDTO from "@/interfaces/accountDTO";
import _libBooking from "@/lib/booking";
import _libKamar from "@/lib/kamar";

export default function Home() {
    const router = useRouter();
    const cookies = new _libCookies();
    const fasilitas = new _serviceFasilitas("https://api.ricogann.com");
    const libFasilitas = new _libFasilitas();
    const libUsers = new _libUsers();
    const libKamar = new _libKamar();

    const [isLogin, setIsLogin] = useState(false);
    const [namaAccount, setNama] = useState<string>("");

    const [dataFasilitas, setDataFasilitas] = useState<FasilitasDTO[][]>([]);
    const [dataInfo, setInfo] = useState<FasilitasDTO>();

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
        async function fetchData() {
            try {
                const data: FasilitasDTO[] = await fasilitas.getFasilitas();

                const splitData: FasilitasDTO[][] =
                    await libFasilitas.splitData(data);

                setDataFasilitas(splitData);

                const dataCookies: CookiesDTO = await cookies.getCookies();

                const user = await libUsers.getAccountById(
                    Number((await cookies.parseJwt(dataCookies)).id_account)
                );

                if (user.Mahasiswa.length > 0) {
                    const checkExpiredMahasiswa =
                        await libUsers.checkExpiredMahasiswa(
                            user.Mahasiswa[0].id_account
                        );

                    if (checkExpiredMahasiswa === false) {
                        await libKamar.deleteExpiredMahasiswa(
                            user.Mahasiswa[0].id_account
                        );
                    }
                }

                if (dataCookies.CERT !== undefined) {
                    setIsLogin(true);
                    setNama(
                        JSON.parse(atob(dataCookies.CERT.split(".")[1])).nama
                    );
                } else {
                    setIsLogin(false);
                }
            } catch (error) {
                console.error("error fetching data fasilitas ", error);
            }
        }

        fetchData();
    }, []);

    const handleBook = async () => {
        const getCookies = await cookies.getCookies();

        if (getCookies.CERT === undefined) {
            setOpenModal(true);
            return;
        } else if (dataInfo === undefined) {
            setLoading(true);
            router.push(`/booking/${dataFasilitas[0][0].id_fasilitas}`);
        } else {
            setLoading(true);
            router.push(`/booking/${dataInfo?.id_fasilitas}`);
        }
    };

    return (
        <div className="bg-[#D2D7DF] h-screen md:h-full font-montserrat relative overflow-hidden">
            {loading && (
                <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                    <Loading />
                </div>
            )}
            <Navbar
                isLogin={isLogin}
                nama={namaAccount}
                setModal={handleModal}
                setRegisModal={handleRegisModal}
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
                <div className="bg-white rounded-lg shadow-xl border-black border-2">
                    <Regis
                        setRegisModal={handleRegisModal}
                        changeModal={changeModal}
                    />
                </div>
            </div>
            <div className="p-10 xl:mx-24">
                <div className="carousel carousel-center md:hidden">
                    {dataFasilitas.map((data, index) => {
                        return (
                            <div
                                className="carousel-item grid grid-cols-2 gap-3 mx-5"
                                key={index}
                            >
                                {data.map((data, index) => {
                                    return (
                                        <div
                                            className=""
                                            key={index}
                                            onClick={() => setInfo(data)}
                                        >
                                            <Image
                                                src={`https://api.ricogann.com/assets/${
                                                    JSON.parse(
                                                        data && data.foto
                                                    )[0]
                                                }`}
                                                width={150}
                                                height={150}
                                                alt="asrama"
                                                className="rounded-[13px] w-[150px] h-[150px]"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Tab & Desktop */}
                <div className="hidden md:flex carousel w-full">
                    {dataFasilitas.map((data, index) => {
                        return (
                            <div
                                id={`slide${index}`}
                                className="carousel-item relative w-full h-[300px] lg:h-[400px] grid grid-cols-3 grid-row-2 gap-4 overflow-hidden rounded-xl"
                                key={index}
                            >
                                {data.map((data, index) => {
                                    return index === 0 ? (
                                        <div
                                            className="row-span-2 cursor-pointer relative flex flex-col rounded-lg"
                                            onClick={() => setInfo(data)}
                                            key={index}
                                        >
                                            <Image
                                                src={`https://api.ricogann.com/assets/${
                                                    JSON.parse(data.foto)[0]
                                                }`}
                                                alt="asrama"
                                                className="h-[250px] lg:h-[350px] rounded-t-lg"
                                                width={500}
                                                height={500}
                                            />
                                            <div className="text-black bg-gray-500 text-center p-3 w-full rounded-b-lg">
                                                <h1 className="font-medium text-[15px]">
                                                    {data.nama}
                                                </h1>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="cursor-pointer relative overflow-hidden flex flex-col-reverse rounded-lg"
                                            onClick={() => setInfo(data)}
                                            key={index}
                                        >
                                            <div className="text-black bg-gray-500 text-center p-3 w-full">
                                                <h1 className="font-medium text-[15px]">
                                                    {data.nama}
                                                </h1>
                                            </div>
                                            <Image
                                                src={`https://api.ricogann.com/assets/${
                                                    JSON.parse(data.foto)[0]
                                                }`}
                                                alt="asrama"
                                                className="h-[150px] lg:h-[200px] w-full"
                                                width={400}
                                                height={400}
                                            />
                                        </div>
                                    );
                                })}
                                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                    <a
                                        href={`#slide${index - 1}`}
                                        className={`btn btn-circle ${
                                            index === 0 ? "invisible" : ""
                                        } cursor-pointer`}
                                    >
                                        ❮
                                    </a>
                                    <a
                                        href={`#slide${index + 1}`}
                                        className={`btn btn-circle ${
                                            index === dataFasilitas.length - 1
                                                ? "invisible"
                                                : ""
                                        } cursor-pointer`}
                                    >
                                        ❯
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={`mt-5 bg-[#FFFFFF] rounded-[13px] border`}>
                    <div className="lg:flex-row">
                        {/* Content here */}
                        <div className="">
                            <div className="flex items-start justify-between p-5 md:p-8 xl:px-14 xl:py-10">
                                <div className="w-[150px] md:w-full flex flex-col gap-2">
                                    <h1 className="text-xl text-black font-bold md:text-[25px] xl:text-[35px]">
                                        {dataInfo?.nama === undefined
                                            ? dataFasilitas.length > 0
                                                ? dataFasilitas[0][0].nama
                                                : ""
                                            : dataInfo.nama}
                                    </h1>
                                    <div className="flex items-center gap-3 lg:mt-2">
                                        <div className="w-2 h-2 xl:w-2 xl:h-2 bg-black rounded-full"></div>
                                        <div className="text-black text-[10px] lg:text-[15px]">
                                            <span>Closed</span> opens soon at
                                            9:00 a.m
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-end gap-1">
                                    <button
                                        className="w-24 bg-[#F7F8FA] hover:bg-[#00FF66] text-semibold font-bold p-1 lg:p-2 text-[10px] text-black border-black border-[2px] xl:text-[17px] xl:w-32 rounded-lg"
                                        onClick={() => {
                                            setLoading(true);
                                            router.push(
                                                `/detail/${
                                                    dataInfo?.id_fasilitas ===
                                                    undefined
                                                        ? dataFasilitas.length >
                                                          0
                                                            ? dataFasilitas[0][0]
                                                                  .id_fasilitas
                                                            : ""
                                                        : dataInfo.id_fasilitas
                                                }`
                                            );
                                        }}
                                    >
                                        More Info
                                    </button>
                                    <button
                                        className="w-24 bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-1 lg:p-2 text-[10px] border-black border-[2px] xl:text-[17px] xl:w-32 rounded-lg"
                                        onClick={handleBook}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-5 md:flex-row text-[8px] md:text-[12px] xl:text-[18px] border-[#D3D3D3] border-t-[2px] p-5 md:p-8 xl:px-14 xl:py-10">
                                <div className="flex gap-3 items-start">
                                    <BsFillPinMapFill className="text-black font-bold text-lg lg:text-xl" />

                                    <div className="text-black text-[12px] xl:text-[16px]">
                                        <div className="w-[230px] xl:w-[360px]">
                                            {dataInfo?.alamat === undefined
                                                ? dataFasilitas.length > 0
                                                    ? dataFasilitas[0][0].alamat
                                                    : ""
                                                : dataInfo.alamat}
                                        </div>
                                        <a
                                            href=""
                                            className="text-blue-900 font-semibold"
                                        >
                                            Get directions
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <MdOutlineWatchLater className="text-black font-bold text-lg lg:text-xl" />
                                    <div className="flex flex-col">
                                        <h2 className="text-[12px] lg:text-[16px] text-black">
                                            {dataInfo?.buka_hari === undefined
                                                ? dataFasilitas.length > 0
                                                    ? dataFasilitas[0][0]
                                                          .buka_hari
                                                    : ""
                                                : dataInfo.buka_hari}
                                        </h2>
                                        <h2 className="text-[12px] lg:text-[16px] text-black">
                                            {dataInfo?.jam_buka === undefined
                                                ? dataFasilitas.length > 0
                                                    ? dataFasilitas[0][0]
                                                          .jam_buka
                                                    : ""
                                                : dataInfo.jam_buka}{" "}
                                            -{" "}
                                            {dataInfo?.jam_tutup === undefined
                                                ? dataFasilitas.length > 0
                                                    ? dataFasilitas[0][0]
                                                          .jam_tutup
                                                    : ""
                                                : dataInfo.jam_tutup}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <MdPayment className="text-black font-bold text-lg lg:text-xl" />
                                    <div className="flex flex-col text-[12px] lg:text-[16px] text-black">
                                        <h2 className="">Mode Of Payment</h2>
                                        <h2 className="">Virtual Account</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Of content */}
            </div>
        </div>
    );
}
