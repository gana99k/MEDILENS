const I18N = {
  en: {
    loginEyebrow: "PRIVATE HEALTH WORKSPACE", loginHeading: "Your health records, in one clear place.", loginBlurb: "Understand what your documents say, review every extracted detail, and keep a simple timeline of your care.",
    loginFeature: "Structured records are stored in Supabase; uploaded files stay on this server.", loginWelcome: "Welcome to MedLens", loginPrompt: "Continue into the sample health workspace. No credentials are needed for this prototype.",
    demoPatientName: "Aarav Sharma", demoPatientDetails: "Fictional demo patient · Sample records", continueDemo: "Continue as demo patient",
    loginWarning: "Prototype access only — this is not authentication. Anyone who can open this app can use its API and access its demo data.",
    loginPrivacy: "Use fictional records only. Do not expose publicly or enter real patient information.",
    loginFooter: "AI health information organizer · Not a medical device", signOut: "Sign out",
    workspace: "WORKSPACE", overview: "Overview", records: "My records", timeline: "Health timeline",
    profile: "Health profile", privateByDesign: "Supabase database", localStorageCopy: "Structured health records are stored in the configured Supabase database; uploaded files remain on this server.",
    localStorage: "SUPABASE DATABASE", demoPatient: "Demo patient", demoEnvironment: "DEMO ENVIRONMENT",
    greeting: "Good morning, Aarav", overviewSub: "Your health information, organized in one calm, clear place.",
    uploadRecord: "Upload a record", viewTimeline: "View timeline", abhaTitle: "Your health records, connected",
    abhaCopy: "Add a fictional ABHA ID to preview it in this FHIR-style profile. No ABDM connection or record import is made.",
    linkAbha: "Link demo ABHA", simulated: "SIMULATION ONLY", recordsOnFile: "Records on file", labResults: "Lab results",
    medicines: "Medicines recorded", itemsToReview: "Needs your review", documents: "documents", observations: "observations",
    extractedFromRecords: "from confirmed records", pendingReview: "Awaiting confirmation", recentRecords: "Recent records",
    recentRecordsSub: "Your latest uploaded and demo documents", viewAll: "View all", healthNotes: "Health notes",
    valueOutsideRange: "Outside printed range", cholesterolNote: "Your report lists total cholesterol at {value} {unit}; the report's guide is {range}. A result outside a guide is not a diagnosis.",
    noteDisclaimer: "Ask your clinician how this fits your health history. Do not change treatment based on this summary.",
    trendTitle: "Total cholesterol", trendSubtitle: "Values as written in your reports", demoData: "SAMPLE DATA",
    trendHelper: "One recorded result", trendResults: "{count} results across your records",
    recentTimeline: "Recent timeline", noRecords: "No records yet", noRecordsCopy: "Upload a PDF or image to start building your health timeline.",
    confirmed: "Reviewed", needsReview: "Review needed", document: "Document", openRecord: "Open record",
    recordsTitle: "Your records", recordsSub: "Medical documents and the structured information reviewed from them.",
    searchRecords: "Search records...", allTypes: "All record types", lab: "Lab report", prescription: "Prescription",
    discharge: "Discharge summary", other: "Other", sortNewest: "Newest first", lowConfidence: "Low confidence",
    timelineTitle: "Your health timeline", timelineSub: "A chronological view of visits, reports, medicines, and recorded results.",
    allEvents: "All events", visits: "Visits", reports: "Reports", medicinesFilter: "Medicines", results: "Test results",
    profileTitle: "Your health profile", profileSub: "A consolidated view of information from the records you have reviewed.",
    personalDetails: "Personal details", sampleProfile: "Sample profile", name: "Name", birthDate: "Date of birth",
    gender: "Gender", location: "Location", abhaId: "ABHA ID (simulated)", resourceOverview: "FHIR-style profile",
    exportFhir: "Export FHIR bundle", currentMedicines: "Recorded medicines", labTrends: "Lab trends",
    labTrendsSub: "A simple comparison of values and dates in the records you confirmed.",
    oneResult: "Only one result recorded", notComparable: "Only directly comparable results are connected. This chart is informational, not a clinical assessment.",
    footerDisclaimer: "MedLens is an information organizer, not a medical device. AI summaries can be wrong — verify records with your care team.",
    learnMore: "Learn more", uploaded: "Uploaded", uploadFail: "Upload failed", saveReview: "Confirm reviewed record",
    cancel: "Cancel", add: "Add", addMedicine: "Add medicine", addObservation: "Add result", addDiagnosis: "Add diagnosis",
    reviewTitle: "Review extracted details", reviewSub: "Check every extracted field against the original document. Nothing is confirmed automatically.",
    reviewWarning: "AI and OCR can misread medical records. Correct all names, dates, doses, units, and ranges before saving.",
    confidence: "Extraction confidence", lowConfNotice: "Low confidence — carefully verify each field. Unreadable text may be missing.",
    title: "Record title", recordType: "Record type", recordDate: "Document date", explanationEn: "Plain-language summary (English)",
    explanationHi: "Plain-language summary (Hindi)", explanationMr: "Plain-language summary (Marathi)",
    explanationTa: "Plain-language summary (Tamil)", explanationTe: "Plain-language summary (Telugu)",
    medicinesSection: "Medicines as written", testValues: "Test results and reference ranges",
    diagnosesSection: "Documented diagnoses / impressions", medicineName: "Name", dosage: "Dose", instructions: "Instructions",
    testName: "Test", value: "Value", unit: "Unit", low: "Low", high: "High", reference: "Reference range (as printed)",
    reviewDisclaimer: "Safety check: summaries describe what a document says; they do not diagnose or recommend treatment. Please check uncertain details with your clinician.",
    sourceScan: "Original document", noSummary: "No summary was generated. Please review the extracted fields manually.",
    extractedData: "Extracted details", editRecord: "Edit reviewed data", deleteRecord: "Delete record", deleteConfirm: "Delete this record and its structured entries from this device?",
    medication: "Medicine", noValues: "No test values were extracted.", noMedicines: "No medicines were extracted.", noDiagnosis: "No documented diagnoses were extracted.",
    resultFlagHigh: "Above printed range", resultFlagLow: "Below printed range", withinRange: "Within printed range",
    recordSaved: "Record reviewed and added to your profile.", recordDeleted: "Record deleted.", confirmDelete: "Delete record",
    uploadModalTitle: "Add a health record", uploadModalSub: "Upload a prescription, lab report, discharge summary, or other medical document.",
    dropText: "Drop your document here, or browse files", browse: "Choose a file", uploadFormats: "PDF, PNG, JPG, WEBP, or TIFF · up to {max_mb} MB",
    processing: "Reading document and extracting details…", processingProgress: "Uploading and processing", uploadPrivacy: "Sensitive health information. Structured records are stored in Supabase; uploaded files are stored on this server. If an AI provider is configured, the document is also sent to that provider for extraction.",
    aiConfigured: "AI extraction is configured", localExtraction: "Local OCR and conservative extraction only",
    abhaModalTitle: "Simulated ABHA link", abhaModalSub: "Preview how an ABHA identifier could connect to a patient profile.",
    abhaWarning: "Simulation only: this does not verify an ABHA ID or connect to ABDM. Use a fictional demo ID only.",
    abhaNumber: "Fictional 14-digit demo ID", saveSimulation: "Save simulated link", abhaSaved: "Demo ABHA ID linked (simulation only).",
    emptySearch: "No matching records", emptyTimeline: "No events in this filter", edit: "Edit", close: "Close",
    source: "Source", summary: "Plain-language summary", capturedValues: "Recorded results", status: "Status",
    uploadError: "Could not process this file. Please try a clearer PDF or image.", ocrError: "OCR could not read text. You can still enter details manually.",
    warning: "Processing note", aiDisclaimer: "AI-generated summary — check it against the original and discuss questions with your care team.",
    reviewing: "Review needed", resultCount: "results", helpSummary: "The summary should explain only what the source says, not add a new diagnosis or care instruction.",
    unsupported: "Choose a PDF or supported image file.", pageLoading: "Loading your Supabase health profile…",
    abhaImported: "This simulation does not import live records. The seeded demo records above illustrate a connected profile.",
    typeLab: "Laboratory report", typePrescription: "Prescription", typeDischarge: "Discharge summary",
    viewDocument: "View uploaded document", noFilePreview: "The original file is available in this local demo."
  },
  mr: {
    loginEyebrow: "खासगी आरोग्य कार्यक्षेत्र", loginHeading: "तुमचे आरोग्यविषयक दस्तऐवज, एका स्पष्ट जागी.", loginBlurb: "दस्तऐवजात काय लिहिले आहे ते समजून घ्या, काढलेली माहिती तपासा आणि आरोग्यसेवेची सोपी कालरेषा पहा.",
    loginFeature: "संरचित नोंदी Supabase मध्ये; अपलोड केलेल्या फाइल्स या सर्व्हरवर साठवल्या जातात.", loginWelcome: "MedLens मध्ये स्वागत आहे",     loginPrompt: "नमुना आरोग्य कार्यक्षेत्र उघडण्यासाठी अॅपचा पासवर्ड टाका.",
    demoPatientName: "आरव शर्मा", demoPatientDetails: "काल्पनिक डेमो रुग्ण · नमुना रेकॉर्ड", continueDemo: "साइन इन",
    loginWarning: "फक्त प्रोटोटाइप प्रवेश — हे प्रमाणीकरण नाही. अॅप उघडू शकणारी व्यक्ती API आणि डेमो माहिती वापरू शकते.",
    loginPrivacy: "फक्त काल्पनिक नोंदी वापरा. सार्वजनिकरित्या उघड करू नका किंवा रुग्णांची खरी माहिती टाकू नका.",
    loginFooter: "AI आरोग्य-माहिती आयोजक · वैद्यकीय उपकरण नाही", signOut: "साइन आउट",
    workspace: "कार्यस्थळ", overview: "आढावा", records: "माझे रेकॉर्ड", timeline: "आरोग्य कालरेषा", profile: "आरोग्य प्रोफाइल",
    privateByDesign: "Supabase डेटाबेस", localStorageCopy: "संरचित आरोग्य-नोंदी जोडलेल्या Supabase डेटाबेसमध्ये; अपलोड केलेल्या फाइल्स या सर्व्हरवर साठवल्या जातात.", localStorage: "SUPABASE डेटाबेस",
    demoPatient: "डेमो रुग्ण", demoEnvironment: "डेमो वातावरण", greeting: "शुभ सकाळ, आरव", overviewSub: "तुमची आरोग्य-माहिती एका स्पष्ट आणि सुटसुटीत जागी.",
    uploadRecord: "रेकॉर्ड अपलोड करा", viewTimeline: "कालरेषा पहा", abhaTitle: "तुमचे आरोग्य रेकॉर्ड, एकत्र",
    abhaCopy: "या FHIR-शैलीच्या प्रोफाइलमध्ये नमुना पाहण्यासाठी काल्पनिक ABHA ID जोडा. ABDM शी संपर्क किंवा रेकॉर्ड आयात होत नाही.",
    linkAbha: "डेमो ABHA जोडा", simulated: "फक्त सिम्युलेशन", recordsOnFile: "उपलब्ध रेकॉर्ड", labResults: "लॅब परिणाम",
    medicines: "नोंदवलेली औषधे", itemsToReview: "तुमची तपासणी बाकी", documents: "दस्तऐवज", observations: "निरीक्षणे",
    extractedFromRecords: "पुष्टी केलेल्या रेकॉर्डमधून", pendingReview: "पुष्टी बाकी", recentRecords: "अलीकडील रेकॉर्ड",
    recentRecordsSub: "तुमचे अलीकडे अपलोड केलेले आणि डेमो दस्तऐवज", viewAll: "सर्व पहा", healthNotes: "आरोग्य नोंदी",
    valueOutsideRange: "छापील मर्यादेबाहेर", cholesterolNote: "अहवालात एकूण कोलेस्टेरॉल {value} {unit} आहे; अहवालातील मार्गदर्शक मर्यादा {range} आहे. मर्यादेबाहेरील परिणाम म्हणजे निदान नव्हे.",
    noteDisclaimer: "तुमच्या आरोग्याच्या इतिहासानुसार याचा अर्थ डॉक्टरांना विचारा. या सारांशावरून उपचार बदलू नका.",
    trendTitle: "एकूण कोलेस्टेरॉल", trendSubtitle: "अहवालांमध्ये नोंदवलेली मूल्ये", demoData: "नमुना माहिती",
    trendHelper: "एक नोंदवलेला परिणाम", trendResults: "रेकॉर्डमधील {count} परिणाम", recentTimeline: "अलीकडील कालरेषा",
    noRecords: "अद्याप रेकॉर्ड नाहीत", noRecordsCopy: "आरोग्य कालरेषा सुरू करण्यासाठी PDF किंवा प्रतिमा अपलोड करा.",
    confirmed: "तपासले", needsReview: "तपासणी आवश्यक", document: "दस्तऐवज", openRecord: "रेकॉर्ड उघडा",
    recordsTitle: "तुमचे रेकॉर्ड", recordsSub: "वैद्यकीय दस्तऐवज आणि त्यातून काढलेली तपासलेली माहिती.",
    searchRecords: "रेकॉर्ड शोधा...", allTypes: "सर्व रेकॉर्ड प्रकार", lab: "लॅब अहवाल", prescription: "प्रिस्क्रिप्शन",
    discharge: "डिस्चार्ज सारांश", other: "इतर", sortNewest: "नवीनतम आधी", lowConfidence: "कमी विश्वासार्हता",
    timelineTitle: "तुमची आरोग्य कालरेषा", timelineSub: "भेटी, अहवाल, औषधे आणि नोंदवलेल्या परिणामांचा कालानुक्रम.",
    allEvents: "सर्व घटना", visits: "भेटी", reports: "अहवाल", medicinesFilter: "औषधे", results: "तपासणी परिणाम",
    profileTitle: "तुमचे आरोग्य प्रोफाइल", profileSub: "तुम्ही तपासलेल्या रेकॉर्डमधील माहितीचा एकत्रित आढावा.",
    personalDetails: "वैयक्तिक तपशील", sampleProfile: "नमुना प्रोफाइल", name: "नाव", birthDate: "जन्मतारीख", gender: "लिंग",
    location: "ठिकाण", abhaId: "ABHA ID (सिम्युलेटेड)", resourceOverview: "FHIR-शैली प्रोफाइल", exportFhir: "FHIR बंडल निर्यात करा",
    currentMedicines: "नोंदवलेली औषधे", labTrends: "लॅबमधील बदल", labTrendsSub: "तुम्ही पुष्टी केलेल्या रेकॉर्डमधील मूल्ये आणि तारखांची तुलना.",
    oneResult: "फक्त एक परिणाम नोंदवला आहे", notComparable: "फक्त थेट तुलना करता येणारे परिणाम जोडले आहेत. हा चार्ट माहितीसाठी आहे; वैद्यकीय मूल्यांकन नाही.",
    footerDisclaimer: "MedLens हा आरोग्य-माहिती आयोजक आहे, वैद्यकीय उपकरण नाही. AI सारांश चुकीचा असू शकतो — आरोग्यसेवा पथकाशी पडताळा.",
    learnMore: "अधिक जाणून घ्या", uploadFail: "अपलोड अयशस्वी", saveReview: "तपासलेला रेकॉर्ड पुष्टी करा", cancel: "रद्द करा",
    addMedicine: "औषध जोडा", addObservation: "परिणाम जोडा", addDiagnosis: "निदान जोडा",
    reviewTitle: "काढलेल्या तपशीलांची तपासणी करा", reviewSub: "प्रत्येक तपशील मूळ दस्तऐवजाशी तपासा. काहीही आपोआप पुष्टी होत नाही.",
    reviewWarning: "AI आणि OCR वैद्यकीय रेकॉर्ड चुकीचे वाचू शकतात. जतन करण्यापूर्वी नावे, तारखा, मात्रा, एकके आणि मर्यादा तपासा.",
    confidence: "माहिती काढण्याचा विश्वास", lowConfNotice: "विश्वास कमी — प्रत्येक तपशील काळजीपूर्वक तपासा. अस्पष्ट मजकूर सुटला असू शकतो.",
    title: "रेकॉर्डचे शीर्षक", recordType: "रेकॉर्डचा प्रकार", recordDate: "दस्तऐवजाची तारीख",
    explanationEn: "सोप्या भाषेतील सारांश (इंग्रजी)", explanationHi: "सोप्या भाषेतील सारांश (हिंदी)",
    explanationMr: "सोप्या भाषेतील सारांश (मराठी)", explanationTa: "सोप्या भाषेतील सारांश (तमिळ)", explanationTe: "सोप्या भाषेतील सारांश (तेलुगू)",
    medicinesSection: "दस्तऐवजात लिहिलेली औषधे", testValues: "तपासणी परिणाम आणि संदर्भ मर्यादा",
    diagnosesSection: "दस्तऐवजात नोंदवलेले निदान / निष्कर्ष", medicineName: "नाव", dosage: "मात्रा", instructions: "सूचना",
    testName: "तपासणी", value: "मूल्य", unit: "एकक", low: "किमान", high: "कमाल", reference: "संदर्भ मर्यादा (छापल्याप्रमाणे)",
    reviewDisclaimer: "सुरक्षा: सारांश दस्तऐवजात काय लिहिले आहे ते सांगतात; ते निदान किंवा उपचारांचा सल्ला देत नाहीत. शंका डॉक्टरांना विचारा.",
    source: "स्रोत", summary: "सोप्या भाषेतील सारांश", capturedValues: "नोंदवलेले परिणाम", status: "स्थिती",
    editRecord: "तपासलेली माहिती बदला", deleteRecord: "रेकॉर्ड हटवा", deleteConfirm: "या उपकरणातून हा रेकॉर्ड आणि संबंधित नोंदी हटवायच्या?",
    medication: "औषध", noValues: "तपासणीचे परिणाम मिळाले नाहीत.", noMedicines: "औषधे मिळाली नाहीत.", noDiagnosis: "नोंदवलेले निदान मिळाले नाही.",
    resultFlagHigh: "छापील मर्यादेपेक्षा जास्त", resultFlagLow: "छापील मर्यादेपेक्षा कमी", withinRange: "छापील मर्यादेत",
    recordSaved: "रेकॉर्ड तपासून प्रोफाइलमध्ये जोडला.", recordDeleted: "रेकॉर्ड हटवला.", confirmDelete: "रेकॉर्ड हटवा", close: "बंद करा",
    uploadModalTitle: "आरोग्य रेकॉर्ड जोडा", uploadModalSub: "प्रिस्क्रिप्शन, लॅब अहवाल, डिस्चार्ज सारांश किंवा इतर वैद्यकीय दस्तऐवज अपलोड करा.",
    dropText: "दस्तऐवज येथे सोडा किंवा फाइल निवडा", browse: "फाइल निवडा", uploadFormats: "PDF, PNG, JPG, WEBP किंवा TIFF · कमाल {max_mb} MB",
    processing: "दस्तऐवज वाचून माहिती काढत आहे…", uploadPrivacy: "संवेदनशील आरोग्य-माहितीचे संरचित रेकॉर्ड Supabase मध्ये आणि अपलोड केलेल्या फाइल्स या सर्व्हरवर साठवल्या जातात. AI प्रदाता जोडल्यास दस्तऐवज त्यालाही पाठवला जातो.",
    aiConfigured: "AI माहिती-काढणी सेट केली आहे", localExtraction: "फक्त स्थानिक OCR आणि मर्यादित माहिती-काढणी",
    abhaModalTitle: "सिम्युलेटेड ABHA लिंक", abhaModalSub: "ABHA ओळख रुग्णाच्या प्रोफाइलशी कशी जोडली जाऊ शकते ते पहा.",
    abhaWarning: "फक्त सिम्युलेशन: ABHA ID पडताळली जात नाही आणि ABDM शी संपर्क होत नाही. फक्त काल्पनिक डेमो ID वापरा.",
    abhaNumber: "काल्पनिक 14-अंकी डेमो ID", saveSimulation: "सिम्युलेटेड लिंक जतन करा", abhaSaved: "डेमो ABHA ID जोडली (फक्त सिम्युलेशन).",
    emptySearch: "जुळणारे रेकॉर्ड नाहीत", emptyTimeline: "या फिल्टरमध्ये घटना नाहीत", uploaded: "अपलोड झाले",
    uploadError: "फाइलवर प्रक्रिया करता आली नाही. अधिक स्पष्ट PDF किंवा प्रतिमा वापरून पहा.",
    warning: "प्रक्रिया नोंद", aiDisclaimer: "AI सारांश — मूळाशी तपासा आणि प्रश्न आरोग्यसेवा पथकाशी चर्चा करा.",
    helpSummary: "सारांशाने फक्त स्रोतामध्ये काय आहे ते समजावावे; नवीन निदान किंवा उपचार सूचना जोडू नयेत.",
    unsupported: "PDF किंवा समर्थित प्रतिमा निवडा.", pageLoading: "तुमचे स्थानिक आरोग्य प्रोफाइल लोड होत आहे…",
    abhaImported: "या सिम्युलेशनमध्ये प्रत्यक्ष रेकॉर्ड आयात होत नाहीत. नमुना डेमो रेकॉर्ड जोडलेल्या प्रोफाइलचे उदाहरण आहेत.",
    viewDocument: "अपलोड केलेला दस्तऐवज पहा"
  },
  ta: {
    loginEyebrow: "தனிப்பட்ட சுகாதாரப் பகுதி", loginHeading: "உங்கள் சுகாதாரப் பதிவுகள், ஒரே தெளிவான இடத்தில்.", loginBlurb: "ஆவணங்களில் உள்ளதைப் புரிந்துகொள்ளுங்கள், பிரித்தெடுத்த விவரங்களைச் சரிபாருங்கள், உங்கள் பராமரிப்பின் எளிய காலவரிசையைப் பாருங்கள்.",
    loginFeature: "கட்டமைக்கப்பட்ட பதிவுகள் Supabase-லும், பதிவேற்றிய கோப்புகள் இந்தச் சேவையகத்திலும் சேமிக்கப்படும்.", loginWelcome: "MedLens-க்கு வரவேற்கிறோம்", loginPrompt: "மாதிரி சுகாதாரப் பகுதியைத் திறக்க பயன்பாட்டு கடவுச்சொல்லை உள்ளிடவும்.",
    demoPatientName: "ஆரவ் சர்மா", demoPatientDetails: "கற்பனை டெமோ நோயாளர் · மாதிரி பதிவுகள்", continueDemo: "உள்நுழைக",
    loginWarning: "முன்மாதிரி அணுகல் மட்டுமே — இது அங்கீகாரம் அல்ல. பயன்பாட்டைத் திறக்கக்கூடிய எவரும் API மற்றும் டெமோ தரவை அணுகலாம்.",
    loginPrivacy: "கற்பனை பதிவுகளை மட்டும் பயன்படுத்தவும். பொதுவாக வெளியிடவோ உண்மையான நோயாளர் தகவலை உள்ளிடவோ வேண்டாம்.",
    loginFooter: "AI சுகாதாரத் தகவல் ஒழுங்குபடுத்தி · மருத்துவச் சாதனம் அல்ல", signOut: "வெளியேறு",
    workspace: "பணியிடம்", overview: "கண்ணோட்டம்", records: "எனது பதிவுகள்", timeline: "சுகாதார காலவரிசை", profile: "சுகாதார விவரம்",
    privateByDesign: "Supabase தரவுத்தளம்", localStorageCopy: "கட்டமைக்கப்பட்ட சுகாதாரப் பதிவுகள் Supabase தரவுத்தளத்திலும், பதிவேற்றிய கோப்புகள் இந்தச் சேவையகத்திலும் சேமிக்கப்படும்.", localStorage: "SUPABASE தரவுத்தளம்",
    demoPatient: "டெமோ நோயாளர்", demoEnvironment: "டெமோ சூழல்", greeting: "காலை வணக்கம், ஆரவ்", overviewSub: "உங்கள் சுகாதாரத் தகவல்கள் ஒரே தெளிவான இடத்தில் ஒழுங்குபடுத்தப்பட்டுள்ளன.",
    uploadRecord: "பதிவை பதிவேற்றவும்", viewTimeline: "காலவரிசையைப் பார்க்கவும்", abhaTitle: "உங்கள் சுகாதாரப் பதிவுகள், இணைக்கப்பட்டுள்ளன",
    abhaCopy: "இந்த FHIR-பாணி சுயவிவரத்தில் பார்க்க கற்பனை ABHA ID-ஐச் சேர்க்கவும். ABDM இணைப்போ பதிவிறக்கமோ நடைபெறாது.",
    linkAbha: "டெமோ ABHA-ஐ இணைக்கவும்", simulated: "உருவகம் மட்டுமே", recordsOnFile: "உள்ள பதிவுகள்", labResults: "ஆய்வக முடிவுகள்",
    medicines: "பதிவுசெய்த மருந்துகள்", itemsToReview: "உங்கள் சரிபார்ப்பு தேவை", documents: "ஆவணங்கள்", observations: "கவனிப்புகள்",
    extractedFromRecords: "உறுதிப்படுத்திய பதிவுகளிலிருந்து", pendingReview: "உறுதிப்படுத்த காத்திருக்கிறது", recentRecords: "சமீபத்திய பதிவுகள்",
    recentRecordsSub: "சமீபத்தில் பதிவேற்றிய மற்றும் டெமோ ஆவணங்கள்", viewAll: "அனைத்தையும் காண்க", healthNotes: "சுகாதாரக் குறிப்புகள்",
    valueOutsideRange: "அச்சிடப்பட்ட வரம்புக்கு வெளியே", cholesterolNote: "உங்கள் அறிக்கையில் மொத்த கொலஸ்ட்ரால் {value} {unit}; அறிக்கையின் வழிகாட்டி {range}. வரம்புக்கு வெளியான முடிவு மட்டும் நோயறிதல் அல்ல.",
    noteDisclaimer: "உங்கள் உடல்நல வரலாற்றின் அடிப்படையில் மருத்துவரிடம் கேளுங்கள். இந்தச் சுருக்கத்தின் அடிப்படையில் சிகிச்சையை மாற்ற வேண்டாம்.",
    trendTitle: "மொத்த கொலஸ்ட்ரால்", trendSubtitle: "அறிக்கைகளில் உள்ள மதிப்புகள்", demoData: "மாதிரி தரவு",
    trendHelper: "ஒரு முடிவு பதிவாகியுள்ளது", trendResults: "உங்கள் பதிவுகளில் {count} முடிவுகள்", recentTimeline: "சமீபத்திய காலவரிசை",
    noRecords: "இன்னும் பதிவுகள் இல்லை", noRecordsCopy: "உங்கள் சுகாதார காலவரிசையைத் தொடங்க PDF அல்லது படத்தைப் பதிவேற்றவும்.",
    confirmed: "சரிபார்க்கப்பட்டது", needsReview: "சரிபார்ப்பு தேவை", document: "ஆவணம்", openRecord: "பதிவைத் திறக்கவும்",
    recordsTitle: "உங்கள் பதிவுகள்", recordsSub: "மருத்துவ ஆவணங்களும் அவற்றிலிருந்து சரிபார்க்கப்பட்ட தகவல்களும்.",
    searchRecords: "பதிவுகளைத் தேடவும்...", allTypes: "அனைத்து வகைகளும்", lab: "ஆய்வக அறிக்கை", prescription: "மருந்துச் சீட்டு",
    discharge: "வெளியேற்றச் சுருக்கம்", other: "மற்றவை", sortNewest: "புதியவை முதலில்", lowConfidence: "குறைந்த நம்பகத்தன்மை",
    timelineTitle: "உங்கள் சுகாதார காலவரிசை", timelineSub: "சந்திப்புகள், அறிக்கைகள், மருந்துகள், பதிவுசெய்த முடிவுகளின் காலவரிசை.",
    allEvents: "அனைத்து நிகழ்வுகள்", visits: "சந்திப்புகள்", reports: "அறிக்கைகள்", medicinesFilter: "மருந்துகள்", results: "பரிசோதனை முடிவுகள்",
    profileTitle: "உங்கள் சுகாதார விவரம்", profileSub: "நீங்கள் சரிபார்த்த பதிவுகளிலிருந்து ஒருங்கிணைக்கப்பட்ட தகவல்கள்.",
    personalDetails: "தனிப்பட்ட விவரங்கள்", sampleProfile: "மாதிரி சுயவிவரம்", name: "பெயர்", birthDate: "பிறந்த தேதி", gender: "பாலினம்",
    location: "இடம்", abhaId: "ABHA ID (உருவகம்)", resourceOverview: "FHIR-பாணி சுயவிவரம்", exportFhir: "FHIR தொகுப்பை ஏற்றுமதி",
    currentMedicines: "பதிவுசெய்த மருந்துகள்", labTrends: "ஆய்வகப் போக்குகள்", labTrendsSub: "உறுதிப்படுத்திய பதிவுகளில் உள்ள மதிப்புகள் மற்றும் தேதிகளின் ஒப்பீடு.",
    oneResult: "ஒரே ஒரு முடிவு பதிவாகியுள்ளது", notComparable: "நேரடியாக ஒப்பிடக்கூடிய முடிவுகள் மட்டுமே இணைக்கப்பட்டுள்ளன. இது தகவலுக்கானது; மருத்துவ மதிப்பீடு அல்ல.",
    footerDisclaimer: "MedLens தகவல் ஒழுங்குபடுத்தி; மருத்துவச் சாதனம் அல்ல. AI சுருக்கம் தவறாக இருக்கலாம் — உங்கள் சிகிச்சைக் குழுவிடம் சரிபாருங்கள்.",
    learnMore: "மேலும் அறிக", uploadFail: "பதிவேற்றம் தோல்வியடைந்தது", saveReview: "சரிபார்த்த பதிவை உறுதிப்படுத்தவும்", cancel: "ரத்து",
    addMedicine: "மருந்தைச் சேர்க்கவும்", addObservation: "முடிவைச் சேர்க்கவும்", addDiagnosis: "நோயறிதலைச் சேர்க்கவும்",
    reviewTitle: "பிரித்தெடுத்த விவரங்களைச் சரிபார்க்கவும்", reviewSub: "ஒவ்வொரு விவரத்தையும் மூல ஆவணத்துடன் சரிபாருங்கள். எதுவும் தானாக உறுதிப்படுத்தப்படாது.",
    reviewWarning: "AI மற்றும் OCR மருத்துவப் பதிவுகளைத் தவறாகப் படிக்கலாம். சேமிப்பதற்கு முன் பெயர், தேதி, அளவு, அலகு, வரம்பைச் சரிசெய்யுங்கள்.",
    confidence: "பிரித்தெடுத்த நம்பகத்தன்மை", lowConfNotice: "நம்பகத்தன்மை குறைவு — ஒவ்வொரு விவரத்தையும் சரிபாருங்கள். தெளிவில்லாத உரை விடுபட்டிருக்கலாம்.",
    title: "பதிவின் தலைப்பு", recordType: "பதிவின் வகை", recordDate: "ஆவணத் தேதி",
    explanationEn: "எளிய மொழிச் சுருக்கம் (ஆங்கிலம்)", explanationHi: "எளிய மொழிச் சுருக்கம் (இந்தி)",
    explanationMr: "எளிய மொழிச் சுருக்கம் (மராத்தி)", explanationTa: "எளிய மொழிச் சுருக்கம் (தமிழ்)", explanationTe: "எளிய மொழிச் சுருக்கம் (தெலுங்கு)",
    medicinesSection: "ஆவணத்தில் உள்ள மருந்துகள்", testValues: "பரிசோதனை முடிவுகள் மற்றும் குறிப்பு வரம்புகள்",
    diagnosesSection: "ஆவணத்தில் பதிவுசெய்த நோயறிதல் / கருத்துகள்", medicineName: "பெயர்", dosage: "அளவு", instructions: "வழிமுறைகள்",
    testName: "பரிசோதனை", value: "மதிப்பு", unit: "அலகு", low: "குறைந்தபட்சம்", high: "அதிகபட்சம்", reference: "குறிப்பு வரம்பு (அச்சிட்டபடி)",
    reviewDisclaimer: "பாதுகாப்பு: சுருக்கங்கள் ஆவணத்தில் உள்ளதை விவரிக்கின்றன; நோயறிதலோ சிகிச்சைப் பரிந்துரையோ அல்ல. சந்தேகங்களை மருத்துவரிடம் கேளுங்கள்.",
    source: "மூலம்", summary: "எளிய மொழிச் சுருக்கம்", capturedValues: "பதிவுசெய்த முடிவுகள்", status: "நிலை",
    editRecord: "சரிபார்த்த விவரங்களைத் திருத்தவும்", deleteRecord: "பதிவை நீக்கவும்", deleteConfirm: "இந்தச் சாதனத்திலிருந்து இந்தப் பதிவையும் தொடர்புடைய பதிவுகளையும் நீக்கவா?",
    medication: "மருந்து", noValues: "பரிசோதனை முடிவுகள் பிரித்தெடுக்கப்படவில்லை.", noMedicines: "மருந்துகள் பிரித்தெடுக்கப்படவில்லை.", noDiagnosis: "நோயறிதல் விவரங்கள் பிரித்தெடுக்கப்படவில்லை.",
    resultFlagHigh: "அச்சிட்ட வரம்புக்கு மேல்", resultFlagLow: "அச்சிட்ட வரம்புக்குக் கீழ்", withinRange: "அச்சிட்ட வரம்பிற்குள்",
    recordSaved: "பதிவு சரிபார்க்கப்பட்டு சுயவிவரத்தில் சேர்க்கப்பட்டது.", recordDeleted: "பதிவு நீக்கப்பட்டது.", confirmDelete: "பதிவை நீக்கவும்", close: "மூடு",
    uploadModalTitle: "சுகாதாரப் பதிவைச் சேர்க்கவும்", uploadModalSub: "மருந்துச் சீட்டு, ஆய்வக அறிக்கை, வெளியேற்றச் சுருக்கம் அல்லது பிற மருத்துவ ஆவணத்தைப் பதிவேற்றவும்.",
    dropText: "ஆவணத்தை இங்கே விடவும் அல்லது கோப்பைத் தேர்ந்தெடுக்கவும்", browse: "கோப்பைத் தேர்ந்தெடுக்கவும்", uploadFormats: "PDF, PNG, JPG, WEBP அல்லது TIFF · அதிகபட்சம் {max_mb} MB",
    processing: "ஆவணத்தைப் படித்து விவரங்களைப் பிரித்தெடுக்கிறது…", uploadPrivacy: "கட்டமைக்கப்பட்ட சுகாதாரப் பதிவுகள் Supabase-லும், பதிவேற்றிய கோப்புகள் இந்தச் சேவையகத்திலும் சேமிக்கப்படும். AI சேவை அமைக்கப்பட்டால், ஆவணம் அதற்கும் அனுப்பப்படும்.",
    aiConfigured: "AI பிரித்தெடுத்தல் அமைக்கப்பட்டுள்ளது", localExtraction: "உள்ளூர் OCR மற்றும் வரையறுக்கப்பட்ட பிரித்தெடுத்தல் மட்டும்",
    abhaModalTitle: "உருவக ABHA இணைப்பு", abhaModalSub: "ABHA அடையாளம் நோயாளர் சுயவிவரத்துடன் எப்படிச் சேரலாம் என்பதைப் பாருங்கள்.",
    abhaWarning: "உருவகம் மட்டுமே: ABHA ID சரிபார்க்கப்படாது; ABDM இணைப்பும் இல்லை. கற்பனை டெமோ ID-ஐ மட்டும் பயன்படுத்தவும்.",
    abhaNumber: "கற்பனை 14 இலக்க டெமோ ID", saveSimulation: "உருவக இணைப்பைச் சேமிக்கவும்", abhaSaved: "டெமோ ABHA ID இணைக்கப்பட்டது (உருவகம் மட்டுமே).",
    emptySearch: "பொருந்தும் பதிவுகள் இல்லை", emptyTimeline: "இந்த வடிகட்டியில் நிகழ்வுகள் இல்லை", uploaded: "பதிவேற்றப்பட்டது",
    uploadError: "இந்தக் கோப்பைச் செயலாக்க முடியவில்லை. தெளிவான PDF அல்லது படத்தை முயற்சிக்கவும்.",
    warning: "செயலாக்கக் குறிப்பு", aiDisclaimer: "AI சுருக்கம் — மூல ஆவணத்துடன் சரிபார்த்து கேள்விகளை சிகிச்சைக் குழுவிடம் கேளுங்கள்.",
    helpSummary: "சுருக்கம் மூல ஆவணத்தில் உள்ளதை மட்டும் விளக்க வேண்டும்; புதிய நோயறிதல் அல்லது சிகிச்சை வழிமுறையைச் சேர்க்கக் கூடாது.",
    unsupported: "PDF அல்லது ஆதரிக்கப்படும் படத்தைத் தேர்ந்தெடுக்கவும்.", pageLoading: "உங்கள் உள்ளூர் சுகாதார விவரம் ஏற்றப்படுகிறது…",
    abhaImported: "இந்த உருவகத்தில் நேரடி பதிவுகள் இறக்குமதி செய்யப்படுவதில்லை. மாதிரி டெமோ பதிவுகள் இணைக்கப்பட்ட சுயவிவரத்தை விளக்குகின்றன.",
    viewDocument: "பதிவேற்றிய ஆவணத்தைப் பார்க்கவும்"
  },
  te: {
    loginEyebrow: "వ్యక్తిగత ఆరోగ్య కార్యస్థలం", loginHeading: "మీ ఆరోగ్య రికార్డులు, ఒకే స్పష్టమైన చోట.", loginBlurb: "మీ పత్రాల్లో ఏముందో అర్థం చేసుకోండి, తీసిన వివరాలను సమీక్షించండి, మీ సంరక్షణ కాలక్రమాన్ని చూడండి.",
    loginFeature: "నిర్మిత రికార్డులు Supabase‌లో, అప్‌లోడ్ చేసిన ఫైళ్లు ఈ సర్వర్‌లో నిల్వ ఉంటాయి.", loginWelcome: "MedLens‌కు స్వాగతం", loginPrompt: "నమూనా ఆరోగ్య కార్యస్థలాన్ని తెరవడానికి యాప్ పాస్‌వర్డ్‌ను నమోదు చేయండి.",
    demoPatientName: "ఆరవ్ శర్మ", demoPatientDetails: "కల్పిత డెమో రోగి · నమూనా రికార్డులు", continueDemo: "సైన్ ఇన్",
    loginWarning: "ప్రోటోటైప్ ప్రవేశం మాత్రమే — ఇది ధృవీకరణ కాదు. యాప్‌ను తెరవగల ఎవరైనా API మరియు డెమో డేటాను ఉపయోగించగలరు.",
    loginPrivacy: "కల్పిత రికార్డులనే ఉపయోగించండి. బహిరంగంగా హోస్ట్ చేయవద్దు లేదా నిజమైన రోగి సమాచారాన్ని నమోదు చేయవద్దు.",
    loginFooter: "AI ఆరోగ్య సమాచారం నిర్వాహకం · వైద్య పరికరం కాదు", signOut: "సైన్ అవుట్",
    workspace: "కార్యస్థలం", overview: "సారాంశం", records: "నా రికార్డులు", timeline: "ఆరోగ్య కాలక్రమం", profile: "ఆరోగ్య ప్రొఫైల్",
    privateByDesign: "Supabase డేటాబేస్", localStorageCopy: "నిర్మిత ఆరోగ్య రికార్డులు Supabase డేటాబేస్‌లో, అప్‌లోడ్ చేసిన ఫైళ్లు ఈ సర్వర్‌లో నిల్వ ఉంటాయి.", localStorage: "SUPABASE డేటాబేస్",
    demoPatient: "డెమో రోగి", demoEnvironment: "డెమో వాతావరణం", greeting: "శుభోదయం, ఆరవ్", overviewSub: "మీ ఆరోగ్య సమాచారం ఒక స్పష్టమైన, క్రమబద్ధమైన చోట.",
    uploadRecord: "రికార్డు అప్‌లోడ్", viewTimeline: "కాలక్రమం చూడండి", abhaTitle: "మీ ఆరోగ్య రికార్డులు, అనుసంధానంగా",
    abhaCopy: "ఈ FHIR-శైలి ప్రొఫైల్‌లో చూడటానికి కల్పిత ABHA ID‌ను జోడించండి. ABDM కనెక్షన్ లేదా రికార్డు దిగుమతి జరగదు.",
    linkAbha: "డెమో ABHA జోడించండి", simulated: "అనుకరణ మాత్రమే", recordsOnFile: "ఉన్న రికార్డులు", labResults: "ల్యాబ్ ఫలితాలు",
    medicines: "నమోదైన మందులు", itemsToReview: "మీ సమీక్ష అవసరం", documents: "పత్రాలు", observations: "పరిశీలనలు",
    extractedFromRecords: "ధృవీకరించిన రికార్డుల నుంచి", pendingReview: "నిర్ధారణ కోసం వేచి ఉంది", recentRecords: "ఇటీవలి రికార్డులు",
    recentRecordsSub: "మీ ఇటీవలి అప్‌లోడ్‌లు, డెమో పత్రాలు", viewAll: "అన్నీ చూడండి", healthNotes: "ఆరోగ్య గమనికలు",
    valueOutsideRange: "ముద్రించిన పరిధికి వెలుపల", cholesterolNote: "మీ నివేదికలో మొత్తం కొలెస్ట్రాల్ {value} {unit}; నివేదిక మార్గదర్శకం {range}. పరిధికి వెలుపల ఫలితం ఒక్కటే నిర్ధారణ కాదు.",
    noteDisclaimer: "మీ ఆరోగ్య చరిత్ర ప్రకారం వైద్యుడిని అడగండి. ఈ సారాంశం ఆధారంగా చికిత్సను మార్చవద్దు.",
    trendTitle: "మొత్తం కొలెస్ట్రాల్", trendSubtitle: "నివేదికల్లో నమోదు చేసిన విలువలు", demoData: "నమూనా డేటా",
    trendHelper: "ఒక ఫలితం నమోదు చేయబడింది", trendResults: "మీ రికార్డుల్లో {count} ఫలితాలు", recentTimeline: "ఇటీవలి కాలక్రమం",
    noRecords: "ఇంకా రికార్డులు లేవు", noRecordsCopy: "మీ ఆరోగ్య కాలక్రమాన్ని ప్రారంభించడానికి PDF లేదా చిత్రాన్ని అప్‌లోడ్ చేయండి.",
    confirmed: "సమీక్షించబడింది", needsReview: "సమీక్ష అవసరం", document: "పత్రం", openRecord: "రికార్డు తెరవండి",
    recordsTitle: "మీ రికార్డులు", recordsSub: "వైద్య పత్రాలు, వాటి నుంచి సమీక్షించిన నిర్మిత సమాచారం.",
    searchRecords: "రికార్డులను వెతకండి...", allTypes: "అన్ని రికార్డు రకాలు", lab: "ల్యాబ్ నివేదిక", prescription: "ప్రిస్క్రిప్షన్",
    discharge: "డిశ్చార్జ్ సారాంశం", other: "ఇతర", sortNewest: "కొత్తవి ముందు", lowConfidence: "తక్కువ విశ్వాసం",
    timelineTitle: "మీ ఆరోగ్య కాలక్రమం", timelineSub: "సందర్శనలు, నివేదికలు, మందులు, ఫలితాల కాలక్రమం.",
    allEvents: "అన్ని సంఘటనలు", visits: "సందర్శనలు", reports: "నివేదికలు", medicinesFilter: "మందులు", results: "పరీక్ష ఫలితాలు",
    profileTitle: "మీ ఆరోగ్య ప్రొఫైల్", profileSub: "మీరు సమీక్షించిన రికార్డుల నుంచి సమగ్ర సమాచారం.",
    personalDetails: "వ్యక్తిగత వివరాలు", sampleProfile: "నమూనా ప్రొఫైల్", name: "పేరు", birthDate: "పుట్టిన తేదీ", gender: "లింగం",
    location: "ప్రాంతం", abhaId: "ABHA ID (అనుకరణ)", resourceOverview: "FHIR-శైలి ప్రొఫైల్", exportFhir: "FHIR బండిల్ ఎగుమతి",
    currentMedicines: "నమోదైన మందులు", labTrends: "ల్యాబ్ ధోరణులు", labTrendsSub: "మీరు నిర్ధారించిన రికార్డుల విలువలు, తేదీల సులభ పోలిక.",
    oneResult: "ఒక ఫలితం మాత్రమే నమోదు అయింది", notComparable: "నేరుగా పోల్చదగిన ఫలితాలనే కలిపాం. ఈ చార్ట్ సమాచారం కోసం మాత్రమే; వైద్య అంచనా కాదు.",
    footerDisclaimer: "MedLens సమాచారం క్రమబద్ధీకరించే సాధనం; వైద్య పరికరం కాదు. AI సారాంశాలు తప్పుగా ఉండవచ్చు — వైద్య బృందంతో ధృవీకరించండి.",
    learnMore: "మరింత తెలుసుకోండి", uploadFail: "అప్‌లోడ్ విఫలమైంది", saveReview: "సమీక్షించిన రికార్డును నిర్ధారించండి", cancel: "రద్దు",
    addMedicine: "మందు జోడించండి", addObservation: "ఫలితం జోడించండి", addDiagnosis: "నిర్ధారణ జోడించండి",
    reviewTitle: "తీసిన వివరాలను సమీక్షించండి", reviewSub: "ప్రతి వివరాన్ని అసలు పత్రంతో సరిపోల్చండి. ఏదీ స్వయంచాలకంగా నిర్ధారించబడదు.",
    reviewWarning: "AI, OCR వైద్య రికార్డులను తప్పుగా చదవవచ్చు. భద్రపరచే ముందు పేర్లు, తేదీలు, మోతాదులు, యూనిట్లు, పరిధులను సరిచూడండి.",
    confidence: "వివరాల వెలికితీత విశ్వాసం", lowConfNotice: "విశ్వాసం తక్కువ — ప్రతి వివరాన్ని జాగ్రత్తగా తనిఖీ చేయండి. అస్పష్ట పాఠ్యం మిస్ అయి ఉండవచ్చు.",
    title: "రికార్డు శీర్షిక", recordType: "రికార్డు రకం", recordDate: "పత్రం తేదీ",
    explanationEn: "సులభ భాష సారాంశం (ఆంగ్లం)", explanationHi: "సులభ భాష సారాంశం (హిందీ)",
    explanationMr: "సులభ భాష సారాంశం (మరాఠీ)", explanationTa: "సులభ భాష సారాంశం (తమిళం)", explanationTe: "సులభ భాష సారాంశం (తెలుగు)",
    medicinesSection: "పత్రంలో ఉన్న మందులు", testValues: "పరీక్ష ఫలితాలు, సూచన పరిధులు",
    diagnosesSection: "పత్రంలో నమోదైన నిర్ధారణలు / అభిప్రాయాలు", medicineName: "పేరు", dosage: "మోతాదు", instructions: "సూచనలు",
    testName: "పరీక్ష", value: "విలువ", unit: "యూనిట్", low: "కనిష్ఠం", high: "గరిష్ఠం", reference: "సూచన పరిధి (ముద్రించినట్లుగా)",
    reviewDisclaimer: "భద్రత: సారాంశాలు పత్రంలో ఉన్నదాన్ని వివరిస్తాయి; నిర్ధారణ లేదా చికిత్స సలహా ఇవ్వవు. సందేహాలను వైద్యుడిని అడగండి.",
    source: "మూలం", summary: "సులభ భాష సారాంశం", capturedValues: "నమోదైన ఫలితాలు", status: "స్థితి",
    editRecord: "సమీక్షించిన వివరాలను మార్చండి", deleteRecord: "రికార్డు తొలగించండి", deleteConfirm: "ఈ పరికరం నుంచి ఈ రికార్డు, దాని అనుబంధ వివరాలను తొలగించాలా?",
    medication: "మందు", noValues: "పరీక్ష ఫలితాలు వెలికితీయలేదు.", noMedicines: "మందులు వెలికితీయలేదు.", noDiagnosis: "నిర్ధారణలు వెలికితీయలేదు.",
    resultFlagHigh: "ముద్రించిన పరిధి కంటే ఎక్కువ", resultFlagLow: "ముద్రించిన పరిధి కంటే తక్కువ", withinRange: "ముద్రించిన పరిధిలో",
    recordSaved: "రికార్డు సమీక్షించి ప్రొఫైల్‌లో చేర్చాం.", recordDeleted: "రికార్డు తొలగించబడింది.", confirmDelete: "రికార్డు తొలగించండి", close: "మూసివేయండి",
    uploadModalTitle: "ఆరోగ్య రికార్డు జోడించండి", uploadModalSub: "ప్రిస్క్రిప్షన్, ల్యాబ్ నివేదిక, డిశ్చార్జ్ సారాంశం లేదా ఇతర వైద్య పత్రాన్ని అప్‌లోడ్ చేయండి.",
    dropText: "పత్రాన్ని ఇక్కడ వదలండి లేదా ఫైల్ ఎంచుకోండి", browse: "ఫైల్ ఎంచుకోండి", uploadFormats: "PDF, PNG, JPG, WEBP లేదా TIFF · గరిష్ఠం {max_mb} MB",
    processing: "పత్రాన్ని చదివి వివరాలు వెలికితీస్తోంది…", uploadPrivacy: "నిర్మిత ఆరోగ్య రికార్డులు Supabase‌లో, అప్‌లోడ్ చేసిన ఫైళ్లు ఈ సర్వర్‌లో నిల్వ ఉంటాయి. AI ప్రొవైడర్ ఏర్పాటు చేస్తే, పత్రం దానికి కూడా పంపబడుతుంది.",
    aiConfigured: "AI వెలికితీత ఏర్పాటు చేయబడింది", localExtraction: "స్థానిక OCR, పరిమిత వెలికితీత మాత్రమే",
    abhaModalTitle: "అనుకరణ ABHA అనుసంధానం", abhaModalSub: "ABHA గుర్తింపు రోగి ప్రొఫైల్‌తో ఎలా అనుసంధానం కావచ్చో చూడండి.",
    abhaWarning: "అనుకరణ మాత్రమే: ABHA ID ధృవీకరణ లేదా ABDM అనుసంధానం జరగదు. కల్పిత డెమో ID మాత్రమే వాడండి.",
    abhaNumber: "కల్పిత 14-అంకెల డెమో ID", saveSimulation: "అనుకరణ లింక్‌ను భద్రపరచండి", abhaSaved: "డెమో ABHA ID అనుసంధానించాం (అనుకరణ మాత్రమే).",
    emptySearch: "సరిపోలే రికార్డులు లేవు", emptyTimeline: "ఈ వడపోతలో సంఘటనలు లేవు", uploaded: "అప్‌లోడ్ అయింది",
    uploadError: "ఈ ఫైల్‌ను ప్రాసెస్ చేయలేకపోయాం. స్పష్టమైన PDF లేదా చిత్రాన్ని ప్రయత్నించండి.",
    warning: "ప్రాసెసింగ్ గమనిక", aiDisclaimer: "AI సారాంశం — అసలు పత్రంతో తనిఖీ చేసి సందేహాలను వైద్య బృందంతో చర్చించండి.",
    helpSummary: "సారాంశం మూల పత్రంలో ఉన్నదాన్ని మాత్రమే వివరించాలి; కొత్త నిర్ధారణ లేదా సంరక్షణ సూచన జోడించకూడదు.",
    unsupported: "PDF లేదా మద్దతు ఉన్న చిత్రాన్ని ఎంచుకోండి.", pageLoading: "మీ స్థానిక ఆరోగ్య ప్రొఫైల్ లోడ్ అవుతోంది…",
    abhaImported: "ఈ అనుకరణలో ప్రత్యక్ష రికార్డులు దిగుమతి కావు. నమూనా డెమో రికార్డులు అనుసంధానిత ప్రొఫైల్‌ను చూపిస్తాయి.",
    viewDocument: "అప్‌లోడ్ చేసిన పత్రాన్ని చూడండి"
  },
  hi: {
    loginEyebrow: "निजी स्वास्थ्य कार्यस्थल", loginHeading: "आपके स्वास्थ्य रिकॉर्ड, एक स्पष्ट जगह पर।", loginBlurb: "दस्तावेज़ में लिखी बात समझें, निकाली गई जानकारी जाँचें और अपनी देखभाल की सरल समयरेखा देखें।",
    loginFeature: "संरचित रिकॉर्ड Supabase में और अपलोड की गई फ़ाइलें इस सर्वर पर रखी जाती हैं।", loginWelcome: "MedLens में आपका स्वागत है", loginPrompt: "नमूना स्वास्थ्य कार्यस्थल खोलने के लिए ऐप पासवर्ड दर्ज करें।",
    demoPatientName: "आरव शर्मा", demoPatientDetails: "काल्पनिक डेमो मरीज़ · नमूना रिकॉर्ड", continueDemo: "साइन इन करें",
    loginWarning: "केवल प्रोटोटाइप प्रवेश — यह प्रमाणीकरण नहीं है। ऐप खोल सकने वाला कोई भी व्यक्ति API और डेमो डेटा इस्तेमाल कर सकता है।",
    loginPrivacy: "केवल काल्पनिक रिकॉर्ड इस्तेमाल करें। इसे सार्वजनिक न करें और मरीज़ की असली जानकारी न डालें।",
    loginFooter: "AI स्वास्थ्य जानकारी आयोजक · चिकित्सा उपकरण नहीं", signOut: "साइन आउट",
    workspace: "कार्यस्थल", overview: "अवलोकन", records: "मेरे रिकॉर्ड", timeline: "स्वास्थ्य समयरेखा",
    profile: "स्वास्थ्य प्रोफ़ाइल", privateByDesign: "Supabase डेटाबेस", localStorageCopy: "संरचित स्वास्थ्य रिकॉर्ड Supabase में और अपलोड की गई फ़ाइलें इस सर्वर पर रखी जाती हैं।",
    localStorage: "SUPABASE डेटाबेस", demoPatient: "डेमो मरीज़", demoEnvironment: "डेमो वातावरण",
    greeting: "सुप्रभात, आरव", overviewSub: "आपकी स्वास्थ्य जानकारी, एक स्पष्ट और व्यवस्थित जगह पर।",
    uploadRecord: "रिकॉर्ड अपलोड करें", viewTimeline: "समयरेखा देखें", abhaTitle: "आपके स्वास्थ्य रिकॉर्ड, जुड़े हुए",
    abhaCopy: "इस FHIR-शैली प्रोफ़ाइल में देखने के लिए काल्पनिक ABHA ID जोड़ें। ABDM से कनेक्शन या रिकॉर्ड आयात नहीं होता।",
    linkAbha: "डेमो ABHA जोड़ें", simulated: "केवल सिमुलेशन", recordsOnFile: "मौजूद रिकॉर्ड", labResults: "लैब परिणाम",
    medicines: "दर्ज दवाएँ", itemsToReview: "आपकी समीक्षा बाकी", documents: "दस्तावेज़", observations: "जाँच परिणाम",
    extractedFromRecords: "समीक्षित रिकॉर्ड से", pendingReview: "पुष्टि की प्रतीक्षा में", recentRecords: "हाल के रिकॉर्ड",
    recentRecordsSub: "आपके हाल के अपलोड और डेमो दस्तावेज़", viewAll: "सभी देखें", healthNotes: "स्वास्थ्य नोट",
    valueOutsideRange: "दी गई सीमा से बाहर", cholesterolNote: "आपकी रिपोर्ट में कुल कोलेस्ट्रॉल {value} {unit} है; रिपोर्ट में दी गई मार्गदर्शक सीमा {range} है। सीमा से बाहर परिणाम अपने-आप में निदान नहीं होता।",
    noteDisclaimer: "अपने स्वास्थ्य इतिहास के संदर्भ में डॉक्टर से पूछें। इस सारांश के आधार पर उपचार न बदलें।",
    trendTitle: "कुल कोलेस्ट्रॉल", trendSubtitle: "रिपोर्ट में दर्ज मान", demoData: "नमूना डेटा",
    trendHelper: "एक दर्ज परिणाम", trendResults: "रिकॉर्ड में {count} परिणाम",
    recentTimeline: "हाल की समयरेखा", noRecords: "अभी कोई रिकॉर्ड नहीं", noRecordsCopy: "अपनी स्वास्थ्य समयरेखा बनाने के लिए PDF या छवि अपलोड करें।",
    confirmed: "समीक्षित", needsReview: "समीक्षा आवश्यक", document: "दस्तावेज़", openRecord: "रिकॉर्ड खोलें",
    recordsTitle: "आपके रिकॉर्ड", recordsSub: "चिकित्सा दस्तावेज़ और उनसे निकाली गई समीक्षित जानकारी।",
    searchRecords: "रिकॉर्ड खोजें...", allTypes: "सभी रिकॉर्ड प्रकार", lab: "लैब रिपोर्ट", prescription: "पर्चा",
    discharge: "डिस्चार्ज सारांश", other: "अन्य", sortNewest: "नवीनतम पहले", lowConfidence: "कम विश्वसनीयता",
    timelineTitle: "आपकी स्वास्थ्य समयरेखा", timelineSub: "मुलाक़ातों, रिपोर्ट, दवाओं और दर्ज परिणामों का कालक्रम।",
    allEvents: "सभी घटनाएँ", visits: "मुलाक़ातें", reports: "रिपोर्ट", medicinesFilter: "दवाएँ", results: "जाँच परिणाम",
    profileTitle: "आपकी स्वास्थ्य प्रोफ़ाइल", profileSub: "आपके समीक्षित रिकॉर्ड की जानकारी का एकीकृत दृश्य।",
    personalDetails: "व्यक्तिगत विवरण", sampleProfile: "नमूना प्रोफ़ाइल", name: "नाम", birthDate: "जन्मतिथि",
    gender: "लिंग", location: "स्थान", abhaId: "ABHA ID (नकली)", resourceOverview: "FHIR-शैली प्रोफ़ाइल",
    exportFhir: "FHIR बंडल निर्यात", currentMedicines: "दर्ज दवाएँ", labTrends: "लैब रुझान",
    labTrendsSub: "आपके पुष्ट रिकॉर्ड में दर्ज मानों और तारीख़ों की सरल तुलना।",
    oneResult: "सिर्फ़ एक परिणाम दर्ज है", notComparable: "सिर्फ़ सीधे तुलनीय परिणाम जोड़े गए हैं। यह चार्ट केवल जानकारी के लिए है, चिकित्सकीय आकलन नहीं।",
    footerDisclaimer: "MedLens स्वास्थ्य जानकारी का आयोजक है, चिकित्सा उपकरण नहीं। AI सारांश गलत हो सकते हैं — अपनी देखभाल टीम से पुष्टि करें।",
    learnMore: "और जानें", uploaded: "अपलोड हुआ", uploadFail: "अपलोड विफल", saveReview: "समीक्षा कर पुष्टि करें",
    cancel: "रद्द करें", add: "जोड़ें", addMedicine: "दवा जोड़ें", addObservation: "परिणाम जोड़ें", addDiagnosis: "निदान जोड़ें",
    reviewTitle: "निकाली गई जानकारी की समीक्षा करें", reviewSub: "हर फ़ील्ड को मूल दस्तावेज़ से जाँचें। कुछ भी अपने-आप पुष्ट नहीं होता।",
    reviewWarning: "AI और OCR चिकित्सा रिकॉर्ड गलत पढ़ सकते हैं। सहेजने से पहले नाम, तारीख़, खुराक, इकाइयाँ और सीमाएँ ठीक करें।",
    confidence: "जानकारी निकालने की विश्वसनीयता", lowConfNotice: "विश्वसनीयता कम है — हर फ़ील्ड जाँचें। अस्पष्ट पाठ छूट सकता है।",
    title: "रिकॉर्ड का शीर्षक", recordType: "रिकॉर्ड का प्रकार", recordDate: "दस्तावेज़ की तारीख़", explanationEn: "आसान भाषा में सारांश (अंग्रेज़ी)",
    explanationHi: "आसान भाषा में सारांश (हिंदी)", explanationMr: "आसान भाषा में सारांश (मराठी)",
    explanationTa: "आसान भाषा में सारांश (तमिल)", explanationTe: "आसान भाषा में सारांश (तेलुगू)",
    medicinesSection: "दस्तावेज़ में लिखी दवाएँ", testValues: "जाँच परिणाम और संदर्भ सीमाएँ",
    diagnosesSection: "दस्तावेज़ में लिखे निदान / निष्कर्ष", medicineName: "नाम", dosage: "खुराक", instructions: "निर्देश",
    testName: "जाँच", value: "मान", unit: "इकाई", low: "न्यूनतम", high: "अधिकतम", reference: "संदर्भ सीमा (जैसी लिखी है)",
    reviewDisclaimer: "सुरक्षा जाँच: सारांश केवल दस्तावेज़ में लिखी बात बताते हैं; वे निदान या उपचार की सलाह नहीं हैं। अनिश्चित जानकारी डॉक्टर से पूछें।",
    sourceScan: "मूल दस्तावेज़", noSummary: "सारांश उपलब्ध नहीं है। कृपया फ़ील्ड स्वयं जाँचें।",
    extractedData: "निकाली गई जानकारी", editRecord: "समीक्षित जानकारी बदलें", deleteRecord: "रिकॉर्ड हटाएँ", deleteConfirm: "इस डिवाइस से यह रिकॉर्ड और इससे जुड़ी जानकारी हटाएँ?",
    medication: "दवा", noValues: "कोई जाँच परिणाम नहीं निकला।", noMedicines: "कोई दवा नहीं निकली।", noDiagnosis: "दस्तावेज़ में कोई निदान नहीं निकला।",
    resultFlagHigh: "लिखी सीमा से ऊपर", resultFlagLow: "लिखी सीमा से नीचे", withinRange: "लिखी सीमा में",
    recordSaved: "रिकॉर्ड की समीक्षा हुई और प्रोफ़ाइल में जोड़ा गया।", recordDeleted: "रिकॉर्ड हटा दिया गया।", confirmDelete: "रिकॉर्ड हटाएँ",
    uploadModalTitle: "स्वास्थ्य रिकॉर्ड जोड़ें", uploadModalSub: "पर्चा, लैब रिपोर्ट, डिस्चार्ज सारांश या अन्य चिकित्सा दस्तावेज़ अपलोड करें।",
    dropText: "दस्तावेज़ यहाँ छोड़ें या फ़ाइल चुनें", browse: "फ़ाइल चुनें", uploadFormats: "PDF, PNG, JPG, WEBP या TIFF · अधिकतम {max_mb} MB",
    processing: "दस्तावेज़ पढ़ा जा रहा है और जानकारी निकाली जा रही है…", processingProgress: "अपलोड और प्रसंस्करण", uploadPrivacy: "संरचित स्वास्थ्य रिकॉर्ड Supabase में और अपलोड की गई फ़ाइलें इस सर्वर पर रखी जाती हैं। AI प्रदाता सेट होने पर दस्तावेज़ उसे भी भेजा जाता है।",
    aiConfigured: "AI निष्कर्षण कॉन्फ़िगर है", localExtraction: "केवल स्थानीय OCR और सीमित निष्कर्षण",
    abhaModalTitle: "नकली ABHA लिंक", abhaModalSub: "देखें कि ABHA पहचानकर्ता मरीज़ की प्रोफ़ाइल से कैसे जुड़ सकता है।",
    abhaWarning: "केवल सिमुलेशन: ABHA ID सत्यापित नहीं होती और ABDM से कनेक्शन नहीं होता। केवल काल्पनिक डेमो ID डालें।",
    abhaNumber: "काल्पनिक 14-अंकों की डेमो ID", saveSimulation: "नकली लिंक सहेजें", abhaSaved: "डेमो ABHA ID जुड़ी (केवल सिमुलेशन)।",
    emptySearch: "कोई मिलता-जुलता रिकॉर्ड नहीं", emptyTimeline: "इस फ़िल्टर में कोई घटना नहीं", edit: "बदलें", close: "बंद करें",
    source: "स्रोत", summary: "आसान भाषा में सारांश", capturedValues: "दर्ज परिणाम", status: "स्थिति",
    uploadError: "फ़ाइल संसाधित नहीं हुई। कृपया साफ़ PDF या छवि आज़माएँ।", ocrError: "OCR पाठ नहीं पढ़ पाया। आप विवरण स्वयं भर सकते हैं।",
    warning: "प्रसंस्करण नोट", aiDisclaimer: "AI से बना सारांश — मूल से जाँचें और सवाल अपनी देखभाल टीम से पूछें।",
    reviewing: "समीक्षा आवश्यक", resultCount: "परिणाम", helpSummary: "सारांश केवल स्रोत में लिखी बात समझाए, नया निदान या देखभाल निर्देश नहीं जोड़े।",
    unsupported: "PDF या समर्थित छवि चुनें.", pageLoading: "आपकी स्थानीय स्वास्थ्य प्रोफ़ाइल लोड हो रही है…",
    abhaImported: "इस सिमुलेशन में लाइव रिकॉर्ड आयात नहीं होते। ऊपर के डेमो रिकॉर्ड जुड़े प्रोफ़ाइल का उदाहरण हैं।",
    typeLab: "लैब रिपोर्ट", typePrescription: "पर्चा", typeDischarge: "डिस्चार्ज सारांश",
    viewDocument: "अपलोड किया दस्तावेज़ देखें", noFilePreview: "मूल फ़ाइल इस स्थानीय डेमो में उपलब्ध है।"
  }
};

