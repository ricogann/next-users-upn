import Image from "next/image";
import logo_bpu from "../../public/images/logo-bpu.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { RxHamburgerMenu } from "react-icons/rx";
import { BsPersonCircle } from "react-icons/bs";
import _misc from "@/services/misc.service";

interface misc {
    logo_instansi: number;
    no_hp: string;
    email: number;
    instagram: string;
    laman_web: string;
}

export default function Footer() {
    const router = useRouter();
    const misc = new _misc();
    const [dataMisc, setDataMisc] = useState<misc>();

    useEffect(() => {
        async function fetchData() {
            try {
                const dataMisc = await misc.getDataMisc();

                setDataMisc(dataMisc.data);
            } catch (error) {
                console.error("error fetching data fasilitas ", error);
            }
        }
        fetchData();
    }, []);

    return (
        <nav className="bg-[#F0EDEE] shadow-xl">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-5">
                    <h1 className="">{dataMisc?.laman_web} </h1>
                    <h1 className="">{dataMisc?.instagram}</h1>
                </div>
                <div className="flex flex-col gap-5">
                    <h1 className="">{dataMisc?.no_hp} </h1>
                    <h1 className="">{dataMisc?.email}</h1>
                </div>
            </div>
        </nav>
    );
}
