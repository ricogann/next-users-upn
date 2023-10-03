import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "white",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    image: {
        width: 200, // Set the width of the image
        height: 100, // Set the height of the image
    },
});

const PDFDocument: React.FC = () => {
    const logo_bpu = "https://api.ricogann.com/assets/logo-bpu.png";
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image src={logo_bpu} style={styles.image} />

                <View style={styles.section}>
                    <Text>
                        Hello, this is a PDF generated with React and
                        TypeScript!
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default PDFDocument;