const SUPPORTED_LANGUAGES = ["en", "hi", "mr", "ta", "te"];
const LANGUAGE_LOCALES = { en: "en-IN", hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", te: "te-IN" };
const LANGUAGE_LABELS = { en: "English", hi: "हिन्दी", mr: "मराठी", ta: "தமிழ்", te: "తెలుగు" };
const storedLanguage = localStorage.getItem("medlens-language");
const state = { language: SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : "en", page: "overview", data: null, timelineFilter: "all", recordTypeFilter: "all", search: "" };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const tr = (key, vars = {}) => {
  const template = I18N[state.language][key] || I18N.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
};
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const ext = resource => Object.fromEntries((resource.extension || []).map(item => [item.url.split("/").pop(), item.valueString ?? item.valueDecimal ?? item.valueCode ?? ""]));
const refType = resource => resource.type?.text || resource.type?.coding?.[0]?.display || "Medical record";
const recordDate = doc => (doc.date || "").slice(0, 10);
const reviewed = doc => ext(doc)["review-status"] === "confirmed";
const recordCount = () => state.data?.documents?.length || 0;
const resourceTypeName = type => ({ DiagnosticReport: tr("lab"), Observation: tr("results"), MedicationRequest: tr("medication"), Condition: tr("diagnosesSection"), Encounter: tr("visits"), DocumentReference: tr("document") }[type] || type);
const dateLabel = value => {
  if (!value) return "—";
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.valueOf()) ? value : new Intl.DateTimeFormat(LANGUAGE_LOCALES[state.language] || "en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
};
const typeKind = type => /lab|report|test/i.test(type) ? "lab" : /prescription|medicine|medication/i.test(type) ? "prescription" : /discharge/i.test(type) ? "discharge" : "document";
const summaryFor = doc => ext(doc)[`summary-${state.language}`] || tr("noSummary");
const formatResult = observation => {
  const quantity = observation.valueQuantity || {};
  return { value: quantity.value, unit: quantity.unit || "", range: observation.referenceRange?.[0]?.text || "", name: observation.code?.text || observation.code?.coding?.[0]?.display || "Test" };
};

async function api(path, options = {}) {
  const response = await fetch(path, { cache: "no-store", ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

async function refresh() {
  state.data = await api("/api/profile");
  $("#record-count").textContent = recordCount();
  renderPage();
}

function setPage(page) {
  state.page = page;
  $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.nav === page));
  $$(".screen").forEach(screen => screen.classList.toggle("hidden", screen.id !== `screen-${page}`));
  renderPage();
  window.scrollTo(0, 0);
}

function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) throw new Error(`Unsupported interface language: ${language}`);
  state.language = language;
  localStorage.setItem("medlens-language", language);
  document.documentElement.lang = LANGUAGE_LOCALES[language];
  ["#language-toggle", "#login-language-toggle"].forEach(selector => {
    const select = $(selector);
    if (select) select.value = language;
  });
  $$("[data-i18n]").forEach(node => { node.textContent = tr(node.dataset.i18n); });
  $$("[data-i18n-aria-label]").forEach(node => { node.setAttribute("aria-label", tr(node.dataset.i18nAriaLabel)); });
  if (sessionStorage.getItem("medlens-demo-session") !== "active") renderLogin();
  else renderPage();
}

