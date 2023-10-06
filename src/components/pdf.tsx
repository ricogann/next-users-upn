import React from "react";
import { useState, useEffect } from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import InvoiceTable from "./table-pdf";
import _misc from "@/services/misc.service";

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

const styles = StyleSheet.create({
    page: {
        backgroundColor: "white",
        padding: 30,
    },
    header: {
        fontSize: 12,
        marginBottom: 15,
        marginLeft: 22,
        textAlign: "center",
        display: "flex", // Set to flex container
        flexDirection: "row", // Display children in a row
        alignItems: "center", // Vertically align children in the center
        justifyContent: "center", // Horizontally align children in the center
    },
    image: {
        width: 130, // Set the width of the image
        height: 75, // Set the height of the image
    },
    upn: {
        fontSize: 18,
        fontWeight: "bold",
    },
    jawatimur: {
        fontSize: 18,
        fontWeight: "normal",
    },
    bpu: {
        fontSize: 21,
        fontWeight: "bold",
        marginTop: 10,
    },
    line: {
        width: "100%",
        backgroundColor: "black",
        height: 2,
        marginTop: 10,
    },
    center: {
        width: "70%",
        textAlign: "center",
    },
    info: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 14,
        gap: 9,
    },
    invoiceInfo: {
        marginTop: 20,
        fontSize: 14,
    },
    invoiceInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    status: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 20,
        fontWeight: "bold",
        color: "green", // Change the color to green for paid status
    },
    signatureContainer: {
        flexDirection: "column",
        alignItems: "flex-end", // Align children of the container to the right
        justifyContent: "flex-end", // Align to the right
        marginTop: 40,
    },
    signature: {
        width: 150,
        height: 50,
        border: "1px solid black",
    },
    signatureText: {
        marginTop: 5,
        textAlign: "center",
    },
});

interface PDFDocumentProps {
    nama: string;
    no_invoice: string;
    nama_fasilitas: string;
    harga: string;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({
    nama,
    no_invoice,
    nama_fasilitas,
    harga,
}) => {
    // const logo_bpu = "https://api.ricogann.com/assets/logo-bpu.png";
    // const ttd_rico = "https://api.ricogann.com/assets/ttd-rico.png";

    const invoiceData = {
        invoiceNumber: "INV-2023-001",
        date: "October 15, 2023",
        customer: {
            name: "John Doe",
            address: "123 Main Street, City, Country",
        },
        items: [
            { name: "Item 1", quantity: 2, price: 20 },
            { name: "Item 2", quantity: 1, price: 30 },
            { name: "Item 3", quantity: 3, price: 15 },
        ],
    };

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
    });

    console.log(dataMisc);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={"https://api.ricogann.com/assets/"+dataMisc?.logo_instansi} style={styles.image} />

                    <View style={styles.center}>
                        <Text style={styles.upn}>
                            Universitas Pembangunan Nasional
                        </Text>
                        <Text style={styles.jawatimur}>Veteran Jawa Timur</Text>
                        <Text style={styles.bpu}>{dataMisc?.nama_instansi}</Text>
                    </View>
                </View>

                <View style={styles.info}>
                    <Text>Email : {dataMisc?.email}</Text>
                    <Text>Mobile : {dataMisc?.no_hp}</Text>
                    <Text>Laman : {dataMisc?.laman_web}</Text>
                </View>

                <Text style={styles.line}></Text>

                <View style={styles.invoiceInfo}>
                    <View style={styles.invoiceInfoRow}>
                        <Text>Date: {invoiceData.date}</Text>
                        <Text>Invoice #: {no_invoice}</Text>
                    </View>
                    <View style={styles.invoiceInfoRow}>
                        <Text>Bill To:</Text>
                    </View>
                    <View style={styles.invoiceInfoRow}>
                        <Text>{nama}</Text>
                    </View>
                </View>

                <InvoiceTable nama_fasilitas={nama_fasilitas} harga={harga} />
                <Text style={styles.status}>Status: Paid Off</Text>

                <View style={styles.signatureContainer}>
                    <Image
                        src={"https://api.ricogann.com/assets/"+dataMisc?.tanda_tangan} // Replace with the URL of your signature image
                        style={styles.signature}
                    />
                    <Text style={styles.signatureText}>
                        {dataMisc?.nama_pic}
                    </Text>
                    <Text style={styles.signatureText}>
                        NIP. {dataMisc?.nip_pic}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default PDFDocument;
