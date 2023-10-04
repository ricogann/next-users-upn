// InvoiceTable.js
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    table: {
        width: "100%",
        marginTop: 20,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "gray", // Change border color
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#333", // Change header background color
        color: "white", // Change header text color
        fontWeight: "bold", // Make header text bold
    },
    row: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2", // Change row background color
        borderBottomWidth: 1,
        borderColor: "gray", // Change row border color
    },
    cell: {
        flex: 1,
        padding: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "gray", // Change cell border color
    },
    cellHeader: {
        flex: 1,
        padding: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "gray", // Change cell border color
        fontWeight: "bold", // Make header cell text bold
        color: "white", // Change header cell text color
    },
});

interface InvoiceTableProps {
    nama_fasilitas: string;
    harga: string;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
    nama_fasilitas,
    harga,
}) => {
    return (
        <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <Text style={styles.cellHeader}>Item</Text>
                <Text style={styles.cellHeader}>Price</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.cell}>{nama_fasilitas}</Text>
                <Text style={styles.cell}>
                    {`Rp${harga
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                </Text>
            </View>
        </View>
    );
};

export default InvoiceTable;
