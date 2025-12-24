/**
 * Engine Component - Main Invoice Editor
 *
 * This component provides a comprehensive invoice creation and editing interface.
 * Features include:
 * - Dynamic template selection (Basic and Premium)
 * - Real-time invoice preview and editing
 * - Custom field visibility toggles
 * - PDF generation and download
 * - Email sharing functionality
 * - Template saving and loading
 * - Subscription plan validation
 * - Responsive design with sidebar controls
 *
 * @param {Object} props - Component props
 * @param {string} props.templateId - Optional template ID for loading saved templates
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';

import { UserIconStyled, RemoveCircleIcon, ErrorIcon, EmailIcon, OwnerIcon, AddLinkIcon, ConfirmIcon, PhoneIcon, CloseIcon, renderIcon, PersonIcon } from '../../../../Components/icons/iconProvider';

import InvoicePDF from './PDFEngine';
import api, { profileService } from "../../../../services/api";
import "./Engine.css";

/**
 * Generates a unique invoice ID with format IXXXXXXX
 * @returns {string} Unique invoice identifier
 */
const generateInvoiceId = () => {
    const uniqueId = `I${Math.floor(1000000 + Math.random() * 9000000)}`;
    return uniqueId;
};

const Engine = ({ templateId }) => {
    // Template and UI state management
    const [selectedTemplate, setSelectedTemplate] = useState("simple");
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isTmpltMdlOpen, setIsTmpltMdlOpen] = useState(false);
    const [isSaveMdlOpen, setIsSaveMdlOpen] = useState(false);
    const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);
    const [isPDFReady, setIsPDFReady] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [vendorPlan, setVendorPlan] = useState('free');

    // File input reference for signature upload
    const fileInputRef = useRef(null);

    // Template customization state
    const [hasFieldVisibilityChanged, setHasFieldVisibilityChanged] = useState(false);
    const [isTemplatePromptOpen, setIsTemplatePromptOpen] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [templateNameError, setTemplateNameError] = useState('');

    // Form validation state
    const [emailError, setEmailError] = useState("");
    const [loadingShare, setLoadingShare] = useState(false);

    // Profile image state
    const [profileImage, setProfileImage] = useState('');

    // Invoice data state - contains all form data for the invoice
    const [invoiceData, setInvoiceData] = useState({
        company: {
            name: "",
            address: "",
            email: "",
            phone: "",
            companyweblink: "",
            companyownnm: "",
            companyidnum: "",
        },
        invoiceNumber: generateInvoiceId(),
        date: new Date().toISOString().split("T")[0],
        customer: {
            name: "",
            email: "",
            address: "",
            phone: "",
            idnum: "",
        },
        shipFrm: "",
        shipTo: "",
        items: [{ description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
        subttl: "",
        tax: "",
        discount: "",
        cutoff: "",
        shipCharge: "",
        finalAmnt: "",
        pymntmthd: "",
        pymntAcdetails: "",
        pymntNumber: "",
        pymntid: "",
        notes: "",
        trmscon: "",
    });

    // Field visibility state - controls which form fields are shown/hidden
    const [visibleFields, setVisibleFields] = useState({
        companyweblink: false,
        companyownnm: false,
        companyidnum: false,
        customerAddress: false,
        customerTelephone: false,
        customerIdnum: false,
        shippedFrom: false,
        shippingTo: false,
        tax: false,
        discount: false,
        cutoff: false,
        taxrow: false,
        discountrow: false,
        shipCharge: false,
        pymntDetails: false,
        pymntNumber: false,
        pymntAcdetails: false,
        pymntid: false,
        // signature: false,
        notes: false,
        termscon: false,
        grndinword: false,
    });

    // Available fields for custom template configuration
    const fields = [
        { key: 'companyweblink', label: 'Your Webpage' },
        { key: 'companyownnm', label: 'Owner Name' },
        { key: 'companyidnum', label: 'Your Tax / GSTIN / ID No' },
        { key: 'shippedFrom', label: 'Shipped From' },
        { key: 'tax', label: 'Tax' },
        { key: 'taxrow', label: 'Tax ( Per item )' },
        { key: 'shippingTo', label: 'Shipping To' },
        { key: 'shipCharge', label: 'Shipping Charge' },
        { key: 'notes', label: 'Notes' },
        { key: 'customerTelephone', label: 'Customer Telephone' },
        { key: 'customerAddress', label: 'Customer Address' },
        { key: 'customerIdnum', label: 'Customer ID / Tax / GSTIN No' },
        { key: 'pymntDetails', label: 'Payment Details' },
        { key: 'pymntNumber', label: 'Card/Cheque Number' },
        { key: 'pymntAcdetails', label: 'Payment Account Details' },
        { key: 'pymntid', label: 'Payment id / Transaction id / UPI id' },
        // { key: 'signature', label: 'Signature' },
        { key: 'discount', label: 'Discount' },
        { key: 'discountrow', label: 'Discount ( Per item )' },
        { key: 'cutoff', label: 'Cutoff' },
        { key: 'termscon', label: 'Terms & Condition' },
        { key: 'grndinword', label: 'Total in Word' },
    ];

    // Define template categories for subscription validation
    const templateCategories = {
        basic: ['simple', 'taxInvoice', 'deliveryInvoice'],
        premium: ['professionalInvoice', 'elegantInvoice', 'custom']
    };

    /**
     * Checks if a template requires premium subscription
     * @param {string} templateType - The template type to check
     * @returns {boolean} True if template is premium-only
     */
    const isPremiumTemplate = (templateType) => {
        return templateCategories.premium.includes(templateType);
    };

    // Template field configurations - defines which fields are visible for each template
    const templateFields = {
        simple: { visible: { companyweblink: false, companyownnm: false, companyidnum: false, customerAddress: false, customerTelephone: false, customerIdnum: false, shippedFrom: false, shippingTo: false, tax: false, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, notes: false, termscon: false, grndinword: false } },
        taxInvoice: { visible: { companyweblink: false, companyownnm: false, companyidnum: true, customerAddress: false, customerTelephone: false, customerIdnum: true, shippedFrom: false, shippingTo: false, tax: true, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, notes: false, termscon: false, grndinword: false } },
        deliveryInvoice: { visible: { companyweblink: true, companyownnm: false, companyidnum: false, customerAddress: false, customerTelephone: false, customerIdnum: false, shippedFrom: true, shippingTo: true, tax: false, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, notes: false, termscon: false, grndinword: false } },
        professionalInvoice: { visible: { companyweblink: true, companyownnm: true, companyidnum: false, customerAddress: true, customerTelephone: false, customerIdnum: false, shippedFrom: false, shippingTo: false, tax: true, discount: true, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: true, pymntNumber: false, pymntAcdetails: true, pymntid: false, notes: false, termscon: false, grndinword: true } },
        elegantInvoice: { visible: { companyweblink: true, companyownnm: false, companyidnum: false, customerAddress: false, customerTelephone: false, customerIdnum: true, shippedFrom: false, shippingTo: false, tax: false, discount: false, cutoff: false, taxrow: true, discountrow: true, shipCharge: false, pymntDetails: true, pymntNumber: false, pymntAcdetails: true, pymntid: false, notes: false, termscon: false, grndinword: true } },
        custom: { visible: { companyweblink: false, companyownnm: false, companyidnum: false, customerAddress: false, customerTelephone: false, customerIdnum: false, shippedFrom: false, shippingTo: false, tax: false, discount: false, cutoff: false, taxrow: false, discountrow: false, shipCharge: false, pymntDetails: false, pymntNumber: false, pymntAcdetails: false, pymntid: false, notes: false, termscon: false, grndinword: false } },
    };

    // Effect to ensure template-plan consistency on component mount
    useEffect(() => {
        /**
         * Validates that free plan users cannot access premium templates
         * Performs double-check with server to ensure subscription status accuracy
         */
        const checkPlanTemplateConsistency = async () => {
            if (vendorPlan === 'free' && isPremiumTemplate(selectedTemplate)) {
                // Double-check subscription status directly from server
                try {
                    const profileResponse = await profileService.getProfile();
                    const plan = profileResponse?.vendor?.v_plan?.toLowerCase() || 'free';
                    const subscriptionStatus = profileResponse?.vendor?.v_subscription_status;

                    if (plan === 'premium' && subscriptionStatus === 'active') {
                        // User actually has premium - update state
                        setVendorPlan('premium');
                    } else {
                        // User doesn't have premium - reset to basic template
                        setSelectedTemplate('simple');
                        setVisibleFields(templateFields.simple.visible);
                        alert('Premium template access requires a Premium Plan');
                    }
                } catch (error) {
                    console.error("Error verifying premium status:", error);
                    // On error, default to free plan for safety
                    setSelectedTemplate('simple');
                    setVisibleFields(templateFields.simple.visible);
                }
            }
        };

        checkPlanTemplateConsistency();
    }, [vendorPlan, selectedTemplate, templateFields]);

    /**
     * Handles template selection changes with subscription validation
     * @param {Event} event - The select change event
     */
    const handleTemplateChange = async (event) => {
        event.preventDefault(); // Prevent default selection behavior
        const newTemplate = event.target.value;

        // Get fresh plan status for consistency
        try {
            const profileResponse = await profileService.getProfile();
            const plan = profileResponse?.vendor?.v_plan?.toLowerCase() || 'free';
            const subscriptionStatus = profileResponse?.vendor?.v_subscription_status;
            const isPremiumActive = plan === 'premium' && subscriptionStatus === 'active';

            // Update vendorPlan state
            setVendorPlan(isPremiumActive ? 'premium' : 'free');

            // Block premium template selection for free plan users
            if (!isPremiumActive && isPremiumTemplate(newTemplate)) {
                alert('Please upgrade to Premium Plan to use this template');
                return;
            }

            setSelectedTemplate(newTemplate);
            setIsEditing(true);

            // Handle custom template initialization
            if (newTemplate === 'custom') {
                setTemplateName('');
                // Reset form data for custom template
                setInvoiceData(prevData => ({
                    ...prevData,
                    customer: {
                        name: "",
                        email: "",
                        address: "",
                        phone: "",
                        idnum: "",
                    },
                    shipFrm: "",
                    shipTo: "",
                    items: [{ description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
                    tax: "",
                    discount: "",
                    cutoff: "",
                    shipCharge: "",
                    finalAmnt: "",
                    pymntmthd: "",
                    pymntAcdetails: "",
                    pymntNumber: "",
                    pymntid: "",
                    notes: "",
                    trmscon: "",
                }));
            }

            // Set visible fields for the selected template
            setVisibleFields(templateFields[newTemplate].visible);
            setHasFieldVisibilityChanged(false);
        } catch (error) {
            console.error("Error checking premium status:", error);
            // Default to preventing premium template access on error
            if (isPremiumTemplate(newTemplate)) {
                alert('Error verifying your plan status. Please try again.');
            }
        }
    };

    const navigate = useNavigate();

    /**
     * Redirects user to pricing page for premium upgrade
     */
    const handlePricingRedirect = () => {
        navigate("/Pricing");
    };

    /**
     * Returns custom styles for disabled premium template options
     * @param {string} templateType - The template type to style
     * @returns {Object} CSS style object for disabled options
     */
    const getOptionStyle = (templateType) => {
        if (vendorPlan.toLowerCase() === 'free' && isPremiumTemplate(templateType)) {
            return {
                color: '#aaa',
                backgroundColor: '#f5f5f5',
                opacity: 0.6,
                pointerEvents: 'none'
            };
        }
        return {};
    };

    /**
     * Updates vendor profile with new data
     * @param {Object} updates - Object containing profile updates
     */
    const updateVendorProfile = async (updates) => {
        try {
            await api.put('/auth/profile', updates);
            console.log('Vendor profile updated successfully');
        } catch (error) {
            console.error('Error updating vendor profile:', error);
        }
    };

    /**
     * Handles file selection for signature upload
     * @param {Event} event - File input change event
     */
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Uploaded file:", file);
        }
    };

    /**
     * Triggers file input click for signature upload
     */
    const handleFileButton = () => {
        fileInputRef.current.click();
    };

    /**
     * Adds a new empty item row to the invoice
     */
    const addItem = useCallback(() => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: [...prevData.items, { description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
        }));
        setIsEditing(true);
    }, []);

    /**
     * Removes an item row from the invoice (minimum 1 item required)
     * @param {number} index - Index of the item to remove
     */
    const removeItem = useCallback((index) => {
        if (invoiceData.items.length > 1) {
            setInvoiceData((prevData) => ({
                ...prevData,
                items: prevData.items.filter((_, i) => i !== index),
            }));
            setIsEditing(true);
        }
    }, [invoiceData.items.length]);

    /**
     * Updates a specific field in an item row
     * @param {number} index - Index of the item
     * @param {string} field - Field name to update
     * @param {any} value - New value for the field
     */
    const handleChange = useCallback((index, field, value) => {
        setInvoiceData((prevData) => {
            const updatedItems = [...prevData.items];
            updatedItems[index][field] = value;
            return { ...prevData, items: updatedItems };
        });
        setIsEditing(true);
    }, []);

    /**
     * Toggles visibility of a custom field in the template
     * @param {string} key - Field key to toggle
     */
    const toggleField = useCallback((key) => {
        setVisibleFields((prev) => {
            const newVisibleFields = { ...prev, [key]: !prev[key] };
            const anyFieldVisible = Object.values(newVisibleFields).some(value => value === true);
            setHasFieldVisibilityChanged(anyFieldVisible);
            return newVisibleFields;
        });
    }, []);

    /**
     * Validates email format using regex
     * @param {string} email - Email address to validate
     * @returns {string} Error message or empty string if valid
     */
    const validateEmail = useCallback((email) => {
        if (!email) {
            return "Email is required";
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        return "";
    }, []);

    /**
     * Handles customer email input changes with validation
     * @param {Event} e - Input change event
     */
    const handleCustomerEmailChange = useCallback((e) => {
        const email = e.target.value;
        setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, email: email } });
        setEmailError(validateEmail(email));
    }, [validateEmail, invoiceData]);

    // Effect to enable/disable generate button based on form completion
    useEffect(() => {
        const isAllFieldsFilled =
            invoiceData.customer.name !== "" &&
            invoiceData.customer.email !== "" &&
            !emailError &&
            invoiceData.items.every((item) => item.description && item.price);
        setIsGenerateEnabled(isAllFieldsFilled);
    }, [invoiceData, emailError]);


    // Effect to fetch and populate vendor profile data on component mount
    useEffect(() => {
        /**
         * Fetches vendor profile data and populates company information in invoice
         */
        const fetchVendorData = async () => {
            try {
                const profileData = await profileService.getProfile();
                if (profileData && profileData.vendor) {
                    setInvoiceData(prevData => ({
                        ...prevData,
                        company: {
                            name: profileData.vendor.v_brand_name,
                            address: profileData.vendor.v_address,
                            email: profileData.vendor.v_mail,
                            phone: profileData.vendor.v_telephone,
                            companyweblink: profileData.vendor.v_website,
                            companyownnm: profileData.vendor.v_name,
                            companyidnum: profileData.vendor.v_business_code,
                        }
                    }));
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };

        fetchVendorData();
    }, []);

    // Effect to handle template loading or initialization based on templateId prop
    useEffect(() => {
        if (templateId) {
            loadSavedTemplate(templateId);
        } else {
            // Initialize with simple template when no templateId provided
            setSelectedTemplate('simple');
            setVisibleFields(templateFields.simple.visible);
            setTemplateName('');
            setHasFieldVisibilityChanged(false);
            // Reset form data except company info
            setInvoiceData(prevData => ({
                ...prevData,
                customer: {
                    name: "",
                    email: "",
                    address: "",
                    phone: "",
                    idnum: "",
                },
                shipFrm: "",
                shipTo: "",
                items: [{ description: "", measurements: "", quantity: 1, price: "", taxrow: 0, discountrow: 0 }],
                tax: "",
                discount: "",
                cutoff: "",
                shipCharge: "",
                finalAmnt: "",
                pymntmthd: "",
                pymntAcdetails: "",
                pymntNumber: "",
                pymntid: "",
                notes: "",
                trmscon: "",
            }));
        }
    }, [templateId]);

    // Effect to fetch vendor subscription plan and enforce template restrictions
    useEffect(() => {
        /**
         * Fetches vendor profile and sets subscription plan
         * Enforces premium template restrictions for free users
         */
        const fetchVendorProfile = async () => {
            try {
                const response = await profileService.getProfile();
                if (response?.vendor) {
                    const plan = (response.vendor.v_plan || 'free').toLowerCase();
                    const subscriptionStatus = response.vendor.v_subscription_status;

                    console.log("Profile Response:", response);
                    console.log("Plan:", plan);
                    console.log("Subscription Status:", subscriptionStatus);

                    // Only set premium plan if subscription is active
                    if (plan === 'premium' && subscriptionStatus === 'active') {
                        console.log("Premium plan detected with active subscription");
                        setVendorPlan('premium');
                    } else {
                        console.log("Non-premium plan or inactive subscription");
                        setVendorPlan('free');

                        // If user has premium template selected but subscription is not active,
                        // force switch to simple template
                        if (isPremiumTemplate(selectedTemplate)) {
                            setSelectedTemplate('simple');
                            setVisibleFields(templateFields.simple.visible);
                            alert('Premium templates require an active subscription');
                        }
                    }
                } else {
                    console.log('No vendor data found');
                    // If no vendor data, default to free plan
                    setVendorPlan('free');
                    setSelectedTemplate('simple');
                    setVisibleFields(templateFields.simple.visible);
                }
            } catch (error) {
                console.error('Error fetching vendor profile:', error);
                // On error, default to free plan for safety
                setVendorPlan('free');
                setSelectedTemplate('simple');
                setVisibleFields(templateFields.simple.visible);
            }
        };
        fetchVendorProfile();
    }, [selectedTemplate, templateFields.simple.visible]);

    /**
     * Loads a saved template by ID with subscription validation
     * @param {string} id - Template ID to load
     */
    const loadSavedTemplate = async (id) => {
        try {
            // First fetch the vendor profile directly to get the current plan status
            const profileResponse = await profileService.getProfile();
            const plan = profileResponse?.vendor?.v_plan?.toLowerCase() || 'free';
            const subscriptionStatus = profileResponse?.vendor?.v_subscription_status;

            console.log("Profile Response:", profileResponse);
            console.log("Plan:", plan);
            console.log("Subscription Status:", subscriptionStatus);

            // Set vendorPlan state based on fresh data
            const isPremiumActive = plan === 'premium' && subscriptionStatus === 'active';
            if (isPremiumActive) {
                console.log("Premium plan detected with active subscription");
                setVendorPlan('premium');
            } else {
                console.log("Non-premium plan or inactive subscription");
                setVendorPlan('free');
            }

            // Now fetch the template
            const response = await api.get(`/templates/${id}`);
            if (response.data) {
                const template = response.data;
                const templateType = template.template_type || 'simple';
                console.log("Template:", templateType);
                console.log("vendorPlan:", isPremiumActive ? 'premium' : 'free');

                // Check if template is premium
                if (isPremiumTemplate(templateType)) {
                    // Use the directly fetched plan status instead of state
                    if (!isPremiumActive) {
                        alert('Premium template requires Premium Plan');
                        setSelectedTemplate('simple');
                        setVisibleFields(templateFields.simple.visible);
                        return;
                    }
                }

                // Proceed with template loading
                setSelectedTemplate(templateType);
                setVisibleFields(template.content || templateFields[templateType].visible);
                setTemplateName(template.name);
                setHasFieldVisibilityChanged(true);
            }
        } catch (error) {
            console.error('Error loading template:', error);
            alert('Failed to load template');
            setSelectedTemplate('simple');
            setVisibleFields(templateFields.simple.visible);
        }
    };

    // Calculate subtotal with item-level discounts and taxes
    const calculateSubtotal = useMemo(() => {
        return invoiceData.items.reduce((sum, item) => {
            const itemPrice = Number(item.price) || 0;
            const itemQuantity = Number(item.quantity) || 0;

            const baseTotal = itemQuantity * itemPrice;

            const discountAmount = visibleFields.discountrow && item.discountrow
                ? (baseTotal * (Number(item.discountrow) / 100))
                : 0;

            const taxAmount = visibleFields.taxrow && item.taxrow
                ? ((baseTotal - discountAmount) * (Number(item.taxrow) / 100))
                : 0;

            const finalTotal = baseTotal - discountAmount + taxAmount;

            return sum + finalTotal;
        }, 0).toFixed(2);
    }, [invoiceData.items, visibleFields.discountrow, visibleFields.taxrow]);

    /**
     * Calculates the final grand total including all charges, discounts, and taxes
     * @returns {string} Formatted grand total as string
     */
    const calculateGrandTotal = useCallback(() => {
        const subtotal = Number(calculateSubtotal);
        const shipCharge = Number(invoiceData.shipCharge) || 0;

        const discountAmount = (visibleFields.discount && invoiceData.discount)
            ? (subtotal * (invoiceData.discount / 100))
            : 0;

        const cutoff = Number(invoiceData.cutoff) || 0;
        const amountAfterChargeAndDiscount = subtotal + shipCharge - discountAmount;

        const taxAmount = (visibleFields.tax && invoiceData.tax)
            ? (amountAfterChargeAndDiscount * (invoiceData.tax / 100))
            : 0;

        const grandTotal = amountAfterChargeAndDiscount + taxAmount - cutoff;

        return grandTotal.toFixed(2);
    }, [calculateSubtotal, invoiceData.shipCharge, invoiceData.discount, invoiceData.cutoff, invoiceData.tax, visibleFields.discount, visibleFields.tax]);

    /**
     * Prepares invoice for saving/sharing by opening modal and setting PDF ready state
     */
    const handlePrepareInvoice = () => {
        setIsTmpltMdlOpen(false);
        setIsModelOpen(true);
        setIsSaveMdlOpen(true);
        setIsPDFReady(true);
        setIsEditing(false);
    };

    /**
     * Converts a number to its word representation (for amount in words)
     * @param {number} num - Number to convert
     * @returns {string} Number in words
     */
    const numberToWords = useCallback((num) => {
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
    }, []);

    /**
     * Helper function to convert hundreds place in number-to-words conversion
     * @param {number} num - Number to convert (0-999)
     * @returns {string} Word representation of the number
     */
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

    // Convert final amount to words for display
    const finalamntword = useMemo(() => numberToWords(Number(calculateGrandTotal())), [numberToWords, calculateGrandTotal]);

    /**
     * Opens template save prompt if field visibility has changed
     */
    const handleSaveTemplate = () => {
        if (!hasFieldVisibilityChanged) return;
        setIsTemplatePromptOpen(true);
    };

    /**
     * Finalizes template saving with validation and API call
     */
    const handleSaveTemplateFinal = async () => {

        if (!templateName.trim()) {
            setTemplateNameError('Please enter a template name');
            return;
        }

        try {

            // Check if template name already exists
            const templatesResponse = await api.get('/templates');
            const existingTemplate = templatesResponse.data.find(
                template => template.name.toLowerCase() === templateName.toLowerCase()
            );

            if (existingTemplate) {
                setTemplateNameError('Template name already exists. Please choose a different name.');
                return;
            }

            // Clear any previous error
            setTemplateNameError('');

            // Get all visible fields
            const visibleFieldNames = Object.entries(visibleFields)
                .filter(([_, value]) => value)
                .reduce((acc, [key]) => {
                    acc[key] = true;
                    return acc;
                }, {});

            // Include both structure and values in template data
            const templateData = {
                name: templateName,
                template_type: 'custom',
                content: visibleFieldNames,
            };

            const response = await api.post('/templates', templateData);

            if (response.data) {
                alert('Template saved successfully!');
                setSelectedTemplate('simple');
                setVisibleFields(templateFields.simple.visible);
                setIsTemplatePromptOpen(false);
                setTemplateName('');
                setHasFieldVisibilityChanged(false);

                // Clear the location state and templateId
                window.history.replaceState({}, document.title, '/Dashboard');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template');
        }
    };

    /**
     * Closes the template save prompt and resets form state
     */
    const handleCloseTemplatePrompt = () => {
        setIsTemplatePromptOpen(false);
        setTemplateName('');
        setTemplateNameError('');
    };

    /**
     * Closes the modal and enables editing mode
     */
    const handlemdlstat = () => {
        setIsModelOpen(false);
        setIsEditing(true);
    }

    const [templateData, setTemplateData] = useState({
        templateName: "",
        currentUser: "current_user", // Replace with actual user name if needed
        visibleFields: [],
    });

    /**
     * Discards invoice save and returns to editing mode
     */
    const handleDiscardInvcSave = () => {
        setIsEditing(true);
        setIsModelOpen(false);
    }

    /**
     * Confirms and saves the invoice with customer creation and data transformation
     */
    const handleConfirmSave = async () => {
        try {
            // Get vendor data from profile first
            const profileData = await profileService.getProfile();
            if (!profileData || !profileData.vendor) {
                throw new Error('Vendor profile not found');
            }

            // Create customer data object with correct field names
            const customerData = {
                name: invoiceData.customer.name || '',
                email: invoiceData.customer.email || '',
                mobile: invoiceData.customer.phone || '0000000000',
                address: invoiceData.customer.address || 'Not provided',
                vendor_id: profileData.vendor.v_id
            };

            // Create customer first
            const customerResponse = await api.post('/customers', customerData);
            if (!customerResponse.data || !customerResponse.data.customer) {
                throw new Error('Failed to create customer');
            }

            const specificVendorFieldNames = ['companyweblink', 'companyownnm', 'companyidnum', 'grndinword'];

            const visibleVendorFieldNames = Object.entries(visibleFields)
                .filter(([key, value]) => specificVendorFieldNames.includes(key) && value)
                .reduce((acc, [key]) => {
                    acc[key] = true;
                    return acc;
                }, {});

            const customerId = customerResponse.data.customer.c_id;

            // Transform the invoice data to match the backend schema
            const transformedData = {
                i_id: invoiceData.invoiceNumber,
                t_id: selectedTemplate,
                v_field_state: visibleVendorFieldNames,
                i_date: new Date(invoiceData.date).toISOString(),
                c_id: customerId,
                c_name: invoiceData.customer.name,
                c_mail: invoiceData.customer.email,
                c_mobile: invoiceData.customer.phone,
                c_address: invoiceData.customer.address,
                c_tax_id: invoiceData.customer.idnum,
                shipped_from: invoiceData.shipFrm,
                shipping_to: invoiceData.shipTo,
                i_product_det_obj: invoiceData.items.map(item => ({
                    description: item.description || '',
                    measurements: item.measurements || '',
                    qty: item.quantity || 0,
                    price: Number(item.price) || 0,
                    tax: Number(item.taxrow) || 0,
                    discount: Number(item.discountrow) || 0
                })),
                i_total_amnt: Number(calculateSubtotal) || 0,
                i_tax: Number(invoiceData.tax) || 0,
                i_amnt_aft_tax: Number(calculateGrandTotal()) || 0,
                i_discount: Number(invoiceData.discount) || 0,
                i_shipping_charge: Number(invoiceData.shipCharge) || 0,
                i_cutoff: Number(invoiceData.cutoff) || 0,
                i_notes: invoiceData.notes || '',
                i_terms: invoiceData.trmscon || '',
                i_payment_method: invoiceData.pymntmthd || '',
                i_payment_details: {
                    number: invoiceData.pymntNumber || '',
                    account: invoiceData.pymntAcdetails || '',
                    id: invoiceData.pymntid || ''
                }
            };

            // Save invoice
            const response = await api.post('/invoices', transformedData);

            console.log(transformedData)

            if (response.data && response.data.invoice) {
                alert('Invoice saved successfully!');
                await updateVendorProfile({ v_website: invoiceData.company.companyweblink });
                setIsModelOpen(false);
                window.location.reload();
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
            alert('Failed to save invoice. Please try again.');
        }
    };

    /**
     * Saves and shares the invoice via email with PDF attachment
     */
    const handleShareInvoice = async () => {
        try {
            setLoadingShare(true);
            // First save the invoice
            const profileData = await profileService.getProfile();
            if (!profileData || !profileData.vendor) {
                throw new Error('Vendor profile not found');
            }

            // Create customer data object with correct field names
            const customerData = {
                name: invoiceData.customer.name || '',
                email: invoiceData.customer.email || '',
                mobile: invoiceData.customer.phone || '0000000000',
                address: invoiceData.customer.address || 'Not provided',
                vendor_id: profileData.vendor.v_id
            };

            // Create customer first
            const customerResponse = await api.post('/customers', customerData);
            if (!customerResponse.data || !customerResponse.data.customer) {
                throw new Error('Failed to create customer');
            }
            const customerId = customerResponse.data.customer.c_id;
            const specificVendorFieldNames = ['companyweblink', 'companyownnm', 'companyidnum', 'grndinword'];

            const visibleVendorFieldNames = Object.entries(visibleFields)
                .filter(([key, value]) => specificVendorFieldNames.includes(key) && value)
                .reduce((acc, [key]) => {
                    acc[key] = true;
                    return acc;
                }, {});

            // Transform the invoice data to match the backend schema
            const transformedData = {
                i_id: invoiceData.invoiceNumber,
                t_id: selectedTemplate,
                v_field_state: visibleVendorFieldNames,
                i_date: new Date(invoiceData.date).toISOString(),
                c_id: customerId,
                c_name: invoiceData.customer.name,
                c_mail: invoiceData.customer.email,
                c_mobile: invoiceData.customer.phone,
                c_address: invoiceData.customer.address,
                c_tax_id: invoiceData.customer.idnum,
                shipped_from: invoiceData.shipFrm,
                shipping_to: invoiceData.shipTo,
                i_product_det_obj: invoiceData.items.map(item => ({
                    description: item.description || '',
                    measurements: item.measurements || '',
                    qty: item.quantity || 0,
                    price: Number(item.price) || 0,
                    tax: Number(item.taxrow) || 0,
                    discount: Number(item.discountrow) || 0
                })),
                i_total_amnt: Number(calculateSubtotal) || 0,
                i_tax: Number(invoiceData.tax) || 0,
                i_amnt_aft_tax: Number(calculateGrandTotal()) || 0,
                i_discount: Number(invoiceData.discount) || 0,
                i_shipping_charge: Number(invoiceData.shipCharge) || 0,
                i_cutoff: Number(invoiceData.cutoff) || 0,
                i_notes: invoiceData.notes || '',
                i_terms: invoiceData.trmscon || '',
                i_payment_method: invoiceData.pymntmthd || '',
                i_payment_details: {
                    number: invoiceData.pymntNumber || '',
                    account: invoiceData.pymntAcdetails || '',
                    id: invoiceData.pymntid || ''
                }
            };

            console.log(transformedData);
            // Save invoice
            const saveResponse = await api.post('/invoices', transformedData);

            if (!saveResponse.data || !saveResponse.data.invoice) {
                throw new Error('Failed to save invoice');
            }

            // Generate PDF using PDFEngine format
            console.log("invoiceData", invoiceData)
            console.log("visibleFields", visibleFields)
            const pdfBlob = await pdf(<InvoicePDF invoiceData={invoiceData} fieldsVisible={visibleFields} profileImage={profileImage} />).toBlob();


            // Create FormData and append the PDF
            const formData = new FormData();
            formData.append('email', invoiceData.customer.email);
            formData.append('pdf', pdfBlob, `invoice-${invoiceData.invoiceNumber}.pdf`);

            // Set the correct headers for multipart/form-data
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            // Send the invoice via email
            const response = await api.post(`/invoices/${invoiceData.invoiceNumber}/send`, formData, config);
            await updateVendorProfile({ v_website: invoiceData.company.companyweblink });
            alert('Invoice saved and sent successfully to email!');

            // Close the modal after successful save and share
            setIsModelOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error sharing invoice:', error);
            alert('Failed to save and send invoice. Please try again.');
        } finally {
            setLoadingShare(false);
        }
    };


    // Toast component removed, using alert instead



    // Fetch and set profile image on component mount
    useEffect(() => {

        const fetchProfileImage = async () => {
            try {

                const response = await profileService.getProfile();
                if (response?.vendor?.v_id) {

                    const imageResponse = await profileService.getProfileImage(response.vendor.v_id);
                    if (imageResponse) {

                        setProfileImage(imageResponse);

                    }

                }

            } catch (error) {

                console.error('Error fetching profile image:', error);

                setProfileImage('');

            }

        };

        fetchProfileImage();

    }, []);

    return (
        <div className="invc-container d-flex align-items-center justify-content-between p-0 position-relative">

            <div className="invc p-4">
                <form>

                    <header>
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="brnd-logo">
                                {
                                    <img src={profileImage} alt="Brand Logo" height="128" width="128" crossOrigin="anonymous" />
                                    || renderIcon(UserIconStyled, 128)
                                }
                            </div>
                            <div>
                                <div className="brnd-nm f-30 pb-1 text-end">{invoiceData.company.name}</div>
                                <div className="brnd-addr f-18 px-1 text-end">{invoiceData.company.address}</div>
                            </div>


                        </div>
                    </header>
                    <hr />
                    <section className="row align-items-start justify-content-between mb-3 g-0">
                        <div className="col-6">
                            <div className="py-2 fw-medium sec-head">Company Info</div>
                            <table className="table table-bordered">
                                <tbody>

                                    {visibleFields.companyownnm && (
                                        <tr>
                                            <th scope="row">
                                                {renderIcon(OwnerIcon, 38)}
                                            </th>
                                            <td className="brnd-owner py-1">{invoiceData.company.companyownnm}</td>
                                        </tr>
                                    )}

                                    <tr>
                                        <th scope="row">
                                            {renderIcon(EmailIcon, 38)}
                                        </th>

                                        <td className="brnd-eml py-1">{invoiceData.company.email}</td>
                                    </tr>

                                    <tr>
                                        <th scope="row">
                                            {renderIcon(PhoneIcon, 38)}
                                        </th>
                                        <td className="brnd-tele py-1">{invoiceData.company.phone}</td>
                                    </tr>

                                    {visibleFields.companyidnum && (
                                        <tr>
                                            <th scope="row">
                                                {renderIcon(ConfirmIcon, 38)}
                                            </th>
                                            <td className="brnd-idnum">{invoiceData.company.companyidnum}</td>
                                        </tr>
                                    )}

                                    {visibleFields.companyweblink && (
                                        <tr>
                                            <th scope="row">
                                                {renderIcon(AddLinkIcon, 38)}
                                            </th>
                                            <td className="">
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    placeholder="Webpage"
                                                    autoComplete="url"
                                                    value={invoiceData.company.companyweblink}
                                                    onChange={(e) => {
                                                        const newWeblink = e.target.value;
                                                        setInvoiceData(prevData => ({
                                                            ...prevData,
                                                            company: {
                                                                ...prevData.company,
                                                                companyweblink: newWeblink
                                                            }
                                                        }));
                                                        updateVendorProfile({ v_website: newWeblink });
                                                    }}
                                                    required
                                                />
                                            </td>
                                        </tr>
                                    )}


                                </tbody>
                            </table>
                        </div>

                        <div className="col-auto">
                            <div className="py-2 fw-medium sec-head">Invoice Info</div>
                            <table className="table table-sm table-bordered">
                                <tbody>
                                    <tr>
                                        <th scope="row" className="text-start">Invoice No.</th>
                                        <td className="text-end invc-identity">{invoiceData.invoiceNumber}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="text-start">Date</th>
                                        <td className="text-end invc-date">{invoiceData.date}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                    </section>

                    <hr />

                    <section className="my-4">
                        <div className="cust-det text-start">

                            <div className="py-2 fw-medium sec-head">Billing Info</div>

                            <div className="row p-0 m-0 justify-content-between gap-2">

                                <div className="col-12 cust-nm p-0">
                                    <input
                                        type="text"
                                        minLength="3"
                                        maxLength="30"
                                        className="form-control"
                                        placeholder="Customer Name"
                                        autoComplete="name"
                                        name="customerName"
                                        value={invoiceData.customer.name}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, name: e.target.value } })}
                                        required
                                    />
                                </div>

                                <div className="col-12 cust-eml p-0">
                                    <input
                                        type="email"
                                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                        placeholder="Customer Email"
                                        autoComplete="email"
                                        name="customerEmail"
                                        value={invoiceData.customer.email}
                                        onChange={handleCustomerEmailChange}
                                        required
                                    />
                                    {emailError && (
                                        <div className="invalid-feedback d-block d-flex align-items-center gap-1 f-14">
                                            {renderIcon(ErrorIcon, 20, 'var(--brand-danger)')}
                                            {emailError}
                                        </div>
                                    )}
                                </div>

                                {visibleFields.customerAddress && (
                                    <div className="col-12 cust-eml p-0">
                                        <input
                                            type="text"
                                            minLength="2"
                                            maxLength="100"
                                            className="form-control"
                                            placeholder="Customer Address"
                                            autoComplete="address-line1"
                                            name="customerAddress"
                                            value={invoiceData.customer.address}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, address: e.target.value } })}
                                            required
                                        />
                                    </div>
                                )}

                                {visibleFields.customerTelephone && (
                                    <div className="col-12 cust-eml p-0">
                                        <input
                                            type="tel"
                                            maxLength="10"
                                            className="form-control"
                                            placeholder="Customer Contact"
                                            autoComplete="tel"
                                            name="customerPhone"
                                            value={invoiceData.customer.phone}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, phone: e.target.value } })}
                                            required
                                        />
                                    </div>
                                )}

                                {visibleFields.customerIdnum && (
                                    <div className="col-12 cust-eml p-0">
                                        <input
                                            type="text"
                                            minLength="2"
                                            maxLength="30"
                                            className="form-control"
                                            placeholder="Customer Tax / ID No"
                                            autoComplete="off"
                                            name="customerIdNum"
                                            value={invoiceData.customer.idnum}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, customer: { ...invoiceData.customer, idnum: e.target.value } })}
                                            required
                                        />
                                    </div>
                                )}

                                {visibleFields.shippedFrom && (
                                    <div className="col-5 cust-eml p-0 pt-2">
                                        <div className="py-2  fw-medium sec-head">Shipping From</div>
                                        <input
                                            type="text"
                                            minLength="2"
                                            maxLength="50"
                                            className="form-control"
                                            placeholder="Shipping From"
                                            autoComplete="address-line1"
                                            name="shippingFrom"
                                            value={invoiceData.shipFrm}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, shipFrm: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}

                                {visibleFields.shippingTo && (
                                    <div className="col-5 cust-eml p-0 pt-2">
                                        <div className="py-2  fw-medium sec-head">Shipping To</div>
                                        <input
                                            type="text"

                                            minLength="2"
                                            maxLength="50"
                                            className="form-control"
                                            placeholder="Shipping To"
                                            autoComplete="address-line2"
                                            name="shippingTo"
                                            value={invoiceData.shipTo}
                                            onChange={(e) => setInvoiceData({ ...invoiceData, shipTo: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}

                            </div>

                        </div>
                    </section>
                    <hr />
                    <section className="mt-3">
                        <div className="py-2  fw-medium sec-head">Items Details</div>
                        <table className="table table-bordered maintbl">

                            <thead>

                                <tr>
                                    <th className="row-acent-maintbl">No</th>
                                    <th>Description</th>
                                    <th>Measurs</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    {visibleFields.discountrow && <th>Discount %</th>}
                                    {visibleFields.taxrow && <th>Tax %</th>}
                                    <th className="row-acent-maintbl">Total</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody className="table-group-divider">

                                {invoiceData.items.map((item, index) => (

                                    <tr key={index} className="maintblrw">

                                        <td className="row-acent-maintbl">{index + 1}</td>

                                        <td>
                                            <input
                                                type="text"

                                                minLength="2"
                                                maxLength="100"
                                                className="form-control"
                                                placeholder="Item description"
                                                value={item.description}
                                                onChange={(e) => handleChange(index, "description", e.target.value)}
                                                required
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"

                                                minLength="2"
                                                maxLength="30"
                                                className="form-control"
                                                placeholder="Measurements"
                                                value={item.measurements}
                                                onChange={(e) => handleChange(index, "measurements", e.target.value)}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                max="100000000"
                                                value={item.quantity}
                                                onChange={(e) => handleChange(index, "quantity", Number(e.target.value))}
                                                required
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100000000"
                                                className="form-control"
                                                placeholder="Price"
                                                value={item.price}
                                                onChange={(e) => handleChange(index, "price", Number(e.target.value))}
                                                required
                                            />
                                        </td>

                                        {visibleFields.discountrow && (
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="form-control"
                                                    placeholder="Discount %"
                                                    onChange={(e) => handleChange(index, "discountrow", Number(e.target.value))}
                                                />
                                            </td>
                                        )}

                                        {visibleFields.taxrow && (
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="form-control"
                                                    placeholder="Tax %"
                                                    onChange={(e) => handleChange(index, "taxrow", Number(e.target.value))}
                                                />
                                            </td>
                                        )}

                                        <td className="text-center row-acent-maintbl">
                                            {(() => {
                                                const baseTotal = item.quantity * (item.price || 0);
                                                const discountAmount = visibleFields.discountrow && item.discountrow ? (baseTotal * (item.discountrow / 100)) : 0;
                                                const amountAfterDiscount = baseTotal - discountAmount;
                                                const taxAmount = visibleFields.taxrow && item.taxrow ? (amountAfterDiscount * (item.taxrow / 100)) : 0;
                                                const finalTotal = amountAfterDiscount + taxAmount;
                                                return finalTotal.toFixed(2);
                                            })()}
                                        </td>

                                        <td className="text-center">
                                            {invoiceData.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn p-0 border-0 bg-transparent"
                                                    onClick={() => removeItem(index)}
                                                    title="Remove Item"
                                                    style={{ cursor: 'pointer', display: 'inline-block' }}
                                                >
                                                    {renderIcon(RemoveCircleIcon, 28, 'var(--brand-secondary-dark-2)')}
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                        <button type="button" className="btn brand-btn ad-itm-btn px-4 b-rd-8 m-0" onClick={addItem}>Add Item</button>

                    </section>

                    <section className="row d-flex align-items-center p-0 m-0 my-4">

                        <div className="col-6 px-0 ms-auto">
                            <div className="py-2  fw-medium sec-head">Summary</div>
                            <table className="table table-sm table-bordered smry-table m-0">

                                <tbody>

                                    <tr className="row-acent-col">
                                        <th scope="row">Subtotal</th>
                                        <td>{calculateSubtotal}</td>
                                    </tr>

                                    {visibleFields.shipCharge && (
                                        <tr>
                                            <th scope="row" className="gry-field">Shipping Charge</th>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100000000"
                                                    className="form-control"
                                                    placeholder="Shipping Charge"
                                                    value={invoiceData.shipCharge}
                                                    onChange={(e) => setInvoiceData({ ...invoiceData, shipCharge: Number(e.target.value) })}
                                                />
                                            </td>
                                        </tr>
                                    )}

                                    {visibleFields.discount && (
                                        <>
                                            <tr>
                                                <th scope="row" className="gry-field">Discount %</th>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="form-control"
                                                        placeholder="Discount %"
                                                        value={invoiceData.discount}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, discount: Number(e.target.value) })}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="gry-field">Calculated Discount</th>
                                                <td>{(Number(calculateSubtotal) * (invoiceData.discount / 100)).toFixed(2)}</td>
                                            </tr>
                                        </>
                                    )}

                                    <tr className="row-acent-col">
                                        <th scope="row">Taxable Amount</th>
                                        <td>
                                            {(() => {
                                                const subtotal = Number(calculateSubtotal);
                                                const shippingCharge = visibleFields.shipCharge ? Number(invoiceData.shipCharge) : 0;
                                                const discountAmount = visibleFields.discount ? (subtotal * (invoiceData.discount / 100)) : 0;
                                                const amountAfterChargeAndDiscount = subtotal + shippingCharge - discountAmount;
                                                return amountAfterChargeAndDiscount.toFixed(2);
                                            })()}
                                        </td>
                                    </tr>

                                    {visibleFields.tax && (
                                        <>
                                            <tr>
                                                <th scope="row" className="gry-field">Tax %</th>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="form-control"
                                                        placeholder="Tax %"
                                                        value={invoiceData.tax}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, tax: Number(e.target.value) })}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="gry-field">Calculated Tax</th>
                                                <td>
                                                    {(() => {
                                                        const amountAfterChargeAndDiscount = Number(calculateSubtotal) + (visibleFields.shipCharge ? Number(invoiceData.shipCharge) : 0) - (visibleFields.discount ? (Number(calculateSubtotal) * (invoiceData.discount / 100)) : 0);
                                                        const taxAmount = visibleFields.tax ? (amountAfterChargeAndDiscount * (invoiceData.tax / 100)) : 0;
                                                        return taxAmount.toFixed(2);
                                                    })()}
                                                </td>
                                            </tr>
                                        </>
                                    )}

                                    {visibleFields.cutoff && (
                                        <tr>
                                            <th scope="row" className="gry-field">Cutoff</th>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100000"
                                                    className="form-control"
                                                    placeholder="Cutoff"
                                                    value={invoiceData.cutoff}
                                                    onChange={(e) => setInvoiceData({ ...invoiceData, cutoff: Number(e.target.value) })}
                                                />
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="row-acent-col">
                                        <th scope="row">Final Amount</th>
                                        <td>{calculateGrandTotal()}</td>
                                    </tr>

                                    {visibleFields.grndinword && (
                                        <tr className="row-acent-col">
                                            <th scope="row">In word</th>
                                            <td>{finalamntword}</td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>

                        </div>

                    </section>
                    <hr />
                    {visibleFields.pymntDetails && (
                        <section className="row d-flex align-items-center p-0 m-0 my-4">
                            <div className="col-6 px-0 me-auto">
                                <div className="py-2  fw-medium sec-head">Payment Info</div>
                                <table className="table table-sm table-bordered pymnt-table m-0">

                                    <tbody>

                                        <tr>
                                            <th scope="row">Payment Method</th>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={invoiceData.pymntmthd}
                                                    onChange={(e) => setInvoiceData({ ...invoiceData, pymntmthd: e.target.value })}
                                                >
                                                    <option value="">Payment method</option>
                                                    {[
                                                        "Credit Card",
                                                        "Debit Card",
                                                        "Cash",
                                                        "Check",
                                                        "Mobile Payment App",
                                                        "Digital Wallet",
                                                        "Cryptocurrency",
                                                        "Bank Transfer",
                                                        "Buy Now, Pay Later",
                                                        "Gift Card",
                                                        "Payment Plan",
                                                    ].map((method) => (
                                                        <option key={method} value={method}>{method}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>

                                        {visibleFields.pymntNumber && (
                                            <tr>
                                                <th scope="row">Card/Cheque Number</th>
                                                <td>
                                                    <input
                                                        type="text"

                                                        minLength="6"
                                                        maxLength="19"
                                                        className="form-control"
                                                        placeholder="Card/Cheque/Mobile/Bank/Account Number"
                                                        value={invoiceData.pymntNumber}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, pymntNumber: e.target.value })}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        )}

                                        {visibleFields.pymntAcdetails && (
                                            <tr>
                                                <th scope="row">Account Details</th>
                                                <td>
                                                    <input
                                                        type="text"

                                                        minLength="3"
                                                        maxLength="30"
                                                        className="form-control"
                                                        placeholder="Account Details"
                                                        value={invoiceData.pymntAcdetails}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, pymntAcdetails: e.target.value })}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        )}

                                        {visibleFields.pymntid && (
                                            <tr>
                                                <th scope="row">ID</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        minLength="3"
                                                        maxLength="30"
                                                        className="form-control"
                                                        placeholder="UPI / Transaction ID"
                                                        value={invoiceData.pymntid}
                                                        onChange={(e) => setInvoiceData({ ...invoiceData, pymntid: e.target.value })}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>

                            </div>
                        </section>
                    )}
                    {visibleFields.notes && (
                        <section className="row d-flex justify-content-start align-items-start p-0 m-0 my-3 mt-5">
                            <div className="col-xxl-6 frm-nts-con px-0">
                                <label htmlFor="frm-nts" className="py-2  fw-medium sec-head">Notes</label>
                                <textarea className="form-control frm-nts" placeholder="Leave a comment here" id="frm-nts" value={invoiceData.notes} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}></textarea>
                            </div>
                        </section>
                    )}

                    <section className="row d-flex justify-content-between align-items-start p-0 m-0 my-3 mt-5 gap-2">

                        {visibleFields.termscon && (
                            <div className="col-xxl-6 frm-nts-con px-0">
                                <label htmlFor="frm-t&c" className=" py-2  fw-medium sec-head">Terms & Condition</label>
                                <textarea className="form-control frm-nts" placeholder="Terms & Condition" id="frm-t&c" value={invoiceData.trmscon} onChange={(e) => setInvoiceData({ ...invoiceData, trmscon: e.target.value })}></textarea>
                            </div>
                        )}

                        {/* {visibleFields.signature && (
                            <div className="col-xxl-4 border border-dashed rounded p-4 text-center position-relative frm-sign-con ms-auto" style={{ minHeight: '150px' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleFileButton}
                                    className="btn brand-btn px-4 position-absolute top-50 start-50 translate-middle"
                                    style={{ fontSize: '24px' }}
                                >
                                    +
                                </button>
                            </div>
                        )} */}

                    </section>

                    <footer className="mt-5">
                        <div className="ftr-det d-flex justify-content-between align-items-center">
                            <div className="ftr-dis f-14">Payment due upon receipt. Thank you for your business!</div>
                            <div className="ftr-brnd-mark f-14">Generated by Quick Invoice</div>
                        </div>
                    </footer>

                </form>
            </div>

            {isModelOpen && (
                <div className="prompt-mdl d-flex justify-content-center align-items-center">
                    {isTmpltMdlOpen && (
                        <div className="mdl card">
                            <div className="card-header mdl-head d-flex justify-content-between align-items-center py-3">
                                <div className="f-20 fw-medium brand-link">Save Template</div>
                                <CloseIcon sx={{fontSize:34}} alt="Close Model" onClick={handlemdlstat}/>
                            </div>
                            <div className="card-body mdl-bd">
                                <input
                                    type="text"
                                    minLength="3"
                                    maxLength="15"
                                    className="form-control"
                                    placeholder="Template Name"
                                    value={templateData.templateName}
                                    onChange={(e) => setTemplateData({ ...templateData, templateName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="card-footer mdl-ft d-flex justify-content-center align-items-center py-3">
                                <button className="btn btn-warning px-4" onClick={handleSaveTemplateFinal}>Save</button>
                            </div>
                        </div>
                    )}
                    {isSaveMdlOpen && (
                        <div className="mdl card">
                            <div className="card-header mdl-head d-flex justify-content-between align-items-center py-3">
                                <div className="f-20 fw-medium brand-link">Save & Share invoice</div>
                                <CloseIcon sx={{fontSize:34}} alt="Close Model" onClick={handlemdlstat}/>
                            </div>
                            <div className="card-body mdl-bd">
                                <div className="f-18 text-center pb-3 gry-field">Do you want to save invoice ?</div>
                            </div>
                            <div className="card-footer mdl-ft d-flex justify-content-center align-items-center py-3 gap-3">
                                <button className="btn brand-btn btn-warning px-4 b-rd-8" onClick={handleConfirmSave}>Yes</button>
                                <button className="btn brand-btn btn-danger px-4 b-rd-8" onClick={handleDiscardInvcSave}>No</button>
                                <button
                                    className="btn brand-btn btn-success px-4 b-rd-8"
                                    onClick={handleShareInvoice}
                                    disabled={loadingShare}
                                >
                                    {loadingShare ? 'Sending...' : 'Share'}
                                </button>
                                {!isEditing && isPDFReady && (
                                    <PDFDownloadLink

                                        document={<InvoicePDF invoiceData={invoiceData} fieldsVisible={visibleFields} profileImage={profileImage} />}

                                        fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}

                                    >
                                        {({ loading, error }) => {
                                            if (error) {
                                                console.error("PDF generation error:", error);
                                            }
                                            return (
                                                <button className="btn brand-btn px-4" disabled={loading}>
                                                    {loading ? 'Loading...' : 'Download'}
                                                </button>
                                            );
                                        }}
                                    </PDFDownloadLink>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            )}

            {isTemplatePromptOpen && (
                <div className="prompt-mdl d-flex justify-content-center align-items-center">
                    <div className="mdl card" style={{ width: '400px' }}>
                        <div className="card-header mdl-head d-flex justify-content-between align-items-center py-3">
                            <div className="f-22">Save Template</div>
                            <CloseIcon sx={{fontSize:34}} alt="Close Model" onClick={handleCloseTemplatePrompt}/>
                        </div>
                        <div className="card-body mdl-bd p-4">
                            <div className="form-group">
                                <label htmlFor="templateName" className="mb-2">Template Name</label>
                                <input
                                    type="text"
                                    minLength="3"
                                    maxLength="15"
                                    id="templateName"
                                    className={`form-control ${templateNameError ? 'is-invalid' : ''}`}
                                    value={templateName}
                                    onChange={(e) => {
                                        setTemplateName(e.target.value);
                                        setTemplateNameError('');
                                    }}
                                    placeholder="Enter template name"
                                    required
                                />
                                {templateNameError && (
                                    <div className="invalid-feedback" style={{ display: 'block' }}>
                                        {templateNameError}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card-footer mdl-ft d-flex justify-content-center align-items-center py-3 gap-3">
                            <button className="btn btn-warning px-4" onClick={handleSaveTemplateFinal}>Save</button>
                            <button className="btn btn-danger px-4" onClick={handleCloseTemplatePrompt}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}


            <div className="sidepnl d-flex gap-0 flex-column p-0">

                <div className="selcttemplt sidepnlsec p-3">
                    <label className="form-label text-center">Select Template</label>
                    <select
                        value={selectedTemplate}
                        onChange={handleTemplateChange}
                        className="form-select"
                        style={{
                            cursor: 'pointer',
                            backgroundColor: 'var(--brand-primary-light)'
                        }}
                    >
                        <optgroup label="Basic Templates">
                            <option value="simple">Simple</option>
                            <option value="taxInvoice">Tax Invoice</option>
                            <option value="deliveryInvoice">Delivery Invoice</option>
                        </optgroup>
                        <optgroup
                            label="Premium Templates ✨"
                            style={{
                                color: vendorPlan === 'free' ? '#aaa' : 'inherit',
                                backgroundColor: vendorPlan === 'free' ? '#f5f5f5' : 'inherit'
                            }}
                        >
                            <option
                                value="professionalInvoice"
                                disabled={vendorPlan === 'free'}
                                style={vendorPlan === 'free' ? getOptionStyle('professionalInvoice') : {}}
                            >
                                Professional Invoice
                            </option>
                            <option
                                value="elegantInvoice"
                                disabled={vendorPlan === 'free'}
                                style={vendorPlan === 'free' ? getOptionStyle('elegantInvoice') : {}}
                            >
                                Elegant Invoice
                            </option>
                            <option
                                value="custom"
                                disabled={vendorPlan === 'free'}
                                style={vendorPlan === 'free' ? getOptionStyle('custom') : {}}
                            >
                                Custom
                            </option>
                        </optgroup>
                    </select>
                    {vendorPlan === 'free' && (
                        <small className="text-muted d-block mt-2">
                            ⭐ Upgrade to Premium - <span className="brand-link f-15" onClick={handlePricingRedirect}>See our Pricing</span>
                        </small>
                    )}
                </div>

                {selectedTemplate === "custom" ? (
                    <div className="prmcustfield sidepnlsec p-0 m-0 p-3 pt-0">
                        <div className="row justify-content-start align-items-center p-0 m-0 gy-3">
                            {Object.keys(templateFields.custom.visible).map((key) => {
                                const field = fields.find(f => f.key === key);
                                const isvisibeforaddon = visibleFields[key];
                                return (
                                    <div className="col-xxl-auto" key={key}>
                                        <button
                                            className={`btn brand-btn b-rd-8 w-100 addoncustbtn ${isvisibeforaddon ? 'vsbladdonbtn' : ''} `}
                                            onClick={() => toggleField(key)}
                                        >
                                            {field ? field.label : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="prmcustfield sidepnlsec p-0 m-0 p-3 pt-0">
                        {/* blank */}
                    </div>
                )}

                <div className="actionmenu p-3 d-flex flex-column justify-content-center align-items-center gap-2">

                    <button className="btn brand-btn px-4" onClick={handleSaveTemplate} disabled={!hasFieldVisibilityChanged}>Save Template</button>

                    <button type="submit" className="btn brand-btn px-4" onClick={handlePrepareInvoice} disabled={!isGenerateEnabled}>Prepare Invoice</button>

                </div>

            </div>

        </div>
    );
};

export default Engine;