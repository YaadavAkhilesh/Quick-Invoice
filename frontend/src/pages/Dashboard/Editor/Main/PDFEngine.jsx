import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import LexendRegular from '../../../../assets/Fonts/Lexend-Regular.ttf';
import LexendBold from '../../../../assets/Fonts/Lexend-Bold.ttf';
import Logo from '../../../../assets/PNGs/brand_256.png';

Font.register({
    family: 'Lexend',
    src: LexendRegular,
});

Font.register({
    family: 'LexendBold',
    src: LexendBold,
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Lexend',
        padding: 28,
        backgroundColor: '#fefefe',
        color: '#212f3d'
    },
    brndheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: 28
    },
    brnddet: {
        textAlign: 'left',
        width: '60%'
    },
    invcdet: {
        textAlign: 'right',
        width: '30%'
    },
    brndprf: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    brndlogo: {
        height: 68,
        width: 68,
        marginBottom: 10
    },
    title: {
        fontSize: 22,
        color: '#4169e1',
        marginBottom: 10
    },
    val: {
        marginVertical: 2,
        fontSize: 13,
        color: '#4F5B5E',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    vaklbrk: {
        marginBottom: 8
    },
    fild: {
        fontSize: 13,
        color: '#212f3d'
    },
    custdet: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    custnm: {
        width: '50%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    custml: {
        width: '40%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    table: {
        display: 'table',
        marginBottom: 15,
        width: '100%',
        marginVertical: 3,
        overflow: 'hidden',
        borderStyle: 'solid',
        borderLeftWidth: 0.8,
        borderBottomWidth: 0.8,
        borderColor: '#e6e6e6'
    },
    tableRow: {
        flexDirection: 'row',
        borderTop: 0.8,
        borderColor: '#e6e6e6'
    },
    tableCell: {
        padding: 10,
        textAlign: 'left',
        borderRightWidth: 0.8,
        borderRightColor: '#e6e6e6',
        backgroundColor: '#fefefe',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    tableHeaderCell: {
        fontFamily: 'LexendBold',
        backgroundColor: '#fafafa',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#212f3d',
        fontSize: 13
    },
    tableBodyCell: {
        fontSize: 12,
        color: '#4F5B5E',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    tbldesc: {
        width: '25%',
        textAlign: 'center'
    },
    msr: {
        width: '20%',
        textAlign: 'center'
    },
    qnt: {
        width: '18%',
        textAlign: 'center'
    },
    prc: {
        width: '19%',
        textAlign: 'center'
    },
    ttl: {
        width: '19%',
        textAlign: 'center'
    },
    subField: {
        color: '#212f3d'
    },
    summrydet: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    sumrytbl: {
        maxWidth: '50%'
    },
    subtotal: {
        color: '#4169e1',
        width: '40%',
        textAlign: 'left',
        fontFamily: 'LexendBold',
    },
    grandTotal: {
        color: '#4169e1',
        width: '40%',
        textAlign: 'left',
        fontFamily: 'LexendBold',
    },
    subtotalValue: {
        width: '60%',
        textAlign: 'right'
    },
    grandTotalValue: {
        width: '60%',
        textAlign: 'right'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%'
    },
    ftrcon: {
        margin: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ftrlft: {
        fontSize: 10,
        color: '#4F5B5E'
    },
    ftrrght: {
        fontSize: 10,
        color: '#4169e1'
    }
});

const PDFInvoice = ({ invoiceData, fieldsVisible }) => {
    try {
        const subtotal = invoiceData.items.reduce((sum, item) => {
            const itemPrice = Number(item.price) || 0;
            const itemQuantity = item.quantity || 0;
            const itemTax = fieldsVisible.taxrow ? (itemPrice * (item.taxrow / 100)) : 0;
            const itemDiscount = fieldsVisible.discountrow ? (itemPrice * (item.discountrow / 100)) : 0;
            return sum + (itemQuantity * (itemPrice + itemTax - itemDiscount));
        }, 0);

        const gstAmount = (subtotal * (invoiceData.gst / 100)) || 0;
        const total = subtotal + gstAmount;

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.brndheader}>
                        <View>
                            <View style={styles.brndprf}>
                                <Image src={Logo} style={styles.brndlogo} />
                            </View>
                        </View>
                        <Text style={styles.title}>{invoiceData.company.name}</Text>
                    </View>

                    <View style={styles.header}>
                        <View style={styles.brnddet}>
                            <Text style={styles.val}>{invoiceData.company.address}</Text>
                            {fieldsVisible.companyownnm && (
                                <Text style={styles.val}>
                                    <Text style={styles.fild}>Owner : </Text>
                                    {invoiceData.company.companyownnm}
                                </Text>
                            )}
                            <Text style={styles.val}>
                                <Text style={styles.fild}>Email : </Text>
                                {invoiceData.company.email}
                            </Text>
                            <Text style={[styles.val, styles.vaklbrk]}>
                                <Text style={styles.fild}>Phone : </Text>
                                {invoiceData.company.phone}
                            </Text>
                            {fieldsVisible.companyweblink && (
                                <Text style={styles.val}>
                                    <Text style={styles.fild}>Website : </Text>
                                    {invoiceData.company.companyweblink}
                                </Text>
                            )}
                            {fieldsVisible.companyidnum && (
                                <Text style={styles.val}>
                                    <Text style={styles.fild}>Tax ID : </Text>
                                    {invoiceData.company.companyidnum}
                                </Text>
                            )}
                        </View>

                        <View style={styles.invcdet}>
                            <Text style={styles.val}>
                                <Text style={styles.fild}>Date : </Text>
                                {invoiceData.date}
                            </Text>
                            <Text style={styles.val}>
                                <Text style={styles.fild}>Invoice No : </Text>
                                {invoiceData.invoiceNumber}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.custdet}>
                        <View style={styles.custnm}>
                            <Text style={styles.fild}>Bill to : </Text>
                            <Text style={styles.val}>{invoiceData.customer.name}</Text>
                        </View>
                        <View style={styles.custml}>
                            <Text style={styles.fild}>Email : </Text>
                            <Text style={styles.val}>{invoiceData.customer.email}</Text>
                        </View>
                        {fieldsVisible.customerAddress && (
                            <View style={styles.custml}>
                                <Text style={styles.fild}>Address : </Text>
                                <Text style={styles.val}>{invoiceData.customer.address}</Text>
                            </View>
                        )}
                        {fieldsVisible.customerTelephone && (
                            <View style={styles.custml}>
                                <Text style={styles.fild}>Phone : </Text>
                                <Text style={styles.val}>{invoiceData.customer.phone}</Text>
                            </View>
                        )}
                        {fieldsVisible.customerIdnum && (
                            <View style={styles.custml}>
                                <Text style={styles.fild}>Customer ID : </Text>
                                <Text style={styles.val}>{invoiceData.customer.idnum}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.tbldesc]}>No</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.tbldesc]}>Description</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.msr]}>Measures</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.qnt]}>Quantity</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.prc]}>Price</Text>
                            {fieldsVisible.taxrow && <Text style={[styles.tableCell, styles.tableHeaderCell]}>Tax</Text>}
                            {fieldsVisible.discountrow && <Text style={[styles.tableCell, styles.tableHeaderCell]}>Discount</Text>}
                            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.ttl]}>Total</Text>
                        </View>
                        {invoiceData.items.map((item, index) => {
                            const itemPrice = Number(item.price) || 0;
                            const itemQuantity = item.quantity || 0;
                            const itemTax = fieldsVisible.taxrow ? (itemPrice * (item.taxrow / 100)).toFixed(2) : '0.00';
                            const itemDiscount = fieldsVisible.discountrow ? (itemPrice * (item.discountrow / 100)).toFixed(2) : '0.00';
                            const itemTotal = (itemQuantity * (itemPrice + Number(itemTax) - Number(itemDiscount))).toFixed(2);

                            return (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.tbldesc]}>{index + 1}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.tbldesc]}>{item.description}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.msr]}>{item.measurements}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.qnt]}>{itemQuantity}</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.prc]}>{itemPrice.toFixed(2)}</Text>
                                    {fieldsVisible.taxrow && (
                                        <Text style={[styles.tableCell, styles.tableBodyCell]}>{itemTax}</Text>
                                    )}
                                    {fieldsVisible.discountrow && (
                                        <Text style={[styles.tableCell, styles.tableBodyCell]}>{itemDiscount}</Text>
                                    )}
                                    <Text style={[styles.tableCell, styles.tableBodyCell, styles.ttl]}>{itemTotal}</Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.summrydet}>
                        <View style={[styles.table, styles.sumrytbl]}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.subtotal]}>Subtotal</Text>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.subtotalValue]}>
                                    {subtotal.toFixed(2)}
                                </Text>
                            </View>
                            {fieldsVisible.tax && (
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableBodyCell]}>Tax</Text>
                                    <Text style={[styles.tableCell, styles.tableBodyCell]}>
                                        {gstAmount.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.grandTotal]}>Grand Total</Text>
                                <Text style={[styles.tableCell, styles.tableBodyCell, styles.grandTotalValue]}>
                                    {total.toFixed(2)}
                                </Text>
                            </View>
                        </View>
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