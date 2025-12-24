import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import Logo from '../../../../assets/PNGs/brand_256.png';

// Use system fonts to avoid font loading issues
Font.register({
    family: 'Helvetica',
    fonts: []
});

const styles = StyleSheet.create({

    page: {
        fontFamily: 'Helvetica',
        padding: 20,
        backgroundColor: '#ffffff',
        color: '#1a202c'
    },




    borderBox: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
    },

    val: {
        marginVertical: 4,
        fontSize: 12,
        color: '#374151',
        overflow: 'visible',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },

    fild: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1f2937'
    },

    subField: {
        color: '#1f2937',
        fontWeight: 'bold'
    },




    brndheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2%',
        minHeight: 90,
        maxHeight: 100,
    },

    brndprf: {
        justifyContent: 'center',
        width: '20%',
        marginRight: '1%',
    },

    brndheadercol: {
        paddingHorizontal: 20,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 6,
    },

    brndnm: {
        width: '79%',
        justifyContent: 'flex-end',
    },

    brndlogo: {
        height: 72,
        width: 72,
        borderRadius: 50,
        objectFit: 'cover',
    },

    brndnmtxt: {
        fontSize: 22,
        color: '#1e40af',
        fontWeight: 'bold',
    },




    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'start',
        marginBottom: '2%',
    },

    brnddet: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 'auto',
        textAlign: 'left',
        width: '60%',
        marginRight: '1%',
        marginBottom: '1%',
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },

    invcdet: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 'auto',
        marginBottom: '1%',
        textAlign: 'right',
        width: '39%',
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },

    brnddet2: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 'auto',
        textAlign: 'left',
        marginRight: '1%',
        marginBottom: '0%',
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },

    brndnum: {
        width: '26%',
        marginRight: 0,
    },

    brndown: {
        width: '36%',
    },

    brndlnk: {
        width: '36%',
    },

    brndaddr: {
        marginBottom: 4,
    },



    custdet: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '2%',
    },

    custdetcol: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        overflow: 'visible',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        height: 'auto',
        marginBottom: '1%',
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },

    custdetcol1: {
        width: '60%',
        marginRight: '1%'
    },

    custdetcol2: {
        width: '39%',
    },





    table: {
        display: 'table',
        width: '100%',
        marginVertical: '2%',
        overflow: 'hidden',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
    },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e7eb'
    },

    tableCell: {
        textAlign: 'center',
        padding: 8,
        borderRightWidth: 0.5,
        borderRightColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        overflow: 'visible',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },

    tableHeaderCell: {
        textAlign: 'center',
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        backgroundColor: '#f3f4f6',
        color: '#1f2937',
        fontSize: 12,
        overflow: 'visible',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },

    tableBodyCell: {
        textAlign: 'center',
        fontSize: 11,
        color: '#374151',
        overflow: 'visible',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },

    tblitmno: {
        width: '7%',
    },

    tbldeschead: {
        width: '22%',
        textAlign: 'center'
    },

    tbldesc: {
        width: '22%',
        textAlign: 'left'
    },

    msr: {
        width: '10%',
    },

    qnt: {
        color: '#212f3d',
        width: '10%',
    },

    prc: {
        color: '#212f3d',
        width: '14%',
    },

    dcntrow: {
        width: '11%',
    },

    txrow: {
        width: '12%',
    },

    ttl: {
        color: '#212f3d',
        width: '14%',
    },




    // aftertblsection: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'start',
    //     marginBottom: '2%'
    // },

    // sumrytbl: {
    //     height:'auto',
    //     margin: 0,
    //     marginLeft: 'auto',
    //     width: '45%',
    //     backgroundColor: '#4169e1',
    // },

    // smryacntrowhead: {
    //     fontFamily: 'LexendBold',
    //     color: '#212f3d',
    //     width: '40%',
    //     textAlign: 'left',
    //     backgroundColor: '#fafafa',
    // },
    // smryrowhead: {
    //     color: '#212f3d',
    //     width: '40%',
    //     textAlign: 'left',
    //     backgroundColor: '#fdfdfd',
    // },

    // smryacntrowval: {
    //     color: '#212f3d',
    //     width: '60%',
    //     textAlign: 'right',
    //     backgroundColor: '#fafafa',
    // },

    // smryrowval: {
    //     width: '60%',
    //     textAlign: 'right',
    //     backgroundColor: '#fdfdfd',
    // },




    // pymntsec: {
    //     width: '45%',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'flex-start',
    //     alignItems: 'center'
    // },

    // pymntdet: {
    //     paddingVertical: 6,
    //     paddingHorizontal: 10,
    //     height: 'auto',
    //     textAlign: 'left',
    //     marginRight: '0%',
    //     marginBottom: '2%',
    //     backgroundColor: '#fcfcfc',
    // },

    // pymntmthdac: {
    //     width: '100%',
    // },

    // pymntidnum: {
    //     width: '100%',
    // },


    aftertblsection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2%',
    },
    
    sumrytbl: {
        flexGrow: 1,
        flexBasis: '45%',
        height: 'auto',
        margin: 0,
        marginLeft: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        overflow: 'hidden',
    },
    
    smryacntrowhead: {
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: '#1f2937',
        width: '40%',
        textAlign: 'left',
        backgroundColor: '#f3f4f6',
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    smryrowhead: {
        color: '#374151',
        width: '40%',
        textAlign: 'left',
        backgroundColor: '#ffffff',
        paddingVertical: 4,
        paddingHorizontal: 6,
    },

    smryacntrowval: {
        color: '#1f2937',
        width: '60%',
        textAlign: 'right',
        backgroundColor: '#f3f4f6',
        paddingVertical: 4,
        paddingHorizontal: 6,
    },

    smryrowval: {
        color: '#374151',
        width: '60%',
        textAlign: 'right',
        backgroundColor: '#ffffff',
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    
    pymntsec: {
        marginRight:'1%',
        flexGrow: 1,
        flexBasis: '45%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    
    pymntdet: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 'auto',
        textAlign: 'left',
        marginRight: '0%',
        marginBottom: '2%',
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },
    
    pymntmthdac: {
        width: '100%',
    },
    
    pymntidnum: {
        width: '100%',
    },



    trmsntssec: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: '1%',
    },

    ntstrmshead: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1f2937',
    },

    ntstrmsval: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.4,
    },




    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        paddingVertical: 8,
    },

    ftrcon: {
        marginHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    ftrlft: {
        fontSize: 9,
        color: '#6b7280'
    },

    ftrrght: {
        fontSize: 9,
        color: '#1e40af',
        fontWeight: 'bold',
    }

});