function renderLogin() {
  const loginScreen = $("#login-screen");
  if (!loginScreen) return;
  loginScreen.innerHTML = `<div class="login-card">
    <section class="login-story" aria-label="${escapeHTML(tr("loginEyebrow"))}">
      <div class="login-brand"><span class="brand-mark" aria-hidden="true">M<span>+</span></span><span>medlens<span style="color:#9bdbad">.</span><small>PERSONAL HEALTH COPILOT</small></span></div>
      <div class="login-story-copy"><div class="eyebrow" style="color:#bbdfc6">${escapeHTML(tr("loginEyebrow"))}</div><h2>${escapeHTML(tr("loginHeading"))}</h2><p>${escapeHTML(tr("loginBlurb"))}</p></div>
      <div class="login-feature"><span class="login-feature-mark">⌑</span>${escapeHTML(tr("loginFeature"))}</div>
    </section>
    <section class="login-form-panel">
      <div class="login-form-top"><label class="language-select-wrap"><span class="sr-only">Interface language</span><select class="language-select" id="login-language-toggle" aria-label="Interface language">${SUPPORTED_LANGUAGES.map(language => `<option value="${language}">${LANGUAGE_LABELS[language]}</option>`).join("")}</select></label></div>
      <div class="login-form-content"><div class="eyebrow">${escapeHTML(tr("loginEyebrow"))}</div><h1 id="login-title">${escapeHTML(tr("loginWelcome"))}</h1><p>${escapeHTML(tr("loginPrompt"))}</p>
        <div class="demo-identity"><span class="patient-avatar">AS</span><span><strong>${escapeHTML(tr("demoPatientName"))}</strong><small>${escapeHTML(tr("demoPatientDetails"))}</small></span><span style="margin-left:auto;color:#59936b;font-size:9px">✓</span></div>
        <button class="button button-primary login-continue" type="button" id="continue-demo">${escapeHTML(tr("continueDemo"))} &nbsp;→</button>
        <div class="login-demo-note">${escapeHTML(tr("loginWarning"))}</div>
        <p class="login-privacy">${escapeHTML(tr("loginPrivacy"))}</p>
      </div>
      <div class="login-footer">${escapeHTML(tr("loginFooter"))}</div>
    </section>
  </div>`;
  $("#login-language-toggle").value = state.language;
  $("#login-language-toggle").addEventListener("change", event => setLanguage(event.target.value));
  $("#continue-demo").addEventListener("click", async () => {
    sessionStorage.setItem("medlens-demo-session", "active");
    $("#login-screen").classList.add("hidden");
    document.body.classList.remove("login-required");
    try { await refresh(); }
    catch (error) {
      sessionStorage.removeItem("medlens-demo-session");
      $("#login-screen").classList.remove("hidden");
      document.body.classList.add("login-required");
      toast(error.message, true);
    }
  });
}

function renderPage() {
  if (!state.data) return;
  const titles = { overview: tr("overview"), records: tr("records"), timeline: tr("timeline"), profile: tr("profile") };
  $("#page-title").textContent = titles[state.page];
  const renderers = { overview: renderOverview, records: renderRecords, timeline: renderTimeline, profile: renderProfile };
  renderers[state.page]();
}

function docRow(doc, card = false) {
  const details = ext(doc);
  const kind = typeKind(refType(doc));
  const resultCount = JSON.parse(details["extraction-json"] || '{"observations":[]}').observations?.length ?? 0;
  return `<div class="${card ? "record-card" : "record-row"}" data-open-doc="${escapeHTML(doc.id)}" tabindex="0" role="button" aria-label="${escapeHTML(tr("openRecord"))}: ${escapeHTML(doc.description)}">
    <span class="record-icon ${kind}">${kind === "lab" ? "⌁" : kind === "prescription" ? "▱" : kind === "discharge" ? "▤" : "▧"}</span>
    <div class="record-description"><strong>${escapeHTML(doc.description || tr("document"))}</strong><small>${escapeHTML(refType(doc))} &nbsp;·&nbsp; ${escapeHTML(dateLabel(recordDate(doc)))}</small></div>
    ${card ? "" : `<span class="record-status ${reviewed(doc) ? "" : "review"}">${escapeHTML(tr(reviewed(doc) ? "confirmed" : "needsReview"))}</span>`}
    ${card ? `<span class="record-status ${reviewed(doc) ? "" : "review"}">${escapeHTML(tr(reviewed(doc) ? "confirmed" : "needsReview"))}</span>` : `<span class="record-arrow">›</span>`}
    ${card ? `<p class="record-card-excerpt">${escapeHTML(summaryFor(doc))}</p><div class="card-bottom"><span>${resultCount} ${escapeHTML(tr("results").toLowerCase())}</span><span>${escapeHTML(tr("openRecord"))} &nbsp;↗</span></div>` : ""}
  </div>`;
}

