const fs = require('fs');
const path = require('path');

// Helper to generate unique combinations and ensure no duplicates
function buildUniquePool(introArray, bodyArray, outroArray, extraSingles = [], minTarget = 60) {
  const set = new Set();

  // Add individual handcrafted single templates first
  for (const s of extraSingles) {
    if (s && s.trim()) set.add(s.trim());
  }

  // Combine permutations
  for (const intro of introArray) {
    for (const body of bodyArray) {
      for (const outro of outroArray) {
        const full = `${intro} ${body} ${outro}`.replace(/\s+/g, ' ').trim();
        set.add(full);
        if (set.size >= minTarget) break;
      }
      if (set.size >= minTarget) break;
    }
    if (set.size >= minTarget) break;
  }

  return Array.from(set);
}

// =========================================================================
// 1. HOSPITAL & HEALTHCARE (Target: ~300 reviews -> ~120 English, ~90 Hindi, ~90 Marathi)
// =========================================================================

// --- Hospital English ---
const hospEnIntros = [
  "I had an exceptional experience at {businessName} for {serviceName} under the expert care of {doctorName}.",
  "Consulting {doctorName} at {businessName} was one of the best medical decisions our family ever made.",
  "Outstanding medical service and utmost compassion at {businessName} during my {serviceName}.",
  "Visited {businessName} recently for {serviceName} with {doctorName}.",
  "I am deeply thankful to {doctorName} and the entire medical team at {businessName}.",
  "From the moment we arrived at {businessName} for {serviceName}, the care was world-class.",
  "Had a completely smooth and painless {serviceName} procedure at {businessName}.",
  "The clinical expertise demonstrated by {doctorName} at {businessName} is truly commendable.",
  "My parent was admitted to {businessName} for {serviceName} under {doctorName}.",
  "Getting treated by {doctorName} at {businessName} for {serviceName} gave us immense confidence.",
  "Modern medical infrastructure, clean wards, and fantastic doctors at {businessName}.",
  "We reached out to {businessName} for emergency consultation regarding {serviceName}.",
  "Highly impressed with the patient-centric approach of {doctorName} at {businessName}.",
  "Booking an appointment for {serviceName} with {doctorName} at {businessName} was quick and hassle-free."
];

const hospEnBodies = [
  "{doctorName} was remarkably attentive, explaining every stage of the treatment with utmost clarity and empathy.",
  "The nursing team provided round-the-clock supportive care, ensuring complete comfort and safety.",
  "State-of-the-art diagnostic equipment and clean premises made the entire procedure seamless.",
  "The diagnosis was spot-on, and the recovery guidance provided by {doctorName} was thoroughly detailed.",
  "{doctorName} patiently resolved every doubt we had and recommended only the necessary medications.",
  "The OT hygiene, post-operative monitoring, and staff responsiveness were flawless throughout.",
  "Minimal waiting time, polite front-desk staff, and supreme medical precision from {doctorName}.",
  "The hospital management operates with remarkable efficiency and transparent billing estimates.",
  "{doctorName} displayed extraordinary bedside manners and deep clinical knowledge during {serviceName}."
];

const hospEnOutros = [
  "Truly the best hospital for trustworthy healthcare! Highly recommended! ⭐⭐⭐⭐⭐",
  "A 5-star experience from admission to discharge! ⭐⭐⭐⭐⭐",
  "We are truly grateful for the compassionate treatment. 5 stars! ⭐⭐⭐⭐⭐",
  "Will definitely recommend {doctorName} and {businessName} to all our relatives and friends! ⭐⭐⭐⭐⭐",
  "Exceptional clinical care and warm hospitality. Thank you team! ⭐⭐⭐⭐⭐",
  "Top-tier doctors and commendable nursing staff. 5/5 stars! ⭐⭐⭐⭐⭐",
  "Restored my health swiftly with genuine care. Highly appreciated! ⭐⭐⭐⭐⭐",
  "Gold standard in patient care and medical excellence! ⭐⭐⭐⭐⭐"
];

// --- Hospital Hindi ---
const hospHiIntros = [
  "{businessName} में {doctorName} से {serviceName} के परामर्श और उपचार का अनुभव अत्यंत शानदार रहा।",
  "{businessName} में {doctorName} द्वारा दी गई चिकित्सा सेवा बेहद संतोषजनक और भरोसेमंद रही।",
  "आधुनिक मशीनें और बेहतरीन डॉक्टर्स! {businessName} में {serviceName} के लिए {doctorName} से परामर्श लिया।",
  "{businessName} का नर्सिंग स्टाफ और डॉक्टर {doctorName} बहुत सहयोगी और संवेदनशील हैं।",
  "अपने परिवार के सदस्य के {serviceName} के लिए {businessName} गया था।",
  "कम समय में सटीक और बेहतरीन उपचार! {businessName} में {doctorName} से मिलकर बहुत हिम्मत मिली।",
  "{businessName} में {doctorName} के मार्गदर्शन में {serviceName} बहुत ही सुरक्षित और सुलभ तरीके से संपन्न हुआ।",
  "हमारे पूरे परिवार का {businessName} और डॉक्टर {doctorName} पर अटूट विश्वास है।",
  "{serviceName} की समस्या को लेकर काफी चिंतित था, लेकिन {businessName} में {doctorName} ने सब आसान कर दिया।",
  "{businessName} में ओपीडी परामर्श और {serviceName} की प्रक्रिया बहुत ही व्यवस्थित थी।",
  "उत्कृष्ट चिकित्सा प्रबंधन और समर्पित नर्सिंग सेवा के लिए {businessName} प्रसिद्ध है।"
];

const hospHiBodies = [
  "डॉक्टर साहब बहुत विनम्र, अनुभवी और मददगार हैं तथा उन्होंने हर बात को बहुत सरलता से समझाया।",
  "अस्पताल में स्वच्छता, आधुनिक उपकरण और 24 घंटे तत्पर नर्सिंग देखभाल वास्तव में विश्वस्तरीय है।",
  "सटीक जांच और सही दवाइयों के कारण स्वास्थ्य में बहुत तेज़ी से सुधार हुआ।",
  "{doctorName} ने बिना किसी अनावश्यक टेस्ट के केवल उचित और आवश्यक मार्गदर्शन दिया।",
  "रिसेप्शन से लेकर डिस्चार्ज तक की पूरी प्रक्रिया बहुत पारदर्शी और सहज रही।",
  "मरीजों के आराम और मानसिक शांति का पूरा ध्यान रखा जाता है जो बहुत सुकून देने वाला है।",
  "{doctorName} की कार्यकुशलता और स्टाफ का आत्मीय व्यवहार मन को छू गया।"
];

const hospHiOutros = [
  "उत्तम अस्पताल और बेहतरीन डॉक्टर! सभी को यहाँ आने की सलाह दूंगा। ⭐⭐⭐⭐⭐",
  "{serviceName} के लिए {businessName} सबसे उत्तम विकल्प है। 5 स्टार! ⭐⭐⭐⭐⭐",
  "सही मार्गदर्शन और उचित देखभाल के लिए बहुत-बहुत धन्यवाद! ⭐⭐⭐⭐⭐",
  "ईमानदार चिकित्सा और बेहतरीन देखभाल! 5 स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "मरीजों की सेवा के प्रति समर्पण सराहनीय है। आभार! ⭐⭐⭐⭐⭐",
  "विश्वसनीय स्वास्थ्य सेवा के लिए सर्वोत्तम अस्पताल! ⭐⭐⭐⭐⭐"
];

// --- Hospital Marathi ---
const hospMrIntros = [
  "{businessName} मध्ये {doctorName} यांच्याकडून {serviceName} उपचाराचा अनुभव अत्यंत समाधानकारक राहिला.",
  "{businessName} येथे {doctorName} यांच्याकडून मिळालेली वैद्यकीय सेवा अतिशय उच्च दर्जाची आहे.",
  "अत्याधुनिक वैद्यकीय उपकरणे आणि स्वच्छता! {businessName} मध्ये {serviceName} साठी {doctorName} यांचा सल्ला घेतला.",
  "{businessName} मधील नर्सिंग स्टाफ व डॉक्टर {doctorName} यांचे सहकार्य खूप मोलाचे होते.",
  "आमच्या संपूर्ण कुटुंबाचा {businessName} वर पूर्ण विश्वास आहे.",
  "वेळेवर उपचार, शांत परिसर आणि स्वच्छ वातावरणामुळे {businessName} मधील अनुभव उत्कृष्ट ठरला.",
  "{businessName} रुग्णालयातील व्यवस्थापन अतिशय शिस्तबद्ध आणि रुग्णहितैषी आहे.",
  "{doctorName} हे अत्यंत अनुभवी आणि मनमिळाऊ डॉक्टर असून {businessName} मधील सेवा उत्तम आहे.",
  "{serviceName} उपचारासाठी {businessName} ची निवड करणे अत्यंत फायदेशीर ठरले.",
  "कमीत कमी वेळेत अचूक निदान आणि उपचार {businessName} मध्ये {doctorName} यांच्याकडून मिळाले."
];

const hospMrBodies = [
  "डॉक्टर खूप काळजीपूर्वक मार्गदर्शन करतात आणि सर्व कर्मचारी अतिशय नम्र व सहकार्यशील आहेत.",
  "{serviceName} उपचारादरम्यान आम्हाला खूप मानसिक धीर आणि अचूक वैद्यकीय मार्गदर्शन लाभले.",
  "अतिशय सुलभ, पारदर्शक आणि व्यवस्थित उपचार पद्धतीमुळे रुग्ण अल्पावधीत बरा झाला.",
  "{doctorName} यांनी अनावश्यक तपासण्या न सांगता योग्य तोच उपचार केला ही बाब खूप भावली.",
  "रुग्णालयातील प्रवेशापासून ते डिस्चार्जपर्यंतची सर्व प्रक्रिया अत्यंत गतिमान आणि विनात्रास पार पडली.",
  "स्वच्छ वॉर्ड्स, तत्पर नर्सिंग केअर आणि डॉक्टरांचे आपुलकीचे बोलणे खूप समाधान देणारे आहे."
];

const hospMrOutros = [
  "सर्वोत्तम रुग्णालय आणि तज्ज्ञ डॉक्टर! मनापासून धन्यवाद! ⭐⭐⭐⭐⭐",
  "{serviceName} साठी {businessName} परिसरातील नंबर १ रुग्णालय आहे. ५ स्टार! ⭐⭐⭐⭐⭐",
  "दर्जेदार वैद्यकीय उपचार आणि उत्कृष्ट रुग्णसेवा! नक्की शिफारस करेन. ⭐⭐⭐⭐⭐",
  "डॉक्टर {doctorName} आणि {businessName} च्या संपूर्ण टीमला मानाचा मुजरा! ⭐⭐⭐⭐⭐",
  "विश्वासार्ह आरोग्य सेवेसाठी सर्वोत्तम पर्याय! ५/५ स्टार! ⭐⭐⭐⭐⭐"
];

// =========================================================================
// 2. AUTOMOTIVE & GARAGE (Target: ~180 reviews -> ~70 English, ~55 Hindi, ~55 Marathi)
// =========================================================================

// --- Auto English ---
const autoEnIntros = [
  "Exceptional vehicle service at {businessName}! Their mechanics were extremely knowledgeable.",
  "Best garage and auto repair workshop in town! Brought my car to {businessName} for {serviceName}.",
  "Very honest, dependable, and professional mechanics at {businessName}.",
  "Top-quality automobile care and maintenance at {businessName}.",
  "Outstanding customer care and genuine spare parts provided by {businessName} for {serviceName}.",
  "Reliable and prompt service at {businessName} for my recent {serviceName}.",
  "The technicians at {businessName} are master mechanics who know their craft thoroughly.",
  "Got stranded with a breakdown, and {businessName} came to the rescue immediately for {serviceName}.",
  "My car runs noticeably smoother and quieter after the {serviceName} at {businessName}.",
  "Fair pricing, no hidden charges, and quick turnaround for {serviceName} at {businessName}."
];

const autoEnBodies = [
  "They diagnosed the issue quickly and fixed our {serviceName} with great expertise and transparent pricing.",
  "They explained all the work done clearly, showed the replaced parts, and kept me updated throughout.",
  "The workshop floor is clean, equipped with modern diagnostic scanners, and run by polite staff.",
  "Fast turnaround time, perfect execution on {serviceName}, and complimentary car wash before delivery.",
  "Solved a tricky suspension noise during {serviceName} that two other workshops couldn't figure out.",
  "Genuine OEM spare parts with warranty and reasonable labor charges."
];

const autoEnOutros = [
  "Highly recommended to all car and bike owners! ⭐⭐⭐⭐⭐",
  "5 stars for transparency, speed, and honesty! ⭐⭐⭐⭐⭐",
  "My go-to auto repair center for all future vehicle needs! ⭐⭐⭐⭐⭐",
  "A dependable workshop that treats your vehicle like their own. Top marks! ⭐⭐⭐⭐⭐",
  "Best automotive service experience! Will definitely visit again! ⭐⭐⭐⭐⭐"
];

// --- Auto Hindi ---
const autoHiIntros = [
  "{businessName} में गाड़ी की सर्विसिंग और रिपेयर का अनुभव बहुत ही शानदार रहा।",
  "बहुत ही ईमानदार और अनुभवी मैकेनिक हैं {businessName} में।",
  "{businessName} में गाड़ी की जांच और {serviceName} बहुत ही पेशेवर ढंग से की गई।",
  "गाड़ी में लंबे समय से आ रही आवाज़ को {businessName} के कारीगरों ने {serviceName} में तुरंत ठीक कर दिया।",
  "{businessName} में असली स्पेयर पार्ट्स और आधुनिक मशीनों से काम होता है।",
  "उचित मूल्य और समय पर डिलीवरी! {businessName} में {serviceName} का काम बिना किसी झंझट के पूरा हुआ।",
  "{businessName} की वर्कशॉप बहुत ही साफ-सुथरी और सुव्यवस्थित है।"
];

const autoHiBodies = [
  "{serviceName} का काम बहुत ही कुशलता, ईमानदारी और समय की पाबंदी के साथ किया गया।",
  "स्टाफ बहुत विनम्र है और उन्होंने काम से पहले स्पष्ट एस्टीमेट देकर समझाया।",
  "{serviceName} के बाद गाड़ी की ड्राइविंग और माइलेज दोनों एकदम नए जैसे हो गए हैं।",
  "बिना फालतू पार्ट्स बदले सही रिपेयरिंग करना इनकी सबसे बड़ी खूबी है।",
  "गाड़ी की पूरी धुलाई और इंटीरियर सफाई के साथ तय समय में हैंडओवर मिला।"
];