const PDFInvoice = ({ invoiceData, fieldsVisible, profileImage }) => {
    try {
        // Break content into pages if needed
        const shouldBreakPage = (contentHeight) => {
            return contentHeight > 700; // Adjust based on A4 page height
        };

        const calculateSubtotal = () => {
            return invoiceData.items.reduce((sum, item) => {
                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 0;

                const baseTotal = itemQuantity * itemPrice;

                const discountAmount = fieldsVisible.discountrow && item.discountrow
                    ? (baseTotal * (Number(item.discountrow) / 100))
                    : 0;

                const taxAmount = fieldsVisible.taxrow && item.taxrow
                    ? ((baseTotal - discountAmount) * (Number(item.taxrow) / 100))
                    : 0;

                const finalTotal = baseTotal - discountAmount + taxAmount;

                return sum + finalTotal;
            }, 0).toFixed(2);
        };

        const subtotal = Number(calculateSubtotal());

        // Calculate tax amount (if applicable)
        const shipCharge = Number(invoiceData.shipCharge) || 0;
        const discountAmount = (fieldsVisible.discount && invoiceData.discount)
            ? (subtotal * (invoiceData.discount / 100))
            : 0;

        const cutoff = Number(invoiceData.cutoff) || 0;
        const amountAfterChargeAndDiscount = subtotal + shipCharge - discountAmount;

        // Calculate tax amount for grand total
        const taxAmount = (fieldsVisible.tax && invoiceData.tax)
            ? (amountAfterChargeAndDiscount * (invoiceData.tax / 100))
            : 0;

        // Calculate grand total
        const grandTotal = (amountAfterChargeAndDiscount + taxAmount - cutoff).toFixed(2);

        const numberToWords = (num) => {
            const belowTwenty = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
            const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            const thousands = ["", "Thousand", "Million", "Billion"];

            if (num < 0) return "Negative " + numberToWords(-num);
            if (num === 0) return belowTwenty[0];

            let words = '';
            let i = 0;

            while (num > 0) {
                if (num % 1000 !== 0) {
                    words = `${convertHundreds(num % 1000)} ${thousands[i]} ${words}`;
                }
                num = Math.floor(num / 1000);
                i++;
            }

            return words.trim();
        };

        const convertHundreds = (num) => {
            const belowTwenty = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
            const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

            let words = '';

            if (num > 99) {
                words += `${belowTwenty[Math.floor(num / 100)]} Hundred `;
                num %= 100;
            }
            if (num > 19) {
                words += `${tens[Math.floor(num / 10)]} `;
                num %= 10;
            }
            if (num > 0) {
                words += `${belowTwenty[num]} `;
            }

            return words.trim();
        };

        const finalamntword = numberToWords(Number(grandTotal));


        return (
            <Document>
                <Page size="A4" style={styles.page} wrap>

                    <View style={styles.brndheader}>

                        <View style={[styles.brndheadercol, styles.brndprf, styles.borderBox]}>
                            <View>
                                <Image src={profileImage || Logo} style={styles.brndlogo} />
                            </View>
                        </View>

                        <View style={[styles.brndheadercol, styles.brndnm, styles.borderBox]}>
                            <Text style={styles.brndnmtxt}>{invoiceData.company.name}</Text>
                        </View>

                    </View>

                    <View style={styles.header}>

                        <View style={[styles.brnddet, styles.borderBox]}>

                            <Text style={[styles.val, styles.brndaddr]}>{invoiceData.company.address}</Text>

                            <Text style={styles.val}>
                                <Text style={styles.fild}>Email : </Text>
                                {invoiceData.company.email}
                            </Text>

                            <Text style={[styles.val]}>
                                <Text style={styles.fild}>Phone : </Text>
                                {invoiceData.company.phone}
                            </Text>

                        </View>

                        <View style={[styles.invcdet, styles.borderBox]}>

                            <Text style={styles.val}>
                                <Text style={styles.fild}>Invoice No : </Text>
                                {invoiceData.invoiceNumber}
                            </Text>

                            <Text style={styles.val}>
                                <Text style={styles.fild}>Date : </Text>
                                {invoiceData.date}
                            </Text>

                        </View>

                        {fieldsVisible.companyownnm && (

                            <View style={[styles.brnddet2, styles.borderBox, styles.brndown]}>

                                <Text style={styles.fild}>Owner : </Text>
                                <Text style={styles.val}>{invoiceData.company.companyownnm}</Text>

                            </View>

                        )}

                        {fieldsVisible.companyweblink && (

                            <View style={[styles.brnddet2, styles.borderBox, styles.brndlnk]}>

                                <Text style={styles.fild}>Website : </Text>
                                <Text style={styles.val}>{invoiceData.company.companyweblink}</Text>

                            </View>

                        )}

                        {fieldsVisible.companyidnum && (

                            <View style={[styles.brnddet2, styles.borderBox, styles.brndnum]}>

                                <Text style={styles.val}>
                                    <Text style={styles.fild}>Tax ID : </Text>
                                    {invoiceData.company.companyidnum}
                                </Text>

                            </View>

                        )}

                    </View>

                    <View style={styles.custdet}>

                        <View style={[styles.custdetcol, styles.borderBox, styles.custdetcol1]}>
                            <Text style={styles.fild}>Bill to : </Text>
                            <Text style={styles.val}>{invoiceData.customer.name}</Text>
                            {fieldsVisible.customerAddress && (
                                <>

                                    <Text style={styles.fild}>Address : </Text>
                                    <Text style={styles.val}>{invoiceData.customer.address}</Text>
                                </>
                            )}

                        </View>

                        <View style={[styles.custdetcol, styles.borderBox, styles.custdetcol2]}>

                            <Text style={styles.fild}>Email : </Text>
                            <Text style={styles.val}>{invoiceData.customer.email}</Text>

                            {fieldsVisible.customerTelephone && (
                                <>
                                    <Text style={styles.fild}>Phone : </Text>
                                    <Text style={styles.val}>{invoiceData.customer.phone}</Text>
                                </>
                            )}

                            {fieldsVisible.customerIdnum && (
                                <>
                                    <Text style={styles.fild}>Customer ID : </Text>
                                    <Text style={styles.val}>{invoiceData.customer.idnum}</Text>
                                </>
                            )}

                        </View>


                        {fieldsVisible.shippedFrom && (

                            <View style={[styles.custdetcol, styles.borderBox, styles.custdetcol1]}>
                                <Text style={styles.fild}>Shipped From : </Text>
                                <Text style={styles.val}>{invoiceData.shipFrm}</Text>
                            </View>

                        )}

                        {fieldsVisible.shippingTo && (

                            <View style={[styles.custdetcol, styles.borderBox, styles.custdetcol2]}>
                                <Text style={styles.fild}>Shipping To : </Text>
                                <Text style={styles.val}>{invoiceData.shipTo}</Text>
                            </View>

                        )}


                    </View>


                    <View style={styles.table}>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.tblitmno]}>No</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.tbldeschead]}>Description</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.msr]}>Measures</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.qnt]}>Quantity</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.prc]}>Price</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.dcntrow]}>Discount</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.txrow]}>Tax</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.ttl]}>Total</Text>
                        </View>

                        {invoiceData.items.map((item, index) => {

                            const itemPrice = Number(item.price) || 0;
                            const itemQuantity = Number(item.quantity) || 0;

                            // Calculate base total
                            const baseTotal = itemQuantity * itemPrice;

                            // Calculate discount amount
                            const discountAmount = fieldsVisible.discountrow && item.discountrow
                                ? (baseTotal * (Number(item.discountrow) / 100))
                                : 0;

                            // Calculate tax amount
                            const taxAmount = fieldsVisible.taxrow && item.taxrow
                                ? ((baseTotal - discountAmount) * (Number(item.taxrow) / 100))
                                : 0;

                            // Calculate final total
                            const itemTotal = (baseTotal - discountAmount + taxAmount).toFixed(2);

                            // Format discount and tax for display
                            const itemDiscount = fieldsVisible.discountrow ? (discountAmount).toFixed(2) : '0.00';
                            const itemTax = fieldsVisible.taxrow ? (taxAmount).toFixed(2) : '0.00';

                            return (

                                <View style={styles.tableRow} key={index}>

                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.tblitmno]}>{index + 1}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.tbldesc]}>{item.description}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.msr]}>{item.measurements}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.qnt]}>{itemQuantity}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.prc]}>{itemPrice.toFixed(2)}</Text>

                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.dcntrow]}>{itemDiscount}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.txrow]}>{itemTax}</Text>

                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.ttl]}>{itemTotal}</Text>

                                </View>

                            );
                        })}

                    </View>

                    <View style={styles.aftertblsection}>

                        <View style={styles.pymntsec}>

                            {(fieldsVisible.pymntmthd || fieldsVisible.pymntDetails) && (
                                <>

                                    <View style={[styles.pymntdet, styles.borderBox, styles.pymntmthdac]}>

                                        <Text style={styles.fild}>Payment Method : </Text>
                                        <Text style={styles.val}>{invoiceData.pymntmthd}</Text>

                                        {fieldsVisible.pymntAcdetails && (
                                            <>
                                                <Text style={styles.fild}>Account Details : </Text>
                                                <Text style={styles.val}>{invoiceData.pymntAcdetails}</Text>
                                            </>
                                        )}

                                    </View>

                                    {(fieldsVisible.pymntid || fieldsVisible.pymntNumber) && (
                                        <View style={[styles.pymntdet, styles.borderBox, styles.pymntidnum]}>

                                            <Text style={styles.fild}>Payment Id : </Text>
                                            <Text style={styles.val}>{invoiceData.pymntid}</Text>

                                            {fieldsVisible.pymntNumber && (
                                                <>

                                                    <Text style={styles.fild}>Payment Number : </Text>
                                                    <Text style={styles.val}>{invoiceData.pymntNumber}</Text>

                                                </>
                                            )}

                                        </View>
                                    )}

                                </>
                            )}

                        </View>

                        <View style={[styles.table, styles.sumrytbl]}>

                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowhead]}>Subtotal</Text>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowval]}>
                                    {subtotal.toFixed(2)}
                                </Text>
                            </View>

                            {fieldsVisible.shipCharge && (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowhead]}>Shipping Charge</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowval]}>
                                        {shipCharge.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            {fieldsVisible.discount && (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowhead]}>Discount</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowval]}>
                                        {discountAmount.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            {fieldsVisible.tax && (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowhead]}>Taxable Amount</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowval]}>
                                        {amountAfterChargeAndDiscount.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            {fieldsVisible.tax && (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowhead]}>Tax</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowval]}>
                                        {taxAmount.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            {fieldsVisible.cutoff && (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowhead]}>Cutoff</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryrowval]}>
                                        {cutoff.toFixed(2)}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowhead]}>Final Amount</Text>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowval]}>
                                    {grandTotal}
                                </Text>
                            </View>

                            {fieldsVisible.grndinword && (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowhead]}>( In word )</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.smryacntrowval]}>
                                        {finalamntword}
                                    </Text>
                                </View>
                            )}


                        </View>

                    </View>

                    <View style={styles.trmsntssec}>
                        {fieldsVisible.notes && (
                            <View>

                                <Text style={[styles.fild, styles.ntstrmshead]}>Notes : </Text>
                                <Text style={[styles.val, styles.ntstrmsval]}>{invoiceData.notes}</Text>

                            </View>
                        )}

                        {fieldsVisible.termscon && (
                            <View>

                                <Text style={[styles.fild, styles.ntstrmshead]}>Terms & Condition : </Text>
                                <Text style={[styles.val, styles.ntstrmsval]}>{invoiceData.trmscon}</Text>

                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.ftrcon}>
                            <Text style={styles.ftrlft}>Payment due upon receipt. Thank you for your business!</Text>
                            <Text style={styles.ftrrght}>Generated by Quick Invoice</Text>
                        </View>
                    </View>

                </Page>
            </Document>
        );
    } catch (error) {
        console.error("Error rendering PDF:", error);
        return null;
    }
};

export default PDFInvoice;