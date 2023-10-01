import { useState, useEffect, ChangeEvent } from "react";

import { AiOutlineClose } from "react-icons/ai";
import { AuthButton } from "./auth-button";
import Loading from "./loading";

import _libCampus from "@/lib/campus";
import _libAuth from "@/lib/auth";

interface Props {
    setRegisModal: () => void;
    changeModal: () => void;
}

type Fakultas = {
    id_fakultas: string;
    nama_fakultas: string;
};

type Prodi = {
    id_prodi: string;
    nama_prodi: string;
};

type TahunAjaran = {
    id_tahun_ajaran: number;
    tahun_ajaran: string;
};

const Regis: React.FC<Props> = ({ setRegisModal, changeModal }) => {
    const [role, setRole] = useState("mahasiswa");

    const libCampus = new _libCampus();
    const libAuth = new _libAuth();

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [fakultas, setFakultas] = useState<Fakultas[]>([]);
    const [prodi, setProdi] = useState<Prodi[]>([]);
    const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran[]>([]);

    //regis
    const [regisRole, setRegisRole] = useState("mahasiswa");
    const [namaRegis, setNamaRegis] = useState("");
    const [emailRegis, setEmailRegis] = useState("");
    const [passwordRegis, setPasswordRegis] = useState("");
    const [noTelpRegis, setNoTelpRegis] = useState("");
    const [buktiRegis, setBuktiRegis] = useState<File | null>(null);

    //additional data
    const [npmRegis, setNpmRegis] = useState("");
    const [nikRegis, setNikRegis] = useState("");
    const [nipRegis, setNipRegis] = useState("");
    const [fakultasRegis, setFakultasRegis] = useState("1");
    const [jurusanRegis, setJurusanRegis] = useState("1");
    const [tahunRegis, setTahunRegis] = useState("1");

    useEffect(() => {
        const fetchData = async () => {
            const fakultas = await libCampus.getFakultas();
            const jurusan = await libCampus.getProdi();
            const tahun = await libCampus.getTahunAjaran();

            setFakultas(fakultas);
            setProdi(jurusan);
            setTahunAjaran(tahun);
        };

        fetchData();
    }, []);

    const handleCampusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (event.target.name === "fakultas") {
            setFakultasRegis(event.target.value);
        } else if (event.target.name === "prodi") {
            setJurusanRegis(event.target.value);
        } else if (event.target.name === "tahun_ajaran") {
            setTahunRegis(event.target.value);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "nama") {
            setNamaRegis(e.target.value);
        } else if (e.target.name === "npm") {
            setNpmRegis(e.target.value);
        } else if (e.target.name === "password") {
            setPasswordRegis(e.target.value);
        } else if (e.target.name === "bukti") {
            if (e.target.files) {
                setBuktiRegis(e.target.files[0]);
            }
        } else if (e.target.name === "nik") {
            setNikRegis(e.target.value);
        } else if (e.target.name === "nip") {
            setNipRegis(e.target.value);
        } else if (e.target.name === "no_telp") {
            setNoTelpRegis(e.target.value);
        } else if (e.target.name === "email") {
            setEmailRegis(e.target.value);
        }
    };

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setRegisRole(event.target.value);
    };

    const handleRegis = async () => {
        if (role === "mahasiswa") {
            if (
                npmRegis === "" ||
                namaRegis === "" ||
                emailRegis === "" ||
                passwordRegis === "" ||
                noTelpRegis === "" ||
                fakultasRegis === "" ||
                jurusanRegis === "" ||
                tahunRegis === "" ||
                noTelpRegis === "" ||
                buktiRegis === null
            ) {
                setError(true);
            } else {
                setIsLoading(true);
                const data = new FormData();
                data.append("nama", namaRegis);
                data.append("npm", npmRegis);
                data.append("email", emailRegis);
                data.append("password", passwordRegis);
                data.append("id_tahun_ajaran", tahunRegis);
                data.append("id_fakultas", fakultasRegis);
                data.append("id_prodi", jurusanRegis);
                data.append("no_telp", noTelpRegis);
                data.append("bukti_identitas", buktiRegis as Blob);
                data.append("status", "0");

                const send = await libAuth.sendRegisterMahasiswa(data);

                if (send) {
                    changeModal();
                    setIsLoading(false);
                } else {
                    alert("gagal regis");
                }
            }
        } else if (role === "dosen") {
            if (
                nipRegis === "" ||
                namaRegis === "" ||
                emailRegis === "" ||
                passwordRegis === "" ||
                noTelpRegis === "" ||
                buktiRegis === null
            ) {
                setError(true);
            } else {
                setIsLoading(true);
                const data = new FormData();
                data.append("nama", namaRegis);
                data.append("NIP", nipRegis);
                data.append("email", emailRegis);
                data.append("password", passwordRegis);
                data.append("no_telp", noTelpRegis);
                data.append("bukti_identitas", buktiRegis as Blob);
                data.append("status", "0");

                const send = await libAuth.sendRegisterDosen(data);

                if (send) {
                    changeModal();
                    setIsLoading(false);
                } else {
                    alert("gagal regis");
                }
            }
        } else {
            if (
                nikRegis === "" ||
                namaRegis === "" ||
                emailRegis === "" ||
                passwordRegis === "" ||
                noTelpRegis === "" ||
                buktiRegis === null
            ) {
                setError(true);
            } else {
                setIsLoading(true);
                const data = new FormData();
                data.append("nama", namaRegis);
                data.append("NIK", nikRegis);
                data.append("email", emailRegis);
                data.append("password", passwordRegis);
                data.append("no_telp", noTelpRegis);
                data.append("bukti_identitas", buktiRegis as Blob);
                data.append("status", "0");

                const send = await libAuth.sendRegisterUmum(data);

                if (send) {
                    changeModal();
                    setIsLoading(false);
                } else {
                    alert("gagal regis");
                }
            }
        }
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                    <Loading />
                </div>
            )}
            <div className="p-9 h-[500px] overflow-auto text-black relative">
                <div className="flex justify-end" onClick={setRegisModal}>
                    <AiOutlineClose className="text-2xl cursor-pointer" />
                </div>
                <h1 className="text-[30px] font-semibold mb-5 md:mb-2 md:text-[40px] lg:text-[35px] mt-3">
                    Registrasi
                </h1>
                <div className="mt-5">
                    <h1 className="text-[17px] mb-1">Daftar Sebagai</h1>
                    <div className="flex flex-col gap-3">
                        <select
                            className="bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="dosen">Dosen</option>
                            <option value="umum">Umum</option>
                        </select>

                        <div className="">
                            <h1 className="text-[17px] mb-1">
                                {role === "mahasiswa"
                                    ? "npm"
                                    : role === "dosen"
                                    ? "nip"
                                    : "nik"}
                            </h1>
                            <input
                                name={`${
                                    role === "mahasiswa"
                                        ? "npm"
                                        : role === "dosen"
                                        ? "nip"
                                        : "nik"
                                }`}
                                type="text"
                                className={` ${
                                    error === true && role === "mahasiswa"
                                        ? npmRegis === ""
                                            ? "border-red-500"
                                            : ""
                                        : role === "dosen"
                                        ? nipRegis === ""
                                            ? "border-red-500"
                                            : ""
                                        : role === "umum"
                                        ? nikRegis === ""
                                            ? "border-red-500"
                                            : ""
                                        : ""
                                } bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]`}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="">
                            <h1 className="text-[20px] mb-1">nama</h1>
                            <input
                                name={`nama`}
                                type="text"
                                className={`${
                                    error === true && namaRegis === ""
                                        ? "border-red-500"
                                        : ""
                                } bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]`}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="">
                            <h1 className="text-[20px] mb-1">email</h1>
                            <input
                                name={`email`}
                                type="email"
                                className={`${
                                    error === true && emailRegis === ""
                                        ? "border-red-500"
                                        : ""
                                } bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]`}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="">
                            <h1 className="text-[20px] mb-1">password</h1>
                            <input
                                name={`password`}
                                type="password"
                                className={`${
                                    error === true && passwordRegis === ""
                                        ? "border-red-500"
                                        : ""
                                } bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]`}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div
                            className={`${
                                role === "mahasiswa" ? "flex" : "hidden"
                            } flex-col gap-3`}
                        >
                            <div className="">
                                <h1 className="text-[20px] mb-1">fakultas</h1>
                                <select
                                    name="fakultas"
                                    className="bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                    onChange={handleCampusChange}
                                >
                                    {fakultas.map((fakultas, index) => (
                                        <option
                                            key={index}
                                            value={fakultas.id_fakultas}
                                        >
                                            {fakultas.nama_fakultas}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="">
                                <h1 className="text-[20px] mb-1">jurusan</h1>
                                <select
                                    name="prodi"
                                    className="bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                    onChange={handleCampusChange}
                                >
                                    {prodi.map((prodi, index) => (
                                        <option
                                            key={index}
                                            value={prodi.id_prodi}
                                        >
                                            {prodi.nama_prodi}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="">
                                <h1 className="text-[20px] mb-1">
                                    tahun ajaran
                                </h1>
                                {
                                    <select
                                        name="tahun_ajaran"
                                        className="bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                        onChange={handleCampusChange}
                                    >
                                        {tahunAjaran.map(
                                            (tahunAjaran, index) => (
                                                <option
                                                    key={index}
                                                    value={
                                                        tahunAjaran.id_tahun_ajaran
                                                    }
                                                >
                                                    {tahunAjaran.tahun_ajaran}
                                                </option>
                                            )
                                        )}
                                    </select>
                                }
                            </div>
                        </div>

                        <div className="">
                            <h1 className="text-[20px] mb-1">no. telp</h1>
                            <input
                                name={`no_telp`}
                                type="text"
                                className={`${
                                    error === true && noTelpRegis === ""
                                        ? "border-red-500"
                                        : ""
                                } bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]`}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="">
                            <h1 className="text-[20px] mb-1">
                                upload kartu{" "}
                                {role === "mahasiswa"
                                    ? "mahasiswa"
                                    : role === "dosen"
                                    ? "dosen"
                                    : "identitas"}
                            </h1>
                            <input
                                name={`bukti`}
                                type="file"
                                className={`${
                                    error === true && buktiRegis === null
                                        ? "border-red-500"
                                        : ""
                                } bg-[#ffffff] border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]`}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <h1
                    className={`${
                        error === true ? "block" : "hidden"
                    } mt-5 font-bold text-red-500`}
                >
                    Data tidak boleh kosong
                </h1>
                <div className="mt-5">
                    <AuthButton
                        message="Registrasi"
                        handleLogin={handleRegis}
                    />
                </div>
                <div className="flex items-center justify-center mt-8">
                    <div className="w-[120px] h-[1px] bg-black"></div>
                    <div className="text-center mx-5">OR</div>
                    <div className="w-[120px] h-[1px] bg-black"></div>
                </div>
                <div className="text-center">
                    <h1 className="text-[20px] font-bold mt-10">
                        Sudah punya akun?{" "}
                        <span
                            className="text-[#322A7D] cursor-pointer"
                            onClick={changeModal}
                        >
                            Login
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export { Regis };