const autoHiOutros = [
  "5 स्टार गैराज! सभी को यहाँ आने की पुरजोर सलाह दूंगा। ⭐⭐⭐⭐⭐",
  "अत्यधिक अनुशंसित ऑटो वर्कशॉप! बहुत बढ़िया काम! ⭐⭐⭐⭐⭐",
  "सस्ते दाम में बेहतरीन सर्विसिंग! बहुत-बहुत धन्यवाद! ⭐⭐⭐⭐⭐",
  "गाड़ी के काम के लिए सबसे भरोसेमंद जगह! 5 स्टार! ⭐⭐⭐⭐⭐"
];

// --- Auto Marathi ---
const autoMrIntros = [
  "{businessName} मध्ये वाहनाची सर्व्हिसिंग आणि दुरुस्ती अतिशय उत्तम प्रकारे झाली.",
  "अतिशय प्रामाणिक आणि कुशल मेकॅनिक्स! {businessName} मध्ये {serviceName} साठी गेलो होतो.",
  "{businessName} मधील सेवा तत्पर आणि दर्जेदार असून {serviceName} चे काम वेळेत मिळाले.",
  "गाडीतील जुनाट बिघाड {businessName} मधील मेकॅनिक्सनी {serviceName} दरम्यान अचूक शोधून काढला.",
  "{businessName} मध्ये ओरिजिनल स्पेयर पार्ट्स आणि आधुनिक तंत्रज्ञानाने काम केले जाते.",
  "पारदर्शक बिलिंग आणि कामाची खात्री देणारे {businessName} हे परिसरातील विश्वासार्ह गॅरेज आहे."
];

const autoMrBodies = [
  "{serviceName} चे काम वेळेत, अचूक आणि अत्यंत वाजवी दरात करून मिळाले.",
  "गाडीचा पिकअप आणि स्मूथनेस आता अगदी नव्या गाडीसारखा वाटतोय.",
  "अनावश्यक खर्च न वाढवता योग्य सल्ला देणे ही {businessName} ची खासियत आहे.",
  "कर्मचाऱ्यांचे नम्र वर्तन आणि कामातील टापटीप खरोखरच कौतुकास्पद आहे."
];

const autoMrOutros = [
  "सर्वोत्तम गॅरेज! नक्की भेट द्या! ५ स्टार! ⭐⭐⭐⭐⭐",
  "{serviceName} च्या कामासाठी {businessName} ला ५/५ स्टार! ⭐⭐⭐⭐⭐",
  "विश्वासार्ह मेकॅनिक्स आणि वेळेवर डिलिव्हरी! मनापासून धन्यवाद! ⭐⭐⭐⭐⭐",
  "गाडीच्या कामासाठी खात्रीशीर ठिकाण! ⭐⭐⭐⭐⭐"
];

// =========================================================================
// 3. DINING & RESTAURANT (Target: ~160 reviews -> ~65 English, ~48 Hindi, ~48 Marathi)
// =========================================================================

// --- Dining English ---
const dinEnIntros = [
  "Absolutely delicious food and fantastic atmosphere at {businessName}!",
  "Great presentation, quick service, and sparkling clean ambience at {businessName}.",
  "Top-notch culinary experience at {businessName}! Every dish was flavorful.",
  "Warm hospitality, cozy seating, and mouth-watering {serviceName} at {businessName}.",
  "A must-visit food destination! {businessName} never disappoints with authentic taste.",
  "Incredible flavors, generous portion sizes, and hygienic food prep at {businessName}.",
  "Celebrated a family occasion at {businessName} and the dining experience was memorable.",
  "The chef at {businessName} truly works magic with spices and fresh ingredients."
];

const dinEnBodies = [
  "The {serviceName} was freshly prepared, bursting with authentic flavors, and served piping hot.",
  "Attentive staff, quick table turnaround, and soothing music added to the wonderful vibe.",
  "From welcome drinks to the main course {serviceName}, every item was cooked to perfection.",
  "The presentation was photogenic and the portion sizes were very generous for the price.",
  "Courteous waiters who happily accommodated our dietary preferences with great smiles."
];

const dinEnOutros = [
  "Highly recommend to all food lovers! 5 stars! ⭐⭐⭐⭐⭐",
  "Will definitely be returning with family and friends! ⭐⭐⭐⭐⭐",
  "Best restaurant in the city for authentic dining! ⭐⭐⭐⭐⭐",
  "A delightful culinary delight all the way! 5/5 stars! ⭐⭐⭐⭐⭐"
];

// --- Dining Hindi ---
const dinHiIntros = [
  "{businessName} में लाजवाब स्वाद और बहुत ही शानदार माहौल!",
  "परिवार के साथ भोजन के लिए {businessName} सबसे बढ़िया जगह है।",
  "{businessName} में हर व्यंजन का स्वाद अनोखा और ताज़ा है।",
  "बहुत ही खूबसूरत इंटीरियर, तेज़ सर्विस और स्वादिष्ट खाना {businessName} की पहचान है।",
  "उचित दाम, भरपूर मात्रा और बेहतरीन स्वाद! {businessName} में भोजन का मज़ा आ गया।"
];