function renderOverview() {
  const { patient, documents = [], timeline = [], resources = [] } = state.data;
  const observations = resources.filter(item => item.resourceType === "Observation");
  const medications = resources.filter(item => item.resourceType === "MedicationRequest");
  const pending = documents.filter(doc => !reviewed(doc)).length;
  const abha = patient?.identifier?.find(item => item.system === "https://medlens.local/identifiers/simulated-abha")?.value || "—";
  const recentDocs = [...documents].sort((a, b) => recordDate(b).localeCompare(recordDate(a))).slice(0, 3);
  const timelineItems = [...timeline].filter(item => item.resource.resourceType === "DocumentReference" || item.resource.resourceType === "Encounter").slice(0, 3);
  const cholesterol = observations.filter(item => formatResult(item).name.toLowerCase().includes("cholesterol")).sort((a, b) => (a.effectiveDateTime || "").localeCompare(b.effectiveDateTime || ""));
  const latestCholesterol = cholesterol.at(-1);
  const result = latestCholesterol ? formatResult(latestCholesterol) : null;
  const range = latestCholesterol?.referenceRange?.[0];
  const high = range?.high?.value;
  const insight = result && high != null && Number(result.value) > Number(high);
  $("#screen-overview").innerHTML = `
    <div class="welcome-row"><div><div class="eyebrow">${escapeHTML(tr("overview"))} &nbsp;·&nbsp; ${escapeHTML(dateLabel(new Date().toISOString().slice(0, 10)))}</div><h1>${escapeHTML(tr("greeting"))}</h1><p class="welcome-subtitle">${escapeHTML(tr("overviewSub"))}</p></div>
      <div class="welcome-actions"><button class="button" data-action="export"><span>⇩</span>${escapeHTML(tr("exportFhir"))}</button><button class="button button-primary" data-action="upload"><span class="icon-plus">＋</span>${escapeHTML(tr("uploadRecord"))}</button></div></div>
    <div class="abha-banner"><span class="abha-symbol">AB</span><div class="abha-copy"><strong>${escapeHTML(tr("abhaTitle"))}</strong><p>${escapeHTML(tr("abhaCopy"))} &nbsp;<b>${escapeHTML(abha)}</b></p></div><span class="simulation-tag">${escapeHTML(tr("simulated"))}</span><button class="button button-small" data-action="abha">${escapeHTML(tr("linkAbha"))}</button></div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-top"><span>${escapeHTML(tr("recordsOnFile"))}</span><span class="stat-icon">▤</span></div><div class="stat-number">${documents.length}</div><div class="stat-note">${escapeHTML(tr("documents"))}</div></div>
      <div class="stat-card"><div class="stat-top"><span>${escapeHTML(tr("labResults"))}</span><span class="stat-icon">⌁</span></div><div class="stat-number">${observations.length}</div><div class="stat-note">${escapeHTML(tr("observations"))}</div></div>
      <div class="stat-card"><div class="stat-top"><span>${escapeHTML(tr("medicines"))}</span><span class="stat-icon">▱</span></div><div class="stat-number">${medications.length}</div><div class="stat-note">${escapeHTML(tr("extractedFromRecords"))}</div></div>
      <div class="stat-card"><div class="stat-top"><span>${escapeHTML(tr("itemsToReview"))}</span><span class="stat-icon">⌕</span></div><div class="stat-number">${pending}</div><div class="stat-note">${escapeHTML(tr("pendingReview"))}</div></div>
    </div>
    <div class="content-grid"><div class="panel"><div class="panel-heading"><div><h2>${escapeHTML(tr("recentRecords"))}</h2><p>${escapeHTML(tr("recentRecordsSub"))}</p></div><button class="text-link" data-nav="records">${escapeHTML(tr("viewAll"))} &nbsp;→</button></div><div class="recent-list">${recentDocs.length ? recentDocs.map(doc => docRow(doc)).join("") : emptyState("noRecords", "noRecordsCopy")}</div></div>
      <div class="side-stack"><div class="insight-card"><div class="insight-top"><span class="insight-label">${escapeHTML(tr("healthNotes"))}</span><span class="insight-badge">${escapeHTML(tr(insight ? "valueOutsideRange" : "demoData"))}</span></div><h3>${escapeHTML(result ? result.name : tr("healthNotes"))}</h3><p>${escapeHTML(result && insight ? tr("cholesterolNote", { value: result.value, unit: result.unit, range: range?.text || tr("valueOutsideRange") }) : tr("overviewSub"))}</p><p class="caution">${escapeHTML(tr("noteDisclaimer"))}</p></div>
      <div class="trend-card"><div class="trend-title">${escapeHTML(tr("trendTitle"))}</div><div class="trend-value">${result ? `${escapeHTML(result.value)} <small>${escapeHTML(result.unit)}</small>` : "—"}</div><div class="trend-meta">${escapeHTML(cholesterol.length > 1 ? tr("trendResults", { count: cholesterol.length }) : tr("trendHelper"))}</div>${miniTrend(cholesterol)}</div></div></div>
    <div class="panel" style="margin-top:15px"><div class="panel-heading"><div><h2>${escapeHTML(tr("recentTimeline"))}</h2><p>${escapeHTML(tr("timelineSub"))}</p></div><button class="text-link" data-nav="timeline">${escapeHTML(tr("viewTimeline"))} &nbsp;→</button></div><div class="mini-timeline">${timelineItems.map((item, index) => `<div class="mini-event"><span class="timeline-rail"><i class="timeline-dot"></i>${index < timelineItems.length - 1 ? '<i class="timeline-stem"></i>' : ""}</span><div class="mini-event-copy"><strong>${escapeHTML(item.resource.description || item.resource.reasonCode?.[0]?.text || resourceTypeName(item.resource.resourceType))}</strong><span>${escapeHTML(dateLabel(item.date))} &nbsp;·&nbsp; ${escapeHTML(resourceTypeName(item.resource.resourceType))}</span></div></div>`).join("") || emptyState("noRecords", "noRecordsCopy")}</div></div>`;
}

