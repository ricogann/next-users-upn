import { useState, useEffect, ChangeEvent } from "react";
import { AuthButton } from "./auth-button";
import { useRouter } from "next/router";

type AuthFormProps = {
    role?: string;
    auth: string;
};

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

interface Cookies {
    CERT: string;
}

const AuthForm: React.FC<AuthFormProps> = (props) => {
    const router = useRouter();

    //error handler
    const [hasError, setHasError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [allError, setAllError] = useState(false);
    const [errorMessages, setErrorMessages] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);

    const [npm, setNpm] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
            setAllError(false);
            setHasError(false);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
            setPasswordError(false);
            setAllError(false);
        } else if (e.target.name === "npm") {
            setNpm(e.target.value);
            setAllError(false);
            setHasError(false);
        }
    };

    const handleSubmit = async () => {
        if (props.role === "mahasiswa") {
            if (npm === "" && password === "") {
                setErrorMessages("NPM dan password tidak boleh kosong");
                setAllError(true);
            } else if (npm === "") {
                setErrorMessages("NPM tidak boleh kosong");
                setHasError(true);
            } else if (password === "") {
                setErrorMessages("Password tidak boleh kosong");
                setPasswordError(true);
            }

            if (npm && password) {
                const token = await sendLoginMahasiswa({
                    npm: npm,
                    password: password,
                });
                if (!token) {
                    setErrorMessages("NPM atau password salah");
                    setAllError(true);
                }
                if (parseJwt(token).status === true) {
                    setCookie("CERT", token, 1);
                    router.push(`/`);
                } else {
                    alert("Akun anda belum di verifikasi");
                }
            }
        } else if (email === "" && password === "") {
            setErrorMessages("Email dan password tidak boleh kosong");
            setAllError(true);
        } else if (email === "") {
            setErrorMessages("Email tidak boleh kosong");
            setHasError(true);
        } else if (password === "") {
            setErrorMessages("Password tidak boleh kosong");
            setPasswordError(true);
        }

        if (email && password) {
            const token = await sendLogin({ email, password });
            if (!token) {
                setErrorMessages("Email atau password salah");
                setAllError(true);
            }
            if (parseJwt(token).status === true) {
                setCookie("CERT", token, 1);
                router.push(`/`);
            } else {
                alert("Akun anda belum di verifikasi");
            }
        }
    };

    const parseJwt = (token: string) => {
        console.log(token);
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return null;
        }
    };

    //cookies
    async function setCookie(name: string, value: string, days: number) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000); // Calculate the expiration time
        const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        document.cookie = cookieString;
    }

    //auth api
    async function sendLogin(data: Object) {
        try {
            const res = await fetch(
                `https://api.ricogann.com/api/auth/login${
                    props.role === "dosen" ? `/dosen` : `/umum`
                }`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const resData = await res.json();
            return resData.data.token;
        } catch (error) {
            console.log(error);
        }
    }

    async function sendLoginMahasiswa(data: Object) {
        try {
            const res = await fetch(
                "https://api.ricogann.com/api/auth/login/mahasiswa",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const resData = await res.json();
            if (resData.status === false && resData.error) {
                throw new Error(resData.error);
            }
            return resData.data.token;
        } catch (error) {
            console.log(error);
        }
    }

    async function sendRegisterMahasiswa(data: FormData) {
        try {
            const res = await fetch(
                "https://api.ricogann.com/api/auth/register/mahasiswa",
                {
                    method: "POST",
                    body: data,
                }
            );

            const resData = await res.json();
            return resData;
        } catch (error) {
            console.log(error);
        }
    }

    async function sendRegisterUmum(data: FormData) {
        try {
            const res = await fetch(
                "https://api.ricogann.com/api/auth/register/umum",
                {
                    method: "POST",
                    body: data,
                }
            );

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function sendRegisterDosen(data: FormData) {
        try {
            const res = await fetch(
                "https://api.ricogann.com/api/auth/register/dosen",
                {
                    method: "POST",
                    body: data,
                }
            );

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function getFakultas() {
        try {
            const res = await fetch(
                "https://api.ricogann.com/api/campus/fakultas"
            );

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function getProdi() {
        try {
            const res = await fetch(
                "https://api.ricogann.com/api/campus/prodi"
            );

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
        }
    }

    async function getTahunAjaran() {
        try {
            const res = await fetch(
                "https://api.ricogann.com/api/campus/tahun-ajaran"
            );

            const resData = await res.json();
            return resData.data;
        } catch (error) {
            console.log(error);
        }
    }

    const [fakultas, setFakultas] = useState<Fakultas[]>([]);
    const [prodi, setProdi] = useState<Prodi[]>([]);
    const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran[]>([]);

    useEffect(() => {
        const getFakultasData = async () => {
            const fakultasData = await getFakultas();
            setFakultas(fakultasData);
        };

        const getProdiData = async () => {
            const prodiData = await getProdi();
            setProdi(prodiData);
        };

        const getTahunAjaranData = async () => {
            const tahunAjaranData = await getTahunAjaran();
            setTahunAjaran(tahunAjaranData);
        };

        getTahunAjaranData();
        getFakultasData();
        getProdiData();
    }, []);

    //regis
    const [regisRole, setRegisRole] = useState("mahasiswa");
    const [namaRegis, setNamaRegis] = useState("");
    const [emailRegis, setEmailRegis] = useState("");
    const [npmRegis, setNpmRegis] = useState("");
    const [passwordRegis, setPasswordRegis] = useState("");
    const [fakultasRegis, setFakultasRegis] = useState("1");
    const [jurusanRegis, setJurusanRegis] = useState("1");
    const [tahunRegis, setTahunRegis] = useState("1");
    const [buktiRegis, setBuktiRegis] = useState<File | null>(null);

    //additional data
    const [nikRegis, setNikRegis] = useState("");
    const [nipRegis, setNipRegis] = useState("");
    const [noTelpRegis, setNoTelpRegis] = useState("");

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setRegisRole(event.target.value);
    };

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

    const handleRegisMahasiswa = async () => {
        if (
            npmRegis === "" ||
            namaRegis === "" ||
            passwordRegis === "" ||
            fakultasRegis === "" ||
            jurusanRegis === "" ||
            noTelpRegis === "" ||
            tahunRegis === "" ||
            !buktiRegis
        ) {
            setErrorMessages("Data tidak boleh kosong");
            setAllError(true);
        } else {
            const data = new FormData();
            data.append("nama", namaRegis);
            data.append("npm", npmRegis);
            data.append("email", emailRegis);
            data.append("password", passwordRegis);
            data.append("id_tahun_ajaran", tahunRegis);
            data.append("id_fakultas", fakultasRegis);
            data.append("id_prodi", jurusanRegis);
            data.append("no_telp", noTelpRegis);
            data.append("bukti_identitas", buktiRegis);
            data.append("status", "0");

            const send = await sendRegisterMahasiswa(data);

            if (send.status === true) {
                router.push("/auth/login");
            } else {
                setErrorMessages(send.error);
                setAllError(true);
            }
        }
    };

    const handleRegisUmum = async () => {
        if (regisRole === "dosen") {
            if (
                nipRegis === "" ||
                namaRegis === "" ||
                emailRegis === "" ||
                passwordRegis === "" ||
                noTelpRegis === "" ||
                !buktiRegis
            ) {
                setErrorMessages("Data tidak boleh kosong");
                setAllError(true);
            } else {
                const data = new FormData();
                data.append("NIP", nipRegis);
                data.append("nama", namaRegis);
                data.append("email", emailRegis);
                data.append("password", passwordRegis);
                data.append("no_telp", noTelpRegis);
                data.append("bukti_identitas", buktiRegis);
                data.append("role", regisRole);
                data.append("status_account", "0");

                const send = await sendRegisterUmum(data);

                router.push("/auth/login");
            }
        } else if (regisRole === "umum") {
            if (
                nikRegis === "" ||
                namaRegis === "" ||
                emailRegis === "" ||
                passwordRegis === "" ||
                noTelpRegis === "" ||
                !buktiRegis
            ) {
                setErrorMessages("Data tidak boleh kosong");
                setAllError(true);
            } else {
                const data = new FormData();
                data.append("NIK", nikRegis);
                data.append("nama", namaRegis);
                data.append("email", emailRegis);
                data.append("password", passwordRegis);
                data.append("no_telp", noTelpRegis);
                data.append("bukti_identitas", buktiRegis);
                data.append("status", "0");

                const send = await sendRegisterUmum(data);

                router.push("/auth/login");
            }
        }
    };

    const handleRegisDosen = async () => {
        if (
            nipRegis === "" ||
            namaRegis === "" ||
            emailRegis === "" ||
            passwordRegis === "" ||
            noTelpRegis === "" ||
            !buktiRegis
        ) {
            setErrorMessages("Data tidak boleh kosong");
            setAllError(true);
        } else {
            const data = new FormData();
            data.append("NIP", nipRegis);
            data.append("nama", namaRegis);
            data.append("email", emailRegis);
            data.append("password", passwordRegis);
            data.append("no_telp", noTelpRegis);
            data.append("bukti_identitas", buktiRegis);
            data.append("status", "0");
            console.log(data);
            const send = await sendRegisterDosen(data);
            console.log(send);

            router.push("/auth/login");
        }
    };

    const handleRegis = () => {
        if (regisRole === "mahasiswa") {
            handleRegisMahasiswa();
        } else if (regisRole === "dosen") {
            handleRegisDosen();
        } else if (regisRole === "umum") {
            handleRegisUmum();
        }
    };
    return (
        <div className="flex flex-col gap-3 ">
            <div className="">
                {props.auth === "login" ? (
                    <div className="">
                        {props.role === "mahasiswa" ? (
                            <div className="md:flex md:gap-3 md:flex-col">
                                <div className="">
                                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                                        npm
                                    </h1>
                                    <input
                                        name={`npm`}
                                        type="text"
                                        className={`border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 ${
                                            hasError ? "border-red-500" : ""
                                        } ${allError ? "border-red-500" : ""}`}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="">
                                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                                        password
                                    </h1>
                                    <input
                                        name={`password`}
                                        type="password"
                                        className={`border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 lg:p-2 ${
                                            passwordError
                                                ? "border-red-500"
                                                : ""
                                        } ${allError ? "border-red-500" : ""}`}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="md:flex md:gap-3 md:flex-col">
                                <div className="">
                                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                                        email
                                    </h1>
                                    <input
                                        name={`email`}
                                        type="text"
                                        className={`border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] md:w-[500px] md:p-3 xl:p-2 ${
                                            hasError ? "border-red-500" : ""
                                        } ${allError ? "border-red-500" : ""}`}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="">
                                    <h1 className="text-[20px] mb-1 md:text-[30px] xl:text-[25px]">
                                        password
                                    </h1>
                                    <input
                                        name={`password`}
                                        type="password"
                                        className={`border-[2px] border-black p-2 drop-shadow-lg rounded-[13px] w-[300px] md:w-[500px] md:p-3 xl:p-2 ${
                                            passwordError
                                                ? "border-red-500"
                                                : ""
                                        } ${allError ? "border-red-500" : ""}`}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="">
                            <h1 className="text-[20px] mb-1">Daftar Sebagai</h1>
                            <select
                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                onChange={handleSelectChange}
                            >
                                <option value="mahasiswa">Mahasiswa</option>
                                <option value="dosen">Dosen</option>
                                <option value="umum">Umum</option>
                            </select>
                        </div>
                        {regisRole === "dosen" ? (
                            <div className="">
                                <div className="">
                                    <h1 className="text-[20px] mb-1">nip</h1>
                                    <input
                                        name={`nip`}
                                        type="text"
                                        className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="">
                                    <h1 className="text-[20px] mb-1">nama</h1>
                                    <input
                                        name={`nama`}
                                        type="text"
                                        className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="">
                                    <h1 className="text-[20px] mb-1">email</h1>
                                    <input
                                        name={`email`}
                                        type="email"
                                        className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="">
                                    <h1 className="text-[20px] mb-1">
                                        password
                                    </h1>
                                    <input
                                        name={`password`}
                                        type="password"
                                        className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="">
                                    <h1 className="text-[20px] mb-1">
                                        no. telp
                                    </h1>
                                    <input
                                        name={`no_telp`}
                                        type="text"
                                        className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="">
                                    <h1 className="text-[20px] mb-1">
                                        upload kartu nip
                                    </h1>
                                    <input
                                        name={`bukti`}
                                        type="file"
                                        className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] bg-[#ffffff]"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="">
                                {regisRole === "umum" ? (
                                    <div className="">
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                nik
                                            </h1>
                                            <input
                                                name={`nik`}
                                                type="text"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                nama
                                            </h1>
                                            <input
                                                name={`nama`}
                                                type="text"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                email
                                            </h1>
                                            <input
                                                name={`email`}
                                                type="email"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                password
                                            </h1>
                                            <input
                                                name={`password`}
                                                type="password"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                no. telp
                                            </h1>
                                            <input
                                                name={`no_telp`}
                                                type="text"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                upload ktp
                                            </h1>
                                            <input
                                                name={`bukti`}
                                                type="file"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] bg-[#ffffff]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="">
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                npm
                                            </h1>
                                            <input
                                                name={`npm`}
                                                type="text"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                nama
                                            </h1>
                                            <input
                                                name={`nama`}
                                                type="text"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                email
                                            </h1>
                                            <input
                                                name={`email`}
                                                type="text"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                password
                                            </h1>
                                            <input
                                                name={`password`}
                                                type="password"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                fakultas
                                            </h1>
                                            <select
                                                name="fakultas"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleCampusChange}
                                            >
                                                {fakultas.map((item, index) => (
                                                    <option
                                                        key={index}
                                                        value={item.id_fakultas}
                                                    >
                                                        {item.nama_fakultas}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                jurusan
                                            </h1>
                                            <select
                                                name="prodi"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleCampusChange}
                                            >
                                                {prodi.map((item, index) => (
                                                    <option
                                                        key={index}
                                                        value={item.id_prodi}
                                                    >
                                                        {item.nama_prodi}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                no. telp
                                            </h1>
                                            <input
                                                name={`no_telp`}
                                                type="text"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                tahun ajaran
                                            </h1>
                                            {
                                                <select
                                                    name={`tahun_ajaran`}
                                                    className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px]"
                                                    onChange={
                                                        handleCampusChange
                                                    }
                                                >
                                                    {tahunAjaran.map(
                                                        (item, index) => (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    item.id_tahun_ajaran
                                                                }
                                                            >
                                                                {
                                                                    item.tahun_ajaran
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            }
                                        </div>
                                        <div className="">
                                            <h1 className="text-[20px] mb-1">
                                                bukti registrasi
                                            </h1>
                                            <input
                                                name={`bukti`}
                                                type="file"
                                                className="border-[2px] border-black p-2 drop-shadow-xl rounded-[13px] w-[300px] bg-[#ffffff]"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {hasError && (
                <div className="text-red-500">
                    <h1 className="text-[20px]">{errorMessages}</h1>
                </div>
            )}
            {passwordError && (
                <div className="text-red-500">
                    <h1 className="text-[20px]">{errorMessages}</h1>
                </div>
            )}
            {allError && (
                <div className="text-red-500">
                    <h1 className="text-[17px] font-bold">{errorMessages}</h1>
                </div>
            )}
            <div
                className={`${hasError ? "  " : "mt-5"} ${
                    props.auth === "login" ? "block" : "hidden"
                }`}
                onClick={handleSubmit}
            >
                <AuthButton message={props.auth} />
            </div>
            <div
                className={`${hasError ? "  " : "mt-5"} ${
                    props.auth === "registrasi" ? "block" : "hidden"
                } `}
                onClick={handleRegis}
            >
                <AuthButton message={props.auth} />
            </div>
        </div>
    );
};

export { AuthForm };