const dinHiBodies = [
  "{serviceName} का स्वाद बेहद लाजवाब था और खुशबू ने दिल जीत लिया।",
  "स्टाफ बहुत ही विनम्र और तत्पर था तथा खाना एकदम गरमा-गरम परोसा गया।",
  "साफ-सफाई और हाइजीन का पूरा ध्यान रखा गया है जो बहुत सराहनीय है।",
  "असली मसालों का स्वाद और ताज़ी सामग्री का उपयोग साफ झलकता है।"
];

const dinHiOutros = [
  "स्वाद के दीवानों के लिए 5 स्टार जगह! ⭐⭐⭐⭐⭐",
  "यहाँ का खाना हमेशा याद रहेगा। बहुत बढ़िया! ⭐⭐⭐⭐⭐",
  "किफायती दामों में फाइव स्टार जैसा अनुभव! ⭐⭐⭐⭐⭐",
  "पुनः ज़रूर आएंगे! 5 स्टार रेटिंग! ⭐⭐⭐⭐⭐"
];

// --- Dining Marathi ---
const dinMrIntros = [
  "{businessName} मधील जेवणाची चव आणि स्वच्छता खरोखरच अप्रतिम आहे.",
  "उत्तम बैठक व्यवस्था, तत्पर सेवा आणि चवदार खाद्यपदार्थ {businessName} मध्ये मिळतात.",
  "कुटुंबासमवेत जेवणाचा आनंद घेण्यासाठी {businessName} हे सर्वोत्तम ठिकाण आहे.",
  "{businessName} मधील आतिथ्य आणि कर्मचाऱ्यांची तत्परता कौतुकास्पद आहे.",
  "अस्सल चव आणि मन तृप्त करणारे जेवण {businessName} मध्ये अनुभवता आले."
];

const dinMrBodies = [
  "{serviceName} चा स्वाद अतिशय रुचकर होता आणि जिभेवर रेंगाळत राहिला.",
  "स्वच्छ किचन, प्रसन्न वातावरण आणि गरमागरम पदार्थ लगेच सर्व्ह झाले.",
  "माफक दरात भरपूर प्रमाण आणि उत्कृष्ट दर्जाचे जेवण मिळाले.",
  "कर्मचाऱ्यांची नम्र सेवा आणि शांत संगीतामुळे संध्याकाळ खूप छान गेली."
];

const dinMrOutros = [
  "पुन्हा नक्की भेट देणार! ५ स्टार! ⭐⭐⭐⭐⭐",
  "खवय्यांसाठी सर्वोत्तम पर्वणी! मनापासून धन्यवाद! ⭐⭐⭐⭐⭐",
  "उत्कृष्ट चव आणि सर्वोत्तम सेवा! ५/५ स्टार! ⭐⭐⭐⭐⭐",
  "हॉटेलमधील अनुभव अप्रतिम राहिला! ⭐⭐⭐⭐⭐"
];

// =========================================================================
// 4. RETAIL & SHOPPING (Target: ~130 reviews -> ~50 English, ~40 Hindi, ~40 Marathi)
// =========================================================================

// --- Retail English ---
const retEnIntros = [
  "Impressive collection, competitive pricing, and courteous staff at {businessName}.",
  "Seamless shopping experience at {businessName} with plenty of modern options.",
  "Great variety, genuine products, and very welcoming staff at {businessName}.",
  "High quality items and fantastic customer support at {businessName}.",
  "Very organized store layout, wide aisles, and quick billing at {businessName}."
];

const retEnBodies = [
  "Found exactly what I needed for {serviceName} at a great discounted price.",
  "Staff helped me compare different options patiently without any pushy sales tactics.",
  "Authentic brand warranty, premium build quality, and neat packaging.",
  "Hassle-free payment options and transparent billing made shopping very enjoyable."
];

const retEnOutros = [
  "My go-to store for all future purchases! 5 stars! ⭐⭐⭐⭐⭐",
  "Super happy with my purchase! Highly recommended! ⭐⭐⭐⭐⭐",
  "Top quality retail store in town! 5/5 stars! ⭐⭐⭐⭐⭐",
  "Best shopping experience with great value for money! ⭐⭐⭐⭐⭐"
];

// --- Retail Hindi ---
const retHiIntros = [
  "{businessName} में शानदार वैरायटी और बहुत अच्छा स्टाफ है।",
  "उचित दाम और उच्च गुणवत्ता वाले सामान के लिए {businessName} प्रसिद्ध है।",
  "{businessName} में ग्राहकों की पसंद और बजट का पूरा ध्यान रखा जाता है।",
  "दुकान में बहुत ही व्यवस्थित डिस्प्ले और साफ-सफाई देखने को मिली।"
];

const retHiBodies = [
  "{serviceName} के ढेरों आधुनिक विकल्प मिले और स्टाफ ने बहुत प्यार से सब दिखाया।",
  "असली उत्पाद और भरोसेमंद वारंटी के साथ बहुत अच्छा डिस्काउंट भी मिला।",
  "त्वरित बिलिंग और सुरक्षित पैकिंग के साथ खरीदारी बहुत आसान रही।"
];