function miniTrend(items) {
  if (!items.length) return "";
  const values = items.map(item => Number(item.valueQuantity?.value)).filter(Number.isFinite);
  if (!values.length) return "";
  const min = Math.min(...values) - 3;
  const max = Math.max(...values) + 3 || 1;
  const points = values.map((value, i) => `${values.length === 1 ? 8 : 8 + i * 84 / (values.length - 1)},${42 - ((value - min) / (max - min || 1)) * 32}`);
  const path = points.map((point, i) => `${i ? "L" : "M"}${point}`).join(" ");
  return `<svg class="trend-svg" viewBox="0 0 100 52" preserveAspectRatio="none" aria-label="${escapeHTML(tr("trendTitle"))}"><defs><linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8fbe9c" stop-opacity=".22"/><stop offset="1" stop-color="#8fbe9c" stop-opacity="0"/></linearGradient></defs><path class="area" d="${path} L92 48 L8 48 Z"/><path d="${path}"/>${points.map(point => `<circle cx="${point.split(",")[0]}" cy="${point.split(",")[1]}" r="1.7"/>`).join("")}</svg>`;
}

function emptyState(title, copy) {
  return `<div class="empty-state"><span>◇</span><strong>${escapeHTML(tr(title))}</strong><span>${escapeHTML(tr(copy))}</span></div>`;
}