const retHiOutros = [
  "खरीदारी के लिए 5 स्टार दुकान! ⭐⭐⭐⭐⭐",
  "पूरा पैसा वसूल अनुभव! अत्यधिक अनुशंसित! ⭐⭐⭐⭐⭐",
  "प्रीमियम क्वालिटी और बढ़िया सेवा! धन्यवाद! ⭐⭐⭐⭐⭐"
];

// --- Retail Marathi ---
const retMrIntros = [
  "{businessName} मध्ये वाजवी दर आणि खात्रीशीर गुणवत्ता मिळते.",
  "उत्कृष्ट व्हरायटी आणि विनम्र कर्मचारी {businessName} चे वैशिष्ट्य आहे.",
  "{businessName} मध्ये नवीन आणि ट्रेंडी डिझाईन्सचे भरपूर पर्याय उपलब्ध आहेत.",
  "सण-उत्सवाच्या खरेदीसाठी {businessName} हे आमचे आवडते दुकान आहे."
];

const retMrBodies = [
  "{serviceName} खरेदीसाठी योग्य सहकार्य लाभले आणि भरपूर सवलत मिळाली.",
  "ग्राहकांच्या गरजेनुसार योग्य वस्तू सुचवणारे कुशल कर्मचारी येथे आहेत.",
  "दर्जेदार उत्पादने, पक्के बिल आणि जलद पॅकिंगची सोय उपलब्ध आहे."
];

const retMrOutros = [
  "खरेदीसाठी सर्वोत्तम ठिकाण! ५ स्टार! ⭐⭐⭐⭐⭐",
  "उत्तम अनुभव आणि दर्जेदार वस्तू! धन्यवाद! ⭐⭐⭐⭐⭐",
  "परिसरातील नंबर १ स्टोअर! ५/५ स्टार! ⭐⭐⭐⭐⭐"
];

// =========================================================================
// 5. CORPORATE & TECH / CONSULTING (Target: ~130 reviews -> ~50 English, ~40 Hindi, ~40 Marathi)
// =========================================================================

// --- Corporate English ---
const corpEnIntros = [
  "Extremely professional agency! {businessName} delivered our project with exceptional attention to detail.",
  "{businessName} has been an invaluable growth partner for our company's {serviceName} initiative.",
  "High quality deliverables, prompt communication, and measurable results from {businessName}.",
  "The domain expertise demonstrated by {businessName} during {serviceName} helped accelerate our targets.",
  "Proactive problem solvers! Working with {businessName} was structured and transparent."
];

const corpEnBodies = [
  "Their strategic insights and technical execution on {serviceName} exceeded our expectations.",
  "Clear milestone tracking, swift feedback loops, and zero compromises on engineering standards.",
  "The dedicated account managers went above and beyond to ensure smooth deployment.",
  "Delivered robust, scalable, and modern solutions well within the agreed timeline."
];

const corpEnOutros = [
  "Outstanding ROI! 5 stars all the way! ⭐⭐⭐⭐⭐",
  "A reliable corporate partner we trust completely! ⭐⭐⭐⭐⭐",
  "Highest recommendation for strategic consulting and tech! ⭐⭐⭐⭐⭐",
  "Best vendor experience this year! 5/5 stars! ⭐⭐⭐⭐⭐"
];

// --- Corporate Hindi ---
const corpHiIntros = [
  "{businessName} के साथ काम करने का अनुभव बहुत ही पेशेवर और सफल रहा।",
  "समय पर डिलीवरी और बेहतरीन तकनीकी समझ {businessName} की ताकत है।",
  "{businessName} की टीम बहुत ही इनोवेटिव, समर्पित और जिम्मेदार है।",
  "हमारे व्यापार को आगे बढ़ाने में {businessName} ने {serviceName} के माध्यम से बड़ा योगदान दिया।"
];

const corpHiBodies = [
  "{serviceName} का काम बहुत ही उच्च मानकों, स्पष्ट संवाद और पारदर्शिता के साथ पूरा हुआ।",
  "हर चुनौती का त्वरित समाधान और तकनीकी उत्कृष्टता देखकर बहुत खुशी हुई।",
  "क्लाइंट संतुष्टि को प्राथमिकता देकर तय समयसीमा में बेहतरीन परिणाम दिए।"
];

const corpHiOutros = [
  "विश्वसनीय कॉर्पोरेट पार्टनर! 5 स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "उत्कृष्ट कार्यकुशलता और बेहतरीन सपोर्ट! धन्यवाद! ⭐⭐⭐⭐⭐",
  "व्यावसायिक श्रेष्ठता के लिए अत्यधिक अनुशंसित! ⭐⭐⭐⭐⭐"
];

// --- Corporate Marathi ---
const corpMrIntros = [
  "{businessName} ची कार्यपद्धती अत्यंत व्यावसायिक, पारदर्शक आणि दर्जेदार आहे.",
  "वेळेवर काम पूर्ण करणे आणि उत्कृष्ट संवाद {businessName} चे वैशिष्ट्य आहे.",
  "{businessName} मधील तंत्रज्ञान आणि रणनीती कौशल्यामुळे {serviceName} प्रकल्प यशस्वी झाला.",
  "आमच्या व्यवसायाला नवीन उंचीवर नेण्यासाठी {businessName} चे सहकार्य मोलाचे ठरले."
];

const corpMrBodies = [
  "{serviceName} बाबत दिलेली सेवा, अचूक नियोजन आणि उच्च दर्जाचे आऊटपुट कौतुकास्पद आहे.",
  "प्रत्येक टप्प्यावर योग्य समन्वय आणि तत्पर टेक्निकल सपोर्ट मिळाला.",
  "ग्राहकांच्या गरजेनुसार लवचिक आणि आधुनिक उपाययोजना राबवल्या."
];

const corpMrOutros = [
  "विश्वासार्ह व्यावसायिक भागीदार! ५ स्टार! ⭐⭐⭐⭐⭐",
  "{serviceName} प्रकल्पासाठी मनःपूर्वक धन्यवाद! ५/५ स्टार! ⭐⭐⭐⭐⭐",
  "दीर्घकालीन व्यावसायिक संबंधांसाठी सर्वोत्तम पर्याय! ⭐⭐⭐⭐⭐"
];

// =========================================================================
// 6. GENERAL BUSINESS (Target: ~160 reviews -> ~65 English, ~48 Hindi, ~48 Marathi)
// =========================================================================

// --- General English ---
const genEnIntros = [
  "Exceptional service and outstanding quality from {businessName}!",
  "Prompt, professional, and reliable. Dealing with {businessName} was a breeze.",
  "Amazing customer experience! The staff at {businessName} fulfilled all our needs promptly.",
  "Great value, transparent pricing, and top-tier professionalism at {businessName}.",
  "Loved the warm hospitality and seamless execution by the team at {businessName}.",
  "Quick response time and honest advice provided by {businessName} for {serviceName}.",
  "I am thoroughly impressed by the integrity and high standards maintained by {businessName}.",
  "Smooth process from start to finish at {businessName} with friendly attendants."
];

const genEnBodies = [
  "They handled our {serviceName} with supreme care, attention to detail, and precision.",
  "The entire staff is well-trained, polite, and went the extra mile to assist us.",
  "Clear communication, punctuality, and great value for every rupee spent.",
  "No hidden surprises, transparent quotations, and timely handover of the work.",
  "Always willing to answer questions patiently and ensure 100% satisfaction."
];

const genEnOutros = [
  "Highly recommended to everyone! 5 stars! ⭐⭐⭐⭐⭐",
  "A truly wonderful business to deal with. 5/5 stars! ⭐⭐⭐⭐⭐",
  "Will definitely be returning for all future needs! ⭐⭐⭐⭐⭐",
  "Outstanding service from start to finish! ⭐⭐⭐⭐⭐"
];

// --- General Hindi ---
const genHiIntros = [
  "{businessName} की सेवाएं बेहद उच्च स्तरीय, भरोसेमंद और पारदर्शी हैं।",
  "बहुत ही विनम्र स्टाफ और बेहतरीन सेवा! {businessName} में बहुत अच्छा अनुभव रहा।",
  "{businessName} में काम कराने की प्रक्रिया बहुत ही आसान और समयबद्ध रही।",
  "उचित दाम और उच्च गुणवत्ता वाली सेवाएं {businessName} की पहचान हैं।",
  "समय की पाबंदी और ग्राहकों का आदर {businessName} में साफ देखने को मिलता है।"
];

const genHiBodies = [
  "{serviceName} के दौरान उनका सहयोग, मार्गदर्शन और गुणवत्ता बहुत शानदार रही।",
  "स्टाफ ने हर सवाल का जवाब बहुत धैर्य से दिया और कार्य समय पर पूरा किया।",
  "बिना किसी देरी और झंझट के बेहतरीन परिणाम प्राप्त हुए।",
  "ईमानदारी और ग्राहक संतुष्टि को प्राथमिकता देने वाली कार्यशैली बहुत पसंद आई।"
];

const genHiOutros = [
  "5 स्टार सेवा! सभी को यहाँ आने की सलाह दूंगा। ⭐⭐⭐⭐⭐",
  "पूरा पैसा वसूल और संतोषजनक अनुभव! धन्यवाद! ⭐⭐⭐⭐⭐",
  "भरोसेमंद और प्रामाणिक प्रतिष्ठान! 5/5 स्टार! ⭐⭐⭐⭐⭐"
];

// --- General Marathi ---
const genMrIntros = [
  "{businessName} कडून मिळालेली सेवा अतिशय दर्जेदार, तत्पर आणि समाधानकारक होती.",
  "विश्वासार्ह आणि उत्कृष्ट कार्यपद्धती! {businessName} मधील अनुभव खूप सुखद होता.",
  "{businessName} मध्ये ग्राहकांच्या समाधानाला नेहमीच सर्वोच्च प्राधान्य दिले जाते.",
  "पारदर्शक व्यवहार आणि वाजवी दर यामुळे {businessName} विश्वासार्ह वाटते.",
  "अतिशय नम्र, कुशल आणि अनुभवी कर्मचारी {businessName} मध्ये कार्यरत आहेत."
];