function renderRecords() {
  const docs = [...state.data.documents].sort((a, b) => recordDate(b).localeCompare(recordDate(a)));
  const filtered = docs.filter(doc => (state.recordTypeFilter === "all" || typeKind(refType(doc)) === state.recordTypeFilter) && `${doc.description} ${refType(doc)} ${summaryFor(doc)}`.toLowerCase().includes(state.search.toLowerCase()));
  $("#screen-records").innerHTML = `<div class="screen-heading"><div><div class="eyebrow">${escapeHTML(tr("workspace"))}</div><h1>${escapeHTML(tr("recordsTitle"))}</h1><p>${escapeHTML(tr("recordsSub"))}</p></div><button class="button button-primary" data-action="upload"><span class="icon-plus">＋</span>${escapeHTML(tr("uploadRecord"))}</button></div>
    <div class="toolbar"><input class="search-input" id="record-search" type="search" placeholder="${escapeHTML(tr("searchRecords"))}" value="${escapeHTML(state.search)}" aria-label="${escapeHTML(tr("searchRecords"))}"><select class="filter-select" id="record-filter" aria-label="${escapeHTML(tr("allTypes"))}"><option value="all">${escapeHTML(tr("allTypes"))}</option><option value="lab">${escapeHTML(tr("lab"))}</option><option value="prescription">${escapeHTML(tr("prescription"))}</option><option value="discharge">${escapeHTML(tr("discharge"))}</option></select><span class="record-status review">${escapeHTML(tr("lowConfidence"))}: ${state.data.documents.filter(doc => Number(ext(doc).confidence || 0) < .6).length}</span></div>
    <div class="records-grid">${filtered.map(doc => docRow(doc, true)).join("") || emptyState(state.search ? "emptySearch" : "noRecords", "noRecordsCopy")}</div>`;
  $("#record-filter").value = state.recordTypeFilter;
  $("#record-search").addEventListener("input", event => { state.search = event.target.value; renderRecords(); const input = $("#record-search"); input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
  $("#record-filter").addEventListener("change", event => { state.recordTypeFilter = event.target.value; renderRecords(); });
}

function eventCategory(resource) {
  if (resource.resourceType === "Encounter") return "visits";
  if (resource.resourceType === "MedicationRequest") return "medicines";
  if (resource.resourceType === "Observation") return "results";
  return "reports";
}

function eventDescription(resource) {
  const type = resource.resourceType;
  if (type === "DocumentReference") return resource.description || tr("document");
  if (type === "Observation") {
    const result = formatResult(resource);
    const flag = resource.interpretation?.[0]?.text;
    return `${result.name}: ${result.value ?? "—"} ${result.unit}${flag ? ` · ${flag}` : ""}`;
  }
  if (type === "MedicationRequest") return `${resource.medicationCodeableConcept?.text || tr("medication")} — ${resource.dosageInstruction?.[0]?.text || ""}`;
  if (type === "Condition") return resource.code?.text || tr("diagnosesSection");
  if (type === "Encounter") return resource.reasonCode?.[0]?.text || resource.serviceProvider?.display || tr("visits");
  if (type === "DiagnosticReport") return resource.code?.text || tr("lab");
  return resourceTypeName(type);
}

function renderTimeline() {
  const filters = ["all", "visits", "reports", "medicines", "results"];
  const items = state.data.timeline.filter(item => state.timelineFilter === "all" || eventCategory(item.resource) === state.timelineFilter);
  const grouped = items.reduce((groups, item) => {
    const key = item.date || "—";
    (groups[key] ||= []).push(item);
    return groups;
  }, {});
  $("#screen-timeline").innerHTML = `<div class="screen-heading"><div><div class="eyebrow">${escapeHTML(tr("workspace"))}</div><h1>${escapeHTML(tr("timelineTitle"))}</h1><p>${escapeHTML(tr("timelineSub"))}</p></div><button class="button button-primary" data-action="upload"><span class="icon-plus">＋</span>${escapeHTML(tr("uploadRecord"))}</button></div>
    <div class="filter-row">${filters.map(filter => `<button class="filter-chip ${state.timelineFilter === filter ? "active" : ""}" data-timeline-filter="${filter}">${escapeHTML(tr(filter === "all" ? "allEvents" : filter))}</button>`).join("")}</div>
    <div class="panel timeline-panel">${Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => `<div class="timeline-date-label">${escapeHTML(dateLabel(date))}</div>${entries.map(item => `<div class="timeline-event" ${item.resource.resourceType === "DocumentReference" ? `data-open-doc="${escapeHTML(item.resource.id)}"` : ""} tabindex="0" role="button"><span class="timeline-date">${escapeHTML(dateLabel(date))}</span><span class="timeline-symbol">${item.resource.resourceType === "Observation" ? "⌁" : item.resource.resourceType === "MedicationRequest" ? "▱" : item.resource.resourceType === "Encounter" ? "◎" : "▤"}</span><div><div class="timeline-event-title">${escapeHTML(eventDescription(item.resource))}</div><div class="timeline-event-detail">${escapeHTML(resourceTypeName(item.resource.resourceType))}${item.resource.resourceType === "DocumentReference" ? ` · ${escapeHTML(tr(reviewed(item.resource) ? "confirmed" : "needsReview"))}` : ""}</div></div><span class="timeline-tag">${escapeHTML(resourceTypeName(item.resource.resourceType))}</span></div>`).join("")}`).join("") || emptyState("emptyTimeline", "noRecordsCopy")}</div>`;
  $$("[data-timeline-filter]").forEach(button => button.addEventListener("click", () => { state.timelineFilter = button.dataset.timelineFilter; renderTimeline(); }));
}

function renderProfile() {
  const { patient, resources } = state.data;
  const observations = resources.filter(item => item.resourceType === "Observation");
  const medications = resources.filter(item => item.resourceType === "MedicationRequest");
  const counts = resources.reduce((result, item) => { result[item.resourceType] = (result[item.resourceType] || 0) + 1; return result; }, {});
  const identifier = patient.identifier?.find(item => item.system === "https://medlens.local/identifiers/simulated-abha")?.value || "—";
  const birth = patient.birthDate || "—";
  const age = birth === "—" ? "" : Math.floor((Date.now() - new Date(`${birth}T00:00:00`).getTime()) / 31557600000);
  $("#screen-profile").innerHTML = `<div class="screen-heading"><div><div class="eyebrow">${escapeHTML(tr("workspace"))}</div><h1>${escapeHTML(tr("profileTitle"))}</h1><p>${escapeHTML(tr("profileSub"))}</p></div><button class="button" data-action="export">⇩ &nbsp;${escapeHTML(tr("exportFhir"))}</button></div>
    <div class="profile-grid"><div class="panel profile-card"><h2>${escapeHTML(tr("personalDetails"))}</h2><div class="patient-head"><span class="patient-avatar">${escapeHTML((patient.name?.[0]?.given?.[0] || "A").slice(0, 1))}${escapeHTML((patient.name?.[0]?.family || "S").slice(0, 1))}</span><div><h3>${escapeHTML(patient.name?.[0]?.text || "Demo patient")}</h3><p>${escapeHTML(tr("sampleProfile"))} · ${age ? `${age} ${state.language === "hi" ? "वर्ष" : "years"}` : ""}</p></div></div>
      <div class="detail-grid"><div><div class="detail-label">${escapeHTML(tr("name"))}</div><div class="detail-value">${escapeHTML(patient.name?.[0]?.text || "—")}</div></div><div><div class="detail-label">${escapeHTML(tr("birthDate"))}</div><div class="detail-value">${escapeHTML(dateLabel(birth))}</div></div><div><div class="detail-label">${escapeHTML(tr("gender"))}</div><div class="detail-value">${escapeHTML(patient.gender || "—")}</div></div><div><div class="detail-label">${escapeHTML(tr("location"))}</div><div class="detail-value">${escapeHTML(patient.address?.[0]?.text || "—")}</div></div></div>
      <div class="abha-id"><div><small>${escapeHTML(tr("abhaId"))}</small><strong>${escapeHTML(identifier)}</strong></div><button class="button button-small" data-action="abha">${escapeHTML(tr("linkAbha"))}</button></div><p style="font-size:8px;color:#909b94;margin:9px 0 0">${escapeHTML(tr("abhaImported"))}</p></div>
    <div class="panel profile-card"><h2>${escapeHTML(tr("resourceOverview"))}</h2><div class="resource-list">${Object.entries({ Patient: "Patient", DocumentReference: "records", DiagnosticReport: "lab", Observation: "results", Condition: "diagnosesSection", MedicationRequest: "medication", Encounter: "visits" }).map(([key, label]) => `<div class="resource-chip"><span>${escapeHTML(key)}</span><strong>${counts[key] || 0}</strong></div>`).join("")}</div><div class="preview-section"><h3>${escapeHTML(tr("currentMedicines"))}</h3>${medications.length ? medications.map(item => `<div class="medicine-item"><strong>${escapeHTML(item.medicationCodeableConcept?.text || tr("medication"))}</strong><span>${escapeHTML(item.dosageInstruction?.[0]?.text || "")}</span></div>`).join("") : `<span style="font-size:9px;color:#849088">${escapeHTML(tr("noMedicines"))}</span>`}</div></div></div>
    <div class="panel trend-chart-card"><div class="chart-heading"><div><h2>${escapeHTML(tr("labTrends"))}</h2><p>${escapeHTML(tr("labTrendsSub"))}</p></div><select class="filter-select" id="trend-select" aria-label="${escapeHTML(tr("labTrends"))}">${[...new Set(observations.map(item => formatResult(item).name))].map(name => `<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join("") || `<option value="">${escapeHTML(tr("noValues"))}</option>`}</select></div><div id="trend-chart" class="chart-wrap"></div><p style="font-size:8px;color:#98a19c;margin:0">${escapeHTML(tr("notComparable"))}</p></div>`;
  renderTrendChart();
  $("#trend-select")?.addEventListener("change", renderTrendChart);
}

function renderTrendChart() {
  const select = $("#trend-select");
  const chart = $("#trend-chart");
  if (!select || !chart) return;
  const chosen = select.value;
  const items = state.data.resources.filter(item => item.resourceType === "Observation" && formatResult(item).name === chosen).sort((a, b) => (a.effectiveDateTime || "").localeCompare(b.effectiveDateTime || ""));
  const values = items.map(item => Number(item.valueQuantity?.value)).filter(Number.isFinite);
  if (!values.length) { chart.innerHTML = emptyState("noRecords", "noRecordsCopy"); return; }
  const width = 700, height = 170, pad = { l: 45, r: 15, t: 12, b: 30 };
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || Math.max(Math.abs(max) * .12, 1);
  const x = index => pad.l + (values.length === 1 ? (width - pad.l - pad.r) / 2 : index * (width - pad.l - pad.r) / (values.length - 1));
  const y = value => pad.t + (max + span * .15 - value) / (span * 1.3) * (height - pad.t - pad.b);
  const path = values.map((value, index) => `${index ? "L" : "M"}${x(index)},${y(value)}`).join(" ");
  const grid = Array.from({ length: 4 }, (_, index) => {
    const position = pad.t + index * (height - pad.t - pad.b) / 3;
    return `<line class="chart-grid" x1="${pad.l}" x2="${width - pad.r}" y1="${position}" y2="${position}"/>`;
  }).join("");
  chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHTML(chosen)} ${escapeHTML(tr("labTrends"))}">${grid}<path class="chart-line" d="${path}"/>${items.map((item, index) => `<circle class="chart-point" cx="${x(index)}" cy="${y(Number(item.valueQuantity.value))}" r="4"/><text class="chart-label" x="${x(index)}" y="${y(Number(item.valueQuantity.value)) - 9}" text-anchor="middle">${escapeHTML(item.valueQuantity.value)} ${escapeHTML(item.valueQuantity.unit || "")}</text><text class="chart-label" x="${x(index)}" y="${height - 8}" text-anchor="middle">${escapeHTML((item.effectiveDateTime || "").slice(0, 7))}</text>`).join("")}</svg>${values.length === 1 ? `<p style="text-align:center;color:#8b9790;font-size:9px">${escapeHTML(tr("oneResult"))}</p>` : ""}`;
}

function openModal(content) {
  $("#modal").innerHTML = content;
  $("#modal-backdrop").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $(".modal-close")?.addEventListener("click", closeModal);
  $("#modal-backdrop").addEventListener("click", event => { if (event.target.id === "modal-backdrop") closeModal(); }, { once: true });
  $("#modal").focus();
}
function closeModal() { $("#modal-backdrop").classList.add("hidden"); document.body.style.overflow = ""; }
function toast(message, error = false) {
  const item = document.createElement("div");
  item.className = `toast${error ? " error" : ""}`;
  item.textContent = message;
  $("#toast-region").append(item);
  setTimeout(() => item.remove(), 3600);
}

function extractionFor(doc) {
  const details = ext(doc);
  try { return JSON.parse(details["extraction-json"] || "{}"); } catch { return {}; }
}

function openUploadModal() {
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${escapeHTML(tr("uploadModalTitle"))}</h2><p>${escapeHTML(tr("uploadModalSub"))}</p></div><button class="modal-close" aria-label="${escapeHTML(tr("close"))}">×</button></div><div class="modal-body">
    <div class="privacy-callout">${escapeHTML(tr("uploadPrivacy"))}</div><div class="upload-zone" id="upload-zone"><div class="upload-symbol">⇧</div><strong>${escapeHTML(tr("dropText"))}</strong><p>${escapeHTML(tr("uploadFormats", { max_mb: state.data.max_upload_mb || 12 }))}</p><button class="button button-primary" type="button" id="browse-button">${escapeHTML(tr("browse"))}</button><input type="file" id="file-picker" accept=".pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff,application/pdf,image/*" hidden><div class="upload-support">${escapeHTML(state.data.ai_configured ? tr("aiConfigured") : tr("localExtraction"))}</div><div id="upload-progress" class="progress-wrap hidden"><div class="progress-track"><span id="progress-bar" style="width:0%"></span></div><div class="progress-copy"><span id="progress-copy">${escapeHTML(tr("processingProgress"))}</span><span id="progress-number">0%</span></div></div></div></div>`);
  const input = $("#file-picker");
  $("#browse-button").addEventListener("click", () => input.click());
  input.addEventListener("change", () => { if (input.files[0]) uploadFile(input.files[0]); });
  const zone = $("#upload-zone");
  zone.addEventListener("dragover", event => { event.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", event => { event.preventDefault(); zone.classList.remove("dragover"); if (event.dataTransfer.files[0]) uploadFile(event.dataTransfer.files[0]); });
}

function uploadFile(file) {
  if (!/\.(pdf|png|jpe?g|webp|tiff?)$/i.test(file.name)) { toast(tr("unsupported"), true); return; }
  if (file.size > (state.data.max_upload_mb || 12) * 1024 * 1024) { toast(tr("uploadError"), true); return; }
  const zone = $("#upload-zone");
  if (!zone) return;
  $("#upload-progress").classList.remove("hidden");
  $("#browse-button").disabled = true;
  const request = new XMLHttpRequest();
  request.open("POST", "/api/upload");
  request.upload.addEventListener("progress", event => {
    const progress = event.lengthComputable ? Math.min(95, Math.round(event.loaded / event.total * 100)) : 30;
    $("#progress-bar").style.width = `${progress}%`;
    $("#progress-number").textContent = `${progress}%`;
  });
  request.addEventListener("load", async () => {
    let result;
    try { result = JSON.parse(request.responseText); } catch { result = {}; }
    if (request.status < 200 || request.status >= 300) {
      toast(result.error || tr("uploadError"), true);
      $("#browse-button").disabled = false;
      $("#upload-progress").classList.add("hidden");
      return;
    }
    $("#progress-bar").style.width = "100%";
    $("#progress-number").textContent = "100%";
    await refresh();
    closeModal();
    openReviewModal(result.document, result.extraction, result.warnings || []);
  });
  request.addEventListener("error", () => { toast(tr("uploadFail"), true); $("#browse-button").disabled = false; });
  $("#progress-copy").textContent = tr("processing");
  request.send(file instanceof File ? (() => { const body = new FormData(); body.append("file", file, file.name); return body; })() : file);
}

function openReviewModal(doc, extraction = extractionFor(doc), warnings = []) {
  const details = ext(doc);
  const confidence = Number(details.confidence ?? extraction.confidence ?? .25);
  const safeExtraction = {
    record_date: extraction.record_date || recordDate(doc) || new Date().toISOString().slice(0, 10),
    record_type: extraction.record_type || refType(doc),
    medications: extraction.medications || [],
    observations: extraction.observations || [],
    diagnoses: extraction.diagnoses || []
  };
  const allWarnings = [...new Set(warnings)];
  try { allWarnings.push(...JSON.parse(details["warnings-json"] || "[]")); } catch { /* Invalid legacy warning data is not user content. */ }
  const warningList = [...new Set(allWarnings)];
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${escapeHTML(tr("reviewTitle"))}</h2><p>${escapeHTML(tr("reviewSub"))}</p></div><button class="modal-close" aria-label="${escapeHTML(tr("close"))}">×</button></div>
    <form id="review-form"><div class="modal-body">
      <div class="review-alert"><strong>${escapeHTML(tr("reviewWarning"))}</strong>${warningList.map(item => escapeHTML(item)).join("<br>") || escapeHTML(tr("reviewDisclaimer"))}</div>
      <div class="confidence-line"><span>${escapeHTML(tr("confidence"))}: <strong>${Math.round(confidence * 100)}%</strong></span><span class="confidence-track"><span style="width:${Math.round(confidence * 100)}%;background:${confidence < .6 ? "#d4a04b" : "#61a079"}"></span></span>${confidence < .6 ? `<span class="simulation-tag">${escapeHTML(tr("lowConfidence"))}</span>` : ""}</div>
      ${confidence < .6 ? `<div class="review-alert">${escapeHTML(tr("lowConfNotice"))}</div>` : ""}
      <div class="form-grid">
        <div class="form-field"><label for="review-title">${escapeHTML(tr("title"))}</label><input id="review-title" name="title" required maxlength="160" value="${escapeHTML(doc.description || "")}"></div>
        <div class="form-field"><label for="review-type">${escapeHTML(tr("recordType"))}</label><input id="review-type" name="record_type" required maxlength="80" value="${escapeHTML(safeExtraction.record_type)}"></div>
        <div class="form-field"><label for="review-date">${escapeHTML(tr("recordDate"))}</label><input id="review-date" name="record_date" type="date" required value="${escapeHTML(safeExtraction.record_date)}"></div>
        <div class="form-field"><label>${escapeHTML(tr("source"))}</label><input readonly value="${escapeHTML(details["source-name"] || doc.description || "")}"></div>
      </div>
      <div class="edit-section"><div class="edit-section-heading"><strong>${escapeHTML(tr("medicinesSection"))}</strong><button class="button button-small" type="button" data-add-row="medicine">${escapeHTML(tr("addMedicine"))}</button></div><div id="medication-rows">${(safeExtraction.medications.length ? safeExtraction.medications : []).map(medicineRow).join("") || `<div class="empty-row-note" style="font-size:9px;color:#98a29c">${escapeHTML(tr("noMedicines"))}</div>`}</div></div>
      <div class="edit-section"><div class="edit-section-heading"><strong>${escapeHTML(tr("testValues"))}</strong><button class="button button-small" type="button" data-add-row="observation">${escapeHTML(tr("addObservation"))}</button></div><div id="observation-rows">${(safeExtraction.observations.length ? safeExtraction.observations : []).map(observationRow).join("") || `<div class="empty-row-note" style="font-size:9px;color:#98a29c">${escapeHTML(tr("noValues"))}</div>`}</div></div>
      <div class="edit-section"><div class="edit-section-heading"><strong>${escapeHTML(tr("diagnosesSection"))}</strong><button class="button button-small" type="button" data-add-row="diagnosis">${escapeHTML(tr("addDiagnosis"))}</button></div><div id="diagnosis-rows">${(safeExtraction.diagnoses.length ? safeExtraction.diagnoses : []).map(diagnosisRow).join("") || `<div class="empty-row-note" style="font-size:9px;color:#98a29c">${escapeHTML(tr("noDiagnosis"))}</div>`}</div></div>
      <p class="disclaimer-box">${escapeHTML(tr("reviewDisclaimer"))}</p>
    </div><div class="modal-footer"><button class="button" type="button" data-action="close">${escapeHTML(tr("cancel"))}</button><button class="button button-primary" type="submit">${escapeHTML(tr("saveReview"))}</button></div></form>`);
  const form = $("#review-form");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(form);
    const payload = Object.fromEntries(["title", "record_type", "record_date"].map(key => [key, data.get(key)]));
    payload.medications = collectRows("#medication-rows", ["name", "dosage", "instructions"]);
    payload.observations = collectRows("#observation-rows", ["name", "value", "unit", "low", "high", "reference_text"]).map(item => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, value === "" ? null : ["value", "low", "high"].includes(key) ? Number(value) : value])));
    payload.diagnoses = collectRows("#diagnosis-rows", ["name"]).map(item => item.name).filter(Boolean);
    const submit = $('button[type="submit"]', form);
    submit.disabled = true;
    submit.textContent = tr("processing");
    try {
      await api(`/api/documents/${encodeURIComponent(doc.id)}/confirm`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      closeModal();
      await refresh();
      toast(tr("recordSaved"));
    } catch (error) { toast(error.message, true); submit.disabled = false; submit.textContent = tr("saveReview"); }
  });
  $$("[data-add-row]", form).forEach(button => button.addEventListener("click", () => {
    const type = button.dataset.addRow;
    const target = $(`#${type === "medicine" ? "medication" : type === "observation" ? "observation" : "diagnosis"}-rows`);
    $(".empty-row-note", target)?.remove();
    target.insertAdjacentHTML("beforeend", type === "medicine" ? medicineRow({}) : type === "observation" ? observationRow({}) : diagnosisRow(""));
    target.lastElementChild?.querySelector("input")?.focus();
  }));
  $$("[data-action='close']", form).forEach(button => button.addEventListener("click", closeModal));
  bindRowRemoval(form);
}