const genMrBodies = [
  "{serviceName} चे काम अत्यंत काळजीपूर्वक आणि ठरलेल्या वेळेत पूर्ण झाले.",
  "कामातील अचूकता, स्वच्छता आणि तत्परता खरोखरच वाखाणण्याजोगी आहे.",
  "वाजवी खर्चात उच्च दर्जाची सेवा आणि उत्तम मार्गदर्शन लाभले.",
  "कोणताही त्रास न होता सर्व प्रक्रिया अत्यंत सुलभपणे पार पडली."
];

const genMrOutros = [
  "५ स्टार सेवा! सर्वांना नक्की शिफारस करेन. ⭐⭐⭐⭐⭐",
  "उत्कृष्ट अनुभव आणि मन जिंकणारे काम! धन्यवाद! ⭐⭐⭐⭐⭐",
  "परिसरातील सर्वात विश्वासार्ह ठिकाण! ५/५ स्टार! ⭐⭐⭐⭐⭐"
];

// =========================================================================
// BUILD ALL INDUSTRY COMBINATIONS
// =========================================================================

const hospitalEnglish = buildUniquePool(hospEnIntros, hospEnBodies, hospEnOutros, [], 140);
const hospitalHindi = buildUniquePool(hospHiIntros, hospHiBodies, hospHiOutros, [], 90);
const hospitalMarathi = buildUniquePool(hospMrIntros, hospMrBodies, hospMrOutros, [], 90);

const automotiveEnglish = buildUniquePool(autoEnIntros, autoEnBodies, autoEnOutros, [], 80);
const automotiveHindi = buildUniquePool(autoHiIntros, autoHiBodies, autoHiOutros, [], 60);
const automotiveMarathi = buildUniquePool(autoMrIntros, autoMrBodies, autoMrOutros, [], 60);

const diningEnglish = buildUniquePool(dinEnIntros, dinEnBodies, dinEnOutros, [], 75);
const diningHindi = buildUniquePool(dinHiIntros, dinHiBodies, dinHiOutros, [], 55);
const diningMarathi = buildUniquePool(dinMrIntros, dinMrBodies, dinMrOutros, [], 55);

const retailEnglish = buildUniquePool(retEnIntros, retEnBodies, retEnOutros, [], 60);
const retailHindi = buildUniquePool(retHiIntros, retHiBodies, retHiOutros, [], 45);
const retailMarathi = buildUniquePool(retMrIntros, retMrBodies, retMrOutros, [], 45);

const corporateEnglish = buildUniquePool(corpEnIntros, corpEnBodies, corpEnOutros, [], 60);
const corporateHindi = buildUniquePool(corpHiIntros, corpHiBodies, corpHiOutros, [], 45);
const corporateMarathi = buildUniquePool(corpMrIntros, corpMrBodies, corpMrOutros, [], 45);

const generalEnglish = buildUniquePool(genEnIntros, genEnBodies, genEnOutros, [], 80);
const generalHindi = buildUniquePool(genHiIntros, genHiBodies, genHiOutros, [], 55);
const generalMarathi = buildUniquePool(genMrIntros, genMrBodies, genMrOutros, [], 55);

const allTemplates = {
  hospital: {
    english: hospitalEnglish,
    hindi: hospitalHindi,
    marathi: hospitalMarathi
  },
  automotive: {
    english: automotiveEnglish,
    hindi: automotiveHindi,
    marathi: automotiveMarathi
  },
  dining: {
    english: diningEnglish,
    hindi: diningHindi,
    marathi: diningMarathi
  },
  retail: {
    english: retailEnglish,
    hindi: retailHindi,
    marathi: retailMarathi
  },
  corporate: {
    english: corporateEnglish,
    hindi: corporateHindi,
    marathi: corporateMarathi
  },
  general: {
    english: generalEnglish,
    hindi: generalHindi,
    marathi: generalMarathi
  }
};

let totalCount = 0;
for (const cat in allTemplates) {
  for (const lang in allTemplates[cat]) {
    totalCount += allTemplates[cat][lang].length;
  }
}

const finalPool = {
  description: "1000+ Unique Dynamic Industry-Specific Review Templates with Keyword Interpolation and Multi-Language Variation (English, Hindi, Marathi)",
  totalTemplates: totalCount,
  templates: allTemplates
};

const serverPath = path.join(__dirname, '../data/reviewsPool.json');
const clientPath = path.join(__dirname, '../../client/src/data/reviewsPool.json');

fs.writeFileSync(serverPath, JSON.stringify(finalPool, null, 2), 'utf8');
fs.writeFileSync(clientPath, JSON.stringify(finalPool, null, 2), 'utf8');

console.log(`Successfully generated ${totalCount} unique review templates across all categories!`);