function medicineRow(item = {}) {
  return `<div class="editable-row" data-edit-row="medicine"><input name="name" aria-label="${escapeHTML(tr("medicineName"))}" placeholder="${escapeHTML(tr("medicineName"))}" value="${escapeHTML(item.name || "")}"><input name="dosage" aria-label="${escapeHTML(tr("dosage"))}" placeholder="${escapeHTML(tr("dosage"))}" value="${escapeHTML(item.dosage || "")}"><input name="instructions" aria-label="${escapeHTML(tr("instructions"))}" placeholder="${escapeHTML(tr("instructions"))}" value="${escapeHTML(item.instructions || "")}"><button type="button" class="remove-row" aria-label="${escapeHTML(tr("close"))}">×</button></div>`;
}
function observationRow(item = {}) {
  return `<div class="editable-row observation-row" data-edit-row="observation"><input name="name" aria-label="${escapeHTML(tr("testName"))}" placeholder="${escapeHTML(tr("testName"))}" value="${escapeHTML(item.name || "")}"><input name="value" type="number" step="any" aria-label="${escapeHTML(tr("value"))}" placeholder="${escapeHTML(tr("value"))}" value="${escapeHTML(item.value ?? "")}"><input name="unit" aria-label="${escapeHTML(tr("unit"))}" placeholder="${escapeHTML(tr("unit"))}" value="${escapeHTML(item.unit || "")}"><input name="low" type="number" step="any" aria-label="${escapeHTML(tr("low"))}" placeholder="${escapeHTML(tr("low"))}" value="${escapeHTML(item.low ?? "")}"><input name="high" type="number" step="any" aria-label="${escapeHTML(tr("high"))}" placeholder="${escapeHTML(tr("high"))}" value="${escapeHTML(item.high ?? "")}"><input name="reference_text" aria-label="${escapeHTML(tr("reference"))}" placeholder="${escapeHTML(tr("reference"))}" value="${escapeHTML(item.reference_text || "")}"><button type="button" class="remove-row" aria-label="${escapeHTML(tr("close"))}">×</button></div>`;
}
function diagnosisRow(item = "") {
  return `<div class="editable-row diagnosis-row" data-edit-row="diagnosis"><input name="name" aria-label="${escapeHTML(tr("diagnosesSection"))}" placeholder="${escapeHTML(tr("diagnosesSection"))}" value="${escapeHTML(typeof item === "string" ? item : item.name || "")}"><button type="button" class="remove-row" aria-label="${escapeHTML(tr("close"))}">×</button></div>`;
}
function bindRowRemoval(root) {
  root.addEventListener("click", event => {
    const button = event.target.closest?.(".remove-row");
    const row = button?.closest("[data-edit-row]");
    if (!row || !root.contains(row)) return;
    const container = row.parentElement;
    row.remove();
    if (!container.querySelector("[data-edit-row]")) {
      const kind = container.id.startsWith("medication") ? "noMedicines" : container.id.startsWith("observation") ? "noValues" : "noDiagnosis";
      container.innerHTML = `<div class="empty-row-note" style="font-size:9px;color:#98a29c">${escapeHTML(tr(kind))}</div>`;
    }
  });
}
function collectRows(selector, fields) {
  return $$("[data-edit-row]", $(selector)).map(row => Object.fromEntries(fields.map(field => [field, $(`[name="${field}"]`, row).value.trim()])));
}

function openRecord(docId) {
  const doc = state.data.documents.find(item => item.id === docId);
  if (!doc) return;
  const details = ext(doc);
  const resources = state.data.resources.filter(item => (doc.context?.related || []).some(link => link.reference === `${item.resourceType}/${item.id}`));
  const observations = resources.filter(item => item.resourceType === "Observation");
  const medicines = resources.filter(item => item.resourceType === "MedicationRequest");
  const conditions = resources.filter(item => item.resourceType === "Condition");
  const confidence = Number(details.confidence || 0);
  const attachment = doc.content?.[0]?.attachment || {};
  const fileUrl = attachment.url?.startsWith("uploads/") ? `/${attachment.url}` : "";
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${escapeHTML(doc.description || tr("document"))}</h2><p>${escapeHTML(refType(doc))} &nbsp;·&nbsp; ${escapeHTML(dateLabel(recordDate(doc)))}</p></div><button class="modal-close" aria-label="${escapeHTML(tr("close"))}">×</button></div>
    <div class="preview-content"><div class="preview-meta"><span class="record-status ${reviewed(doc) ? "" : "review"}">${escapeHTML(tr(reviewed(doc) ? "confirmed" : "needsReview"))}</span><span>${escapeHTML(tr("confidence"))}: ${Math.round(confidence * 100)}%</span>${fileUrl ? `<a class="text-link" target="_blank" rel="noreferrer" href="${escapeHTML(fileUrl)}">${escapeHTML(tr("viewDocument"))} ↗</a>` : ""}</div>
      ${details["warnings-json"] && JSON.parse(details["warnings-json"] || "[]").length ? `<div class="review-alert"><strong>${escapeHTML(tr("warning"))}</strong>${JSON.parse(details["warnings-json"]).map(item => escapeHTML(item)).join("<br>")}</div>` : ""}
      <div class="preview-summary"><strong>${escapeHTML(tr("summary"))} · ${escapeHTML(state.language === "hi" ? "हिंदी" : "English")}</strong>${escapeHTML(summaryFor(doc))}</div><p class="disclaimer-box">${escapeHTML(tr("aiDisclaimer"))}</p>
      <div class="preview-section"><h3>${escapeHTML(tr("capturedValues"))}</h3>${observations.length ? `<table class="value-table"><thead><tr><th>${escapeHTML(tr("testName"))}</th><th>${escapeHTML(tr("value"))}</th><th>${escapeHTML(tr("reference"))}</th><th>${escapeHTML(tr("status"))}</th></tr></thead><tbody>${observations.map(item => { const value = formatResult(item); const resultValue = Number(value.value); const reference = item.referenceRange?.[0] || {}; const low = reference.low?.value; const high = reference.high?.value; const status = item.interpretation?.[0]?.text || (high != null && resultValue > high ? "high" : low != null && resultValue < low ? "low" : ""); const hasComparableRange = low != null || high != null; return `<tr><td>${escapeHTML(value.name)}</td><td>${escapeHTML(value.value)} ${escapeHTML(value.unit)}</td><td>${escapeHTML(value.range || "—")}</td><td>${status ? `<span class="value-flag">${escapeHTML(tr(status === "high" ? "resultFlagHigh" : "resultFlagLow"))}</span>` : hasComparableRange ? escapeHTML(tr("withinRange")) : "—"}</td></tr>`; }).join("")}</tbody></table>` : `<span style="font-size:9px;color:#88948d">${escapeHTML(tr("noValues"))}</span>`}</div>
      <div class="preview-section"><h3>${escapeHTML(tr("medicinesSection"))}</h3>${medicines.map(item => `<div class="medicine-item"><strong>${escapeHTML(item.medicationCodeableConcept?.text || "")}</strong><span>${escapeHTML(item.dosageInstruction?.[0]?.text || "")}</span></div>`).join("") || `<span style="font-size:9px;color:#88948d">${escapeHTML(tr("noMedicines"))}</span>`}</div>
      <div class="preview-section"><h3>${escapeHTML(tr("diagnosesSection"))}</h3>${conditions.map(item => `<div class="medicine-item"><strong>${escapeHTML(item.code?.text || "")}</strong><span>${escapeHTML(item.verificationStatus?.text || "")}</span></div>`).join("") || `<span style="font-size:9px;color:#88948d">${escapeHTML(tr("noDiagnosis"))}</span>`}</div>
    </div><div class="modal-footer"><button class="button" data-action="delete">${escapeHTML(tr("deleteRecord"))}</button><span style="flex:1"></span><button class="button" data-action="close">${escapeHTML(tr("close"))}</button><button class="button button-primary" data-action="edit">${escapeHTML(tr("editRecord"))}</button></div>`);
  $("[data-action='close']", $("#modal")).addEventListener("click", closeModal);
  $("[data-action='edit']", $("#modal")).addEventListener("click", () => openReviewModal(doc));
  $("[data-action='delete']", $("#modal")).addEventListener("click", async () => {
    if (!confirm(tr("deleteConfirm"))) return;
    try { await api(`/api/documents/${encodeURIComponent(doc.id)}`, { method: "DELETE" }); closeModal(); await refresh(); toast(tr("recordDeleted")); }
    catch (error) { toast(error.message, true); }
  });
}

function openAbhaModal() {
  const current = state.data.patient.identifier?.find(item => item.system === "https://medlens.local/identifiers/simulated-abha")?.value || "";
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${escapeHTML(tr("abhaModalTitle"))}</h2><p>${escapeHTML(tr("abhaModalSub"))}</p></div><button class="modal-close" aria-label="${escapeHTML(tr("close"))}">×</button></div><form id="abha-form"><div class="modal-body"><div class="review-alert">${escapeHTML(tr("abhaWarning"))}</div><div class="form-field"><label for="abha-id">${escapeHTML(tr("abhaNumber"))}</label><input id="abha-id" name="abha_id" required inputmode="numeric" pattern="([0-9]{14}|[0-9]{2}(-[0-9]{4}){3})" maxlength="19" value="${escapeHTML(current)}" placeholder="12-3456-7890-1234"></div><p class="privacy-callout">${escapeHTML(tr("abhaImported"))}</p></div><div class="modal-footer"><button class="button" type="button" data-action="close">${escapeHTML(tr("cancel"))}</button><button class="button button-primary" type="submit">${escapeHTML(tr("saveSimulation"))}</button></div></form>`);
  $("#abha-form").addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await api("/api/abha/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ abha_id: new FormData(event.target).get("abha_id") }) });
      closeModal();
      await refresh();
      toast(tr("abhaSaved"));
    } catch (error) { toast(error.message, true); }
  });
  $("[data-action='close']", $("#modal")).addEventListener("click", closeModal);
}

function openLearnModal() {
  openModal(`<div class="modal-header"><div><h2 id="modal-title">${escapeHTML(tr("learnMore"))}</h2><p>MedLens · AI-Powered Personal Health Copilot</p></div><button class="modal-close" aria-label="${escapeHTML(tr("close"))}">×</button></div><div class="modal-body"><div class="learn-list"><div>${escapeHTML(tr("footerDisclaimer"))}</div><div>${escapeHTML(tr("reviewDisclaimer"))}</div><div>${escapeHTML(tr("uploadPrivacy"))}</div><div>${escapeHTML(tr("abhaWarning"))}</div><div>${escapeHTML(tr("abhaImported"))}</div></div></div><div class="modal-footer"><button class="button button-primary" data-action="close">${escapeHTML(tr("close"))}</button></div>`);
  $("[data-action='close']", $("#modal")).addEventListener("click", closeModal);
}

function exportBundle() {
  const link = document.createElement("a");
  link.href = "/api/export/fhir";
  link.download = "medlens-fhir-bundle.json";
  link.click();
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-nav]");
  if (nav) { event.preventDefault(); setPage(nav.dataset.nav); return; }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "upload") openUploadModal();
  else if (action === "abha") openAbhaModal();
  else if (action === "export") exportBundle();
  else if (action === "learn") openLearnModal();
  else if (action === "signout") {
    sessionStorage.removeItem("medlens-demo-session");
    closeModal();
    document.body.classList.add("login-required");
    $("#login-screen").classList.remove("hidden");
    renderLogin();
  }
  const doc = event.target.closest("[data-open-doc]");
  if (doc && !action) openRecord(doc.dataset.openDoc);
});
document.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open-doc]")) {
    event.preventDefault();
    openRecord(event.target.dataset.openDoc);
  }
  if (event.key === "Escape" && !$("#modal-backdrop").classList.contains("hidden")) closeModal();
});
$("#language-toggle").value = state.language;
$("#language-toggle").addEventListener("change", event => setLanguage(event.target.value));
$("#footer-learn").addEventListener("click", openLearnModal);

async function start() {
  setLanguage(state.language);
  if (sessionStorage.getItem("medlens-demo-session") !== "active") {
    document.body.classList.add("login-required");
    renderLogin();
    $("#login-screen").classList.remove("hidden");
    return;
  }
  $("#screen-overview").innerHTML = `<div class="loading-state"><div class="spinner"></div>${escapeHTML(tr("pageLoading"))}</div>`;
  try { await refresh(); }
  catch (error) { $("#screen-overview").innerHTML = `<div class="empty-state"><strong>${escapeHTML(tr("uploadError"))}</strong><span>${escapeHTML(error.message)}</span></div>`; }
}
start();
