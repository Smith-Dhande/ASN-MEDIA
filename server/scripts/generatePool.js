const fs = require('fs');
const path = require('path');

// 1. HOSPITAL REVIEWS
const hospitalEnglish = [
  "I had an exceptional experience at {businessName} for {serviceName} under the expert care of {doctorName}. {doctorName} was remarkably attentive, explaining every step with great clarity and kindness. The clinic facilities and nursing team were world-class. Highly recommended! ⭐⭐⭐⭐⭐",
  "Consulting {doctorName} at {businessName} was one of the best medical decisions for my family. The diagnosis was spot-on, and the entire team ensured our comfort during {serviceName}. Cleanliness, hygiene, and patient care are top-tier! ⭐⭐⭐⭐⭐",
  "Outstanding medical service and utmost care at {businessName}! {doctorName} handled my {serviceName} with immense precision and compassion. Truly grateful to the entire staff! ⭐⭐⭐⭐⭐",
  "State-of-the-art medical equipment and very professional doctors! Visited {businessName} for {serviceName} with {doctorName}. The recovery guidance and nursing care were impeccable. 5-star experience! ⭐⭐⭐⭐⭐",
  "Very pleased with the compassionate treatment provided by {doctorName} at {businessName}. From reception to {serviceName} consultation, everyone was cooperative and reassuring. ⭐⭐⭐⭐⭐",
  "Had a smooth and painless {serviceName} procedure at {businessName}. {doctorName} is extremely skilled, patient, and knowledgeable. The hospital hygiene is commendable! ⭐⭐⭐⭐⭐",
  "I wholeheartedly recommend {businessName} to anyone seeking trustworthy medical care. {doctorName} was patient, thorough in diagnosis, and provided excellent care for {serviceName}. ⭐⭐⭐⭐⭐",
  "Very minimal waiting time and top-notch medical attention at {businessName}. {doctorName} listened carefully and addressed all my concerns regarding {serviceName}. Excellent team! ⭐⭐⭐⭐⭐",
  "Comprehensive healthcare and consultation at {businessName}. {doctorName} demonstrated supreme professionalism during {serviceName}. Will definitely recommend to friends and relatives. ⭐⭐⭐⭐⭐",
  "Extremely satisfied with the treatment at {businessName}! {doctorName} and the support staff took wonderful care during {serviceName}. Truly best in class! ⭐⭐⭐⭐⭐",
  "World-class healthcare facility! The dedication shown by {doctorName} and staff at {businessName} during my {serviceName} was beyond expectations. Thank you so much! ⭐⭐⭐⭐⭐",
  "Prompt assistance, friendly nursing staff, and an expert consultation by {doctorName}. My experience for {serviceName} at {businessName} was seamless. ⭐⭐⭐⭐⭐",
  "The medical infrastructure at {businessName} is remarkable. {doctorName} diagnosed my condition swiftly and performed {serviceName} with great expertise. ⭐⭐⭐⭐⭐",
  "From the moment we walked into {businessName}, we felt welcomed and reassured. {doctorName} is a blessing for patients undergoing {serviceName}. ⭐⭐⭐⭐⭐",
  "Exceptional bedside manners by {doctorName} and supreme cleanliness at {businessName}. The entire {serviceName} process was transparent and stress-free. ⭐⭐⭐⭐⭐",
  "I was anxious about undergoing {serviceName}, but {doctorName} at {businessName} patiently resolved all my doubts. Outstanding hospital care! ⭐⭐⭐⭐⭐",
  "High precision medical diagnostics and compassionate nursing! {doctorName} provided wonderful post-op care following {serviceName} at {businessName}. ⭐⭐⭐⭐⭐",
  "Affordable, transparent, and superior clinical care at {businessName}. {doctorName} handled our case with utmost dedication. ⭐⭐⭐⭐⭐",
  "The entire staff at {businessName} works like a well-oiled machine. {doctorName}'s expertise in {serviceName} gave us total peace of mind. ⭐⭐⭐⭐⭐",
  "Immaculately clean OT and recovery wards at {businessName}. {doctorName} is one of the finest doctors for {serviceName} in the region. ⭐⭐⭐⭐⭐",
  "Thank you {doctorName} and {businessName} for restoring my health so quickly! The care during {serviceName} was exemplary. ⭐⭐⭐⭐⭐",
  "Quick registration, zero unnecessary delays, and excellent consultation with {doctorName}. {businessName} sets the gold standard in healthcare. ⭐⭐⭐⭐⭐",
  "Very polite reception, caring nursing department, and top specialist {doctorName} at {businessName}. Highly satisfied with {serviceName}. ⭐⭐⭐⭐⭐",
  "Superb patient management and modern technology at {businessName}. {doctorName}'s approach to {serviceName} is truly commendable. ⭐⭐⭐⭐⭐",
  "We visited {businessName} for an emergency consultation, and {doctorName} took immediate charge of {serviceName}. Lifesavers! ⭐⭐⭐⭐⭐",
  "Remarkable diagnostic accuracy and warm hospitality at {businessName}. {doctorName} is thorough and very gentle during {serviceName}. ⭐⭐⭐⭐⭐",
  "I have visited multiple hospitals, but {businessName} stands out because of doctors like {doctorName}. Excellent handling of {serviceName}. ⭐⭐⭐⭐⭐",
  "Modern amenities, clean waiting area, and clear communication by {doctorName} throughout my {serviceName} at {businessName}. ⭐⭐⭐⭐⭐",
  "Top specialist care! {doctorName} at {businessName} explained the nuances of {serviceName} in simple words, making us feel at ease. ⭐⭐⭐⭐⭐",
  "The post-treatment follow-up by {businessName} and {doctorName} after {serviceName} was genuinely caring and prompt. ⭐⭐⭐⭐⭐",
  "Caring staff, state-of-the-art laser & surgical units, and brilliant doctors like {doctorName}. Best hospital experience for {serviceName}! ⭐⭐⭐⭐⭐",
  "Doctor {doctorName} took the time to listen to my symptoms patiently. {businessName} is definitely our family's trusted healthcare partner. ⭐⭐⭐⭐⭐",
  "Smooth admission and discharge procedure at {businessName}. Kudos to {doctorName} for guiding us through {serviceName} effortlessly. ⭐⭐⭐⭐⭐",
  "The nursing care at {businessName} is round-the-clock and very attentive. {doctorName}'s surgical skill in {serviceName} is commendable! ⭐⭐⭐⭐⭐",
  "Very ethical medical practice at {businessName}. {doctorName} recommended only the required tests for {serviceName}. Highly respectable! ⭐⭐⭐⭐⭐",
  "Great relief after getting {serviceName} done by {doctorName} at {businessName}. Everything was explained with clarity. ⭐⭐⭐⭐⭐",
  "Cleanliness, hygiene, and sanitization standards at {businessName} are unmatched. {doctorName} is fantastic with patients! ⭐⭐⭐⭐⭐",
  "Exceptional patient-centric approach! {doctorName} provided tailor-made treatment for my {serviceName} at {businessName}. ⭐⭐⭐⭐⭐",
  "Reliable hospital with genuine medical ethics. {doctorName} and the support team at {businessName} deserve top appreciation. ⭐⭐⭐⭐⭐",
  "Professional billing, transparent cost estimate, and world-class care by {doctorName} for {serviceName} at {businessName}. ⭐⭐⭐⭐⭐",
  "Doctor {doctorName} is not only an expert clinician but also extremely empathetic. Best hospital {businessName} for {serviceName}. ⭐⭐⭐⭐⭐",
  "The clinical staff at {businessName} is highly trained. {doctorName} executed {serviceName} with perfection and minimum discomfort. ⭐⭐⭐⭐⭐",
  "We are very grateful to {doctorName} at {businessName} for their outstanding dedication during my parent's {serviceName}. ⭐⭐⭐⭐⭐",
  "Prompt diagnosis, zero wait times with appointments, and brilliant treatment by {doctorName} at {businessName}. ⭐⭐⭐⭐⭐",
  "The equipment used for {serviceName} at {businessName} is latest generation. {doctorName}'s expertise made all the difference. ⭐⭐⭐⭐⭐",
  "Friendly front desk, helpful ward attendants, and expert medical advice from {doctorName} at {businessName}. ⭐⭐⭐⭐⭐",
  "Every visit to {businessName} reinforces our trust in {doctorName}. Top quality medical consultation for {serviceName}! ⭐⭐⭐⭐⭐",
  "Clear instructions, helpful medication schedule, and remarkable recovery after {serviceName} under {doctorName} at {businessName}. ⭐⭐⭐⭐⭐",
  "I highly recommend {doctorName} at {businessName} to anyone looking for specialized {serviceName} treatment. Superb experience! ⭐⭐⭐⭐⭐",
  "The hospital management at {businessName} is very proactive. {doctorName} is undoubtedly one of the best doctors for {serviceName}. ⭐⭐⭐⭐⭐"
];

const hospitalHindi = [
  "{businessName} में {doctorName} से {serviceName} के परामर्श और उपचार का अनुभव अत्यंत शानदार रहा। डॉक्टर साहब बहुत विनम्र, अनुभवी और मददगार हैं। अस्पताल में स्वच्छता और सुविधाएं विश्वस्तरीय हैं। ⭐⭐⭐⭐⭐",
  "{businessName} में {doctorName} द्वारा दी गई चिकित्सा सेवा बेहद संतोषजनक रही। {serviceName} की प्रक्रिया बहुत ही आसान और व्यवस्थित थी। पूरे स्टाफ का व्यवहार बहुत आत्मीय था। ⭐⭐⭐⭐⭐",
  "आधुनिक मशीनें और बेहतरीन डॉक्टर! {businessName} में {serviceName} के लिए {doctorName} से परामर्श लिया। सही मार्गदर्शन और उचित देखभाल के लिए बहुत-बहुत धन्यवाद! ⭐⭐⭐⭐⭐",
  "{businessName} का नर्सिंग स्टाफ और डॉक्टर {doctorName} बहुत सहयोगी हैं। {serviceName} के दौरान उन्होंने हमारा बहुत ध्यान रखा। सभी को यहाँ आने की सलाह दूंगा। ⭐⭐⭐⭐⭐",
  "अपने परिवार के सदस्य के {serviceName} के लिए {businessName} गया था। {doctorName} ने बहुत धैर्य से जांच की और उचित परामर्श दिया। उत्तम अस्पताल! ⭐⭐⭐⭐⭐",
  "कम समय में बेहतरीन उपचार! {businessName} में {doctorName} ने {serviceName} के बारे में सब कुछ स्पष्ट समझाया। अस्पताल का वातावरण बहुत स्वच्छ और शांत है। ⭐⭐⭐⭐⭐",
  "{businessName} में {doctorName} के मार्गदर्शन में {serviceName} बहुत ही सुरक्षित और सफल रहा। नर्सिंग स्टाफ चौबीसों घंटे तत्पर रहता है। ⭐⭐⭐⭐⭐",
  "{doctorName} बहुत ही अनुभवी और संवेदनशील डॉक्टर हैं। {businessName} में {serviceName} के दौरान हमें किसी भी प्रकार की परेशानी नहीं हुई। ⭐⭐⭐⭐⭐",
  "अस्पताल की व्यवस्था और सफाई बहुत ही प्रशंसनीय है। {doctorName} ने {serviceName} के हर पहलू को बारीकी से समझाया। 5 स्टार अनुभव! ⭐⭐⭐⭐⭐",
  "{businessName} में उचित दरों पर सर्वोत्तम स्वास्थ्य सेवाएं मिलती हैं। {doctorName} का व्यवहार बहुत ही आत्मीय और प्रेरणादायक है। ⭐⭐⭐⭐⭐",
  "{serviceName} के लिए {businessName} सबसे भरोसेमंद अस्पताल है। {doctorName} की देखरेख में स्वास्थ्य में बहुत तेजी से सुधार हुआ। ⭐⭐⭐⭐⭐",
  "डॉक्टर {doctorName} ने बिना किसी अनावश्यक टेस्ट के सटीक इलाज किया। {businessName} की पूरी टीम बहुत ही पेशेवर और मददगार है। ⭐⭐⭐⭐⭐",
  "इलाज के साथ-साथ मरीजों की मानसिक शांति का भी पूरा ध्यान रखा जाता है। {doctorName} और {businessName} का बहुत-बहुत आभार! ⭐⭐⭐⭐⭐",
  "{businessName} में आधुनिक चिकित्सा उपकरण उपलब्ध हैं। {doctorName} द्वारा {serviceName} की प्रक्रिया बहुत ही सहजता से संपन्न हुई। ⭐⭐⭐⭐⭐",
  "रिसेप्शन से लेकर डिस्चार्ज तक का पूरा सफर बहुत ही व्यवस्थित रहा। {doctorName} जैसे कुशल डॉक्टर {businessName} की शान हैं। ⭐⭐⭐⭐⭐",
  "हमारे पूरे परिवार का {businessName} पर अटूट विश्वास है। {doctorName} ने {serviceName} के मामले में बेहतरीन सलाह दी। ⭐⭐⭐⭐⭐",
  "डॉक्टर {doctorName} की कार्यकुशलता और {businessName} के स्टाफ की सेवा भावना अद्वितीय है। {serviceName} के लिए उत्तम स्थान! ⭐⭐⭐⭐⭐",
  "{businessName} में इमरजेंसी और ओपीडी सेवाएं बहुत त्वरित हैं। {doctorName} ने {serviceName} की जांच अत्यंत सावधानी से की। ⭐⭐⭐⭐⭐",
  "मरीजों की देखभाल में {businessName} नंबर एक है। {doctorName} के मधुर व्यवहार और सही दवाइयों से तुरंत आराम मिला। ⭐⭐⭐⭐⭐",
  "{serviceName} को लेकर हमारी सारी चिंताएं {doctorName} से मिलने के बाद दूर हो गईं। {businessName} को मेरी तरफ से 5 स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "अस्पताल के कमरे और वार्ड बहुत साफ-सुथरे हैं। {doctorName} ने {serviceName} के बाद के परहेज भी बहुत अच्छे से समझाए। ⭐⭐⭐⭐⭐",
  "उच्च स्तरीय मेडिकल टेक्नोलॉजी और संवेदनशील डॉक्टर! {businessName} में {doctorName} से {serviceName} कराना सबसे सही निर्णय रहा। ⭐⭐⭐⭐⭐",
  "{businessName} में पारदर्शी बिलिंग और बेहतरीन इलाज मिलता है। {doctorName} का परामर्श बहुत ही उपयोगी और सटीक रहा। ⭐⭐⭐⭐⭐",
  "डॉक्टर {doctorName} ने हर सवाल का जवाब बहुत धैर्यपूर्वक दिया। {businessName} में {serviceName} का अनुभव बहुत सुखद रहा। ⭐⭐⭐⭐⭐",
  "{businessName} का स्टाफ हर समय मुस्कुराते हुए मदद के लिए तैयार रहता है। {doctorName} की विशेषज्ञता सराहनीय है। ⭐⭐⭐⭐⭐",
  "अत्यंत अनुभवी डॉक्टरों की टीम और शांत वातावरण। {doctorName} द्वारा {serviceName} का सफल उपचार किया गया। ⭐⭐⭐⭐⭐",
  "{businessName} में समय की पूरी पाबंदी है और डॉक्टर {doctorName} से परामर्श बिना किसी लंबी प्रतीक्षा के मिल गया। ⭐⭐⭐⭐⭐",
  "ईमानदार चिकित्सा और बेहतरीन देखभाल! {businessName} में {doctorName} ने {serviceName} के दौरान पूरा सहयोग दिया। ⭐⭐⭐⭐⭐",
  "{serviceName} के उपचार में {doctorName} का कोई सानी नहीं है। {businessName} की सेवाएं निश्चित रूप से सर्वश्रेष्ठ हैं। ⭐⭐⭐⭐⭐",
  "मरीज की हर छोटी-बड़ी जरूरत का ख्याल रखने के लिए {businessName} और डॉक्टर {doctorName} को कोटि-कोटि धन्यवाद! ⭐⭐⭐⭐⭐",
  "{businessName} में इलाज करवाकर बहुत संतोष मिला। {doctorName} ने {serviceName} का इलाज बहुत ही निपुणता से किया। ⭐⭐⭐⭐⭐",
  "डॉक्टर {doctorName} की सकारात्मक सोच से मरीज आधी बीमारी तो वैसे ही भूल जाता है। {businessName} सर्वोत्तम अस्पताल है। ⭐⭐⭐⭐⭐",
  "अस्पताल में सभी जांच सुविधाएं एक ही छत के नीचे उपलब्ध हैं। {doctorName} ने {serviceName} में उत्कृष्ट सेवाएं दीं। ⭐⭐⭐⭐⭐",
  "{businessName} में {doctorName} का इलाज वाकई जादुई असर करता है। {serviceName} के बाद अब पूरी तरह स्वस्थ हूँ। ⭐⭐⭐⭐⭐",
  "उत्कृष्ट चिकित्सा प्रबंधन और समर्पित नर्सिंग सेवा! {businessName} में {doctorName} से मिलना बहुत ही सुखद अनुभव रहा। ⭐⭐⭐⭐⭐"
];

const hospitalMarathi = [
  "{businessName} मध्ये {doctorName} यांच्याकडून {serviceName} उपचाराचा अनुभव अत्यंत समाधानकारक राहिला. डॉक्टर खूप काळजीपूर्वक मार्गदर्शन करतात आणि सर्व कर्मचारी अतिशय नम्र व सहकार्यशील आहेत. सर्वोत्तम रुग्णालय! ⭐⭐⭐⭐⭐",
  "{businessName} येथे {doctorName} यांच्याकडून मिळालेली वैद्यकीय सेवा अतिशय उच्च दर्जाची आहे. {serviceName} उपचारादरम्यान आम्हाला खूप धीर मिळाला. मनापासून धन्यवाद! ⭐⭐⭐⭐⭐",
  "अत्याधुनिक वैद्यकीय उपकरणे आणि स्वच्छता! {businessName} मध्ये {serviceName} साठी {doctorName} यांचा सल्ला घेतला. अतिशय सुलभ आणि व्यवस्थित उपचार झाले. ⭐⭐⭐⭐⭐",
  "{businessName} मधील नर्सिंग स्टाफ व डॉक्टर {doctorName} यांचे सहकार्य खूप मोलाचे होते. {serviceName} ची प्रक्रिया विनात्रास पार पडली. ५ स्टार सेवा! ⭐⭐⭐⭐⭐",
  "आमच्या संपूर्ण कुटुंबाचा {businessName} वर पूर्ण विश्वास आहे. {doctorName} यांनी {serviceName} बाबत अत्यंत योग्य आणि मोलाचा सल्ला दिला. ⭐⭐⭐⭐⭐",
  "वेळेवर उपचार, शांत परिसर आणि स्वच्छ वातावरण. {businessName} मध्ये {doctorName} यांच्याकडून {serviceName} चा अनुभव उत्कृष्ट राहिला. ⭐⭐⭐⭐⭐",
  "{businessName} रुग्णालयातील व्यवस्थापन अतिशय शिस्तबद्ध आहे. {doctorName} यांनी {serviceName} संदर्भात दिलेली माहिती खूप मोलाची ठरली. ⭐⭐⭐⭐⭐",
  "{doctorName} हे अत्यंत अनुभवी आणि मनमिळाऊ डॉक्टर आहेत. {businessName} मध्ये {serviceName} दरम्यान रुग्णाची घेतलेली काळजी कौतुकास्पद आहे. ⭐⭐⭐⭐⭐",
  "कमीत कमी वेळेत अचूक निदान आणि उपचार! {businessName} मध्ये {doctorName} यांच्या मार्गदर्शनाखाली {serviceName} यशस्वीपणे पूर्ण झाले. ⭐⭐⭐⭐⭐",
  "स्वच्छता आणि रुग्णांची आपुलकीने काळजी घेणे हे {businessName} चे वैशिष्ट्य आहे. {doctorName} यांना मनापासून धन्यवाद! ⭐⭐⭐⭐⭐",
  "{serviceName} साठी {businessName} हे परिसरातील सर्वोत्तम रुग्णालय आहे. {doctorName} यांचा उपचारातील हातखंडा वाखाणण्याजोगा आहे. ⭐⭐⭐⭐⭐",
  "अनावश्यक तपासण्या न सांगता योग्य तोच उपचार करणे ही {doctorName} यांची कार्यपद्धती खूप आवडली. {businessName} ला ५ स्टार! ⭐⭐⭐⭐⭐",
  "{businessName} मधील प्रत्येक कर्मचाऱ्याचा स्वभाव अतिशय मदतशील आहे. {doctorName} यांनी {serviceName} च्या वेळी खूप मानसिक आधार दिला. ⭐⭐⭐⭐⭐",
  "आधुनिक तंत्रज्ञान आणि तज्ज्ञ डॉक्टरांची उत्तम सांगड म्हणजे {businessName}. {doctorName} यांच्याकडून {serviceName} चे उत्तम उपचार मिळाले. ⭐⭐⭐⭐⭐",
  "रुग्णालयातील प्रवेशापासून ते डिस्चार्जपर्यंतची सर्व प्रक्रिया अत्यंत गतिमान आणि पारदर्शक होती. {doctorName} सरांचे मनापासून आभार! ⭐⭐⭐⭐⭐",
  "औषधोपचाराची अचूक पद्धत आणि {doctorName} यांचे समुपदेशन यामुळे रुग्ण त्वरित बरा झाला. {businessName} ला मानाचा मुजरा! ⭐⭐⭐⭐⭐",
  "{businessName} मध्ये {serviceName} च्या शस्त्रक्रियेदरम्यान आणि नंतरही {doctorName} यांनी उत्तम पाठपुरावा केला. ⭐⭐⭐⭐⭐",
  "रुग्णाची आस्थेने विचारपूस करणारे डॉक्टर {doctorName} आणि तत्पर नर्सिंग टीममुळे {businessName} विश्वासार्ह वाटते. ⭐⭐⭐⭐⭐",
  "पारदर्शक दर आणि उच्च दर्जाची वैद्यकीय सेवा {businessName} मध्ये मिळते. {doctorName} सरांचे मार्गदर्शन अत्यंत बहुमूल्य ठरले. ⭐⭐⭐⭐⭐",
  "{serviceName} उपचारासाठी {businessName} ची निवड करणे अत्यंत फायदेशीर ठरले. {doctorName} यांच्या उपचाराने पूर्ण आराम मिळाला. ⭐⭐⭐⭐⭐",
  "अतिशय स्वच्छ वॉर्ड्स आणि प्रसन्न वातावरण! {businessName} मध्ये {doctorName} यांच्या देखरेखीखाली {serviceName} चे उपचार अत्यंत सुखकर झाले. ⭐⭐⭐⭐⭐",
  "रुग्णाला विश्वासात घेऊन सर्व बाबी समजावून सांगणारे {doctorName} हे अत्यंत आदर्श डॉक्टर आहेत. {businessName} सर्वोत्तम आहे! ⭐⭐⭐⭐⭐",
  "{businessName} मधील इमर्जन्सी केअर अत्यंत तत्पर आहे. {doctorName} यांनी वेळेवर {serviceName} चे उपचार सुरू करून मदत केली. ⭐⭐⭐⭐⭐",
  "कौटुंबिक जिव्हाळ्याने रुग्णाची काळजी घेणारे {businessName} रुग्णालय आणि आदरणीय {doctorName} यांचे आभार! ⭐⭐⭐⭐⭐",
  "{serviceName} बाबतच्या सर्व शंकांचे निरसन {doctorName} यांनी शांतपणे केले. {businessName} नक्कीच पहिल्या क्रमांकाचे रुग्णालय आहे. ⭐⭐⭐⭐⭐",
  "दर्जेदार वैद्यकीय उपचार, वाजवी खर्च आणि उत्कृष्ट रुग्णसेवा! {businessName} मध्ये {doctorName} सरांचा सल्ला नक्की घ्या. ⭐⭐⭐⭐⭐",
  "डॉक्टर {doctorName} यांच्या अचूक निदानामुळे आजार लवकर बरा झाला. {businessName} ची संपूर्ण टीम अभिनंदनास पात्र आहे. ⭐⭐⭐⭐⭐",
  "शांत वातावरण, तत्पर मदत आणि कुशल वैद्यकीय तज्ज्ञ! {businessName} मध्ये {doctorName} कडून {serviceName} चा अनुभव खूप छान राहिला. ⭐⭐⭐⭐⭐",
  "{businessName} रुग्णालयातील आधुनिक मशिनरी आणि {doctorName} यांचे वैद्यकीय कौशल्य यामुळे {serviceName} यशस्वी झाले. ⭐⭐⭐⭐⭐",
  "माझ्या नातेवाईकांच्या {serviceName} उपचारासाठी {businessName} मधील {doctorName} यांचे मोलाचे सहकार्य लाभले. खूप खूप धन्यवाद! ⭐⭐⭐⭐⭐",
  "रुग्णालयातील स्वच्छता आणि कर्मचाऱ्यांची तत्परता पाहून खूप समाधान वाटले. {doctorName} यांचा {serviceName} चा सल्ला अत्यंत उपयुक्त होता. ⭐⭐⭐⭐⭐",
  "डॉक्टर {doctorName} यांच्या गोड बोलण्यानेच रुग्णाचा अर्धा ताण कमी होतो. {businessName} रुग्णालय सर्वोत्कृष्ट आहे! ⭐⭐⭐⭐⭐",
  "{businessName} मधील सर्व सुविधा एकाच ठिकाणी उपलब्ध असल्याने खूप सोयीचे झाले. {doctorName} यांना मनःपूर्वक धन्यवाद! ⭐⭐⭐⭐⭐",
  "उत्तम आरोग्य सेवा, स्वच्छ परिसर आणि प्रामाणिक डॉक्टर {doctorName}! {businessName} मध्ये {serviceName} करून पूर्ण समाधान मिळाले. ⭐⭐⭐⭐⭐",
  "{serviceName} उपचारासाठी आम्ही सर्वांना {businessName} आणि डॉक्टर {doctorName} यांचीच शिफारस करू. सर्वोत्तम रुग्णालय! ⭐⭐⭐⭐⭐"
];

// 2. AUTOMOTIVE REVIEWS
const automotiveEnglish = [
  "Exceptional vehicle service at {businessName}! Their mechanics were extremely knowledgeable and handled our {serviceName} with great expertise. Fast turnaround and transparent pricing! ⭐⭐⭐⭐⭐",
  "Best garage and auto repair workshop! Brought my vehicle to {businessName} for {serviceName}. The team diagnosed the issue quickly and fixed it flawlessly. Highly recommended! ⭐⭐⭐⭐⭐",
  "Very honest, dependable, and professional mechanics at {businessName}. They explained all the work done for {serviceName} clearly. My car drives like new! ⭐⭐⭐⭐⭐",
  "Top-quality automobile service at {businessName}. Friendly staff, quick inspection, and perfect execution on {serviceName}. 5 stars! ⭐⭐⭐⭐⭐",
  "Outstanding customer care and genuine spare parts at {businessName}. From estimate to delivery of my car after {serviceName}, everything was seamless. ⭐⭐⭐⭐⭐",
  "Reliable and prompt service at {businessName}. They solved the issue with {serviceName} at a very reasonable price. Will definitely visit again! ⭐⭐⭐⭐⭐",
  "The technicians at {businessName} are master mechanics. My vehicle had a complex issue with {serviceName}, and they resolved it in record time! ⭐⭐⭐⭐⭐",
  "Impressed by the cleanliness and advanced diagnostic tools at {businessName}. They did an incredible job with {serviceName}. ⭐⭐⭐⭐⭐",
  "Fair pricing, no hidden charges, and quick turnaround for {serviceName} at {businessName}. Truly the most honest workshop in town! ⭐⭐⭐⭐⭐",
  "My car runs smoother and quieter after the {serviceName} at {businessName}. Professional team and excellent customer service. ⭐⭐⭐⭐⭐",
  "I have been bringing my cars to {businessName} for years. Their expertise in {serviceName} is unmatched. Top-tier service! ⭐⭐⭐⭐⭐",
  "Friendly advisors and skilled technicians! {businessName} provided a detailed inspection report before starting {serviceName}. ⭐⭐⭐⭐⭐",
  "Fast, efficient, and cost-effective {serviceName} service at {businessName}. They even cleaned my car thoroughly before handover! ⭐⭐⭐⭐⭐",
  "Trustworthy garage with genuine parts and warranty on repairs. {businessName} handled my {serviceName} with total perfection. ⭐⭐⭐⭐⭐",
  "Got stranded on the highway and {businessName} arranged immediate assistance for {serviceName}. Lifesavers! ⭐⭐⭐⭐⭐",
  "The team at {businessName} takes real pride in automotive engineering. Super happy with the outcome of {serviceName}! ⭐⭐⭐⭐⭐",
  "Quick check-in, transparent estimation, and timely delivery at {businessName}. My go-to auto repair center for {serviceName}. ⭐⭐⭐⭐⭐",
  "Superb customer hospitality in their waiting lounge while {serviceName} was completed at {businessName}. Excellent workshop! ⭐⭐⭐⭐⭐",
  "They diagnosed a tricky engine noise during {serviceName} that other garages missed. {businessName} is the real deal! ⭐⭐⭐⭐⭐",
  "Professional workmanship, prompt communication via WhatsApp, and fair pricing at {businessName} for {serviceName}. ⭐⭐⭐⭐⭐",
  "Flawless bodywork, painting, and mechanical {serviceName} at {businessName}. My vehicle looks fresh out of the showroom! ⭐⭐⭐⭐⭐",
  "Clear billing, old parts returned, and polite mechanics. {businessName} sets the benchmark for automobile workshops. ⭐⭐⭐⭐⭐",
  "Very smooth ride after the {serviceName} service at {businessName}. Highly recommend them to all vehicle owners! ⭐⭐⭐⭐⭐",
  "Affordable maintenance packages and skilled mechanics at {businessName}. Thank you for taking such good care of my car during {serviceName}! ⭐⭐⭐⭐⭐",
  "Great attention to detail and punctuality at {businessName}. They completed {serviceName} exactly on time. ⭐⭐⭐⭐⭐",
  "Top quality engine oil, genuine parts, and expert tuning for {serviceName} at {businessName}. Car performance has increased noticeably! ⭐⭐⭐⭐⭐",
  "The workshop floor at {businessName} is clean and organized. That reflects in the quality of {serviceName} they deliver. ⭐⭐⭐⭐⭐",
  "Honest advice without unnecessary upselling. {businessName} repaired only what was needed for {serviceName}. Respect! ⭐⭐⭐⭐⭐",
  "Very knowledgeable staff who took time to explain maintenance tips after completing {serviceName} at {businessName}. ⭐⭐⭐⭐⭐",
  "Exceptional turnaround time! Booked slot for {serviceName} at {businessName} and got my car back in just a few hours. ⭐⭐⭐⭐⭐"
];

const automotiveHindi = [
  "{businessName} में गाड़ी की सर्विसिंग और रिपेयर का अनुभव बहुत ही शानदार रहा। {serviceName} का काम बहुत ही कुशलता और समय पर किया गया। 5 स्टार गैराज! ⭐⭐⭐⭐⭐",
  "बहुत ही ईमानदार और अनुभवी मैकेनिक हैं {businessName} में। {serviceName} का काम बहुत ही सही दाम और बेहतरीन तरीके से किया। अत्यधिक अनुशंसित! ⭐⭐⭐⭐⭐",
  "{businessName} में गाड़ी की जांच और {serviceName} बहुत ही पेशेवर ढंग से की गई। स्टाफ बहुत विनम्र और मददगार है। बहुत बढ़िया अनुभव! ⭐⭐⭐⭐⭐",
  "गाड़ी में लंबे समय से आ रही आवाज़ को {businessName} के कुशल कारीगरों ने {serviceName} के दौरान तुरंत ठीक कर दिया। बहुत संतोषजनक काम! ⭐⭐⭐⭐⭐",
  "{businessName} में असली पार्ट्स और आधुनिक मशीनों से काम होता है। {serviceName} के बाद गाड़ी एकदम मक्खन चल रही है। ⭐⭐⭐⭐⭐",
  "उचित मूल्य और समय पर डिलीवरी! {businessName} में {serviceName} का काम बिना किसी झंझट के पूरा हुआ। सभी को यहाँ आने की सलाह दूंगा। ⭐⭐⭐⭐⭐",
  "{businessName} की वर्कशॉप बहुत ही साफ-सुथरी और सुव्यवस्थित है। {serviceName} का काम उन्होंने बहुत ईमानदारी से किया। ⭐⭐⭐⭐⭐",
  "मैकेनिकों को ऑटोमोबाइल का बहुत गहरा ज्ञान है। {businessName} में {serviceName} कराने के बाद माइलेज भी बेहतर हो गया है। ⭐⭐⭐⭐⭐",
  "पारदर्शी एस्टीमेट और कोई भी छुपा हुआ चार्ज नहीं! {businessName} में {serviceName} के अनुभव से बहुत खुश हूँ। ⭐⭐⭐⭐⭐",
  "आपातकालीन स्थिति में {businessName} ने तुरंत मदद भेजी और {serviceName} का काम तेजी से निपटाया। 5 स्टार सेवा! ⭐⭐⭐⭐⭐",
  "गाड़ी की डेंटिंग, पेंटिंग और {serviceName} का काम {businessName} में एकदम शोरूम जैसा किया गया। ⭐⭐⭐⭐⭐",
  "{businessName} में कस्टमर लाउंज और स्टाफ का व्यवहार बहुत अच्छा है। {serviceName} के लिए सबसे उत्तम गैराज। ⭐⭐⭐⭐⭐",
  "बिना फालतू पार्ट्स बदले सही रिपेयरिंग करना {businessName} की खासियत है। {serviceName} के लिए धन्यवाद! ⭐⭐⭐⭐⭐",
  "{businessName} में काम कराने के बाद गाड़ी की परफॉरमेंस बहुत बढ़ गई। {serviceName} का काम बहुत उच्च कोटि का था। ⭐⭐⭐⭐⭐",
  "समय की पूरी पाबंदी और बेहतरीन कार वॉशिंग के साथ {businessName} ने {serviceName} के बाद गाड़ी हैंडओवर की। ⭐⭐⭐⭐⭐",
  "भरोसेमंद ऑटो सर्विस सेंटर! {businessName} में {serviceName} के दौरान हर बात की स्पष्ट जानकारी दी गई। ⭐⭐⭐⭐⭐",
  "सस्ते दाम में बेहतरीन सर्विसिंग! {businessName} की टीम ने {serviceName} बहुत ध्यानपूर्वक किया। ⭐⭐⭐⭐⭐",
  "गाड़ी के सस्पेंशन और {serviceName} का काम {businessName} ने बहुत मजबूती से किया। अब ड्राइविंग बहुत स्मूथ है। ⭐⭐⭐⭐⭐",
  "अनुभवी मैकेनिक, ओरिजिनल स्पेयर पार्ट्स और गारंटीड सर्विस! {businessName} में {serviceName} कराना सबसे अच्छा फैसला रहा। ⭐⭐⭐⭐⭐",
  "{businessName} के सर्विस एडवाइजर ने बहुत अच्छा मार्गदर्शन दिया। {serviceName} का काम तय समय में पूरा हुआ। ⭐⭐⭐⭐⭐"
];

const automotiveMarathi = [
  "{businessName} मध्ये वाहनाची सर्व्हिसिंग आणि दुरुस्ती अतिशय उत्तम प्रकारे झाली. {serviceName} चे काम वेळेत आणि योग्य दरात करून मिळाले. सर्वोत्तम गॅरेज! ⭐⭐⭐⭐⭐",
  "अतिशय प्रामाणिक आणि कुशल मेकॅनिक्स! {businessName} मध्ये {serviceName} साठी गेलो होतो, गाडीचा अनुभव आता एकदम नवा वाटतोय. धन्यवाद! ⭐⭐⭐⭐⭐",
  "{businessName} मधील सेवा तत्पर आणि दर्जेदार आहे. {serviceName} बाबत योग्य मार्गदर्शन आणि वाजवी दर मिळाले. नक्की भेट द्या! ⭐⭐⭐⭐⭐",
  "गाडीतील जुनाट आवाज {businessName} मधील मेकॅनिक्सनी {serviceName} दरम्यान अचूक शोधून काढला. उत्तम काम! ⭐⭐⭐⭐⭐",
  "{businessName} मध्ये ओरिजिनल स्पेयर पार्ट्स आणि आधुनिक तंत्रज्ञानाने {serviceName} चे काम केले जाते. ५ स्टार गॅरेज! ⭐⭐⭐⭐⭐",
  "अनावश्यक खर्च न वाढवता योग्य काम करणे ही {businessName} ची खासियत आहे. {serviceName} चे काम अत्यंत समाधानकारक झाले. ⭐⭐⭐⭐⭐",
  "{serviceName} नंतर गाडीचा पिकअप आणि मायलेज दोन्हीमध्ये खूप सुधारणा झाली. {businessName} ला मानाचा मुजरा! ⭐⭐⭐⭐⭐",
  "अतिशय तत्पर सेवा आणि वेळेवर गाडीची डिलिव्हरी! {businessName} मध्ये {serviceName} चा अनुभव खूप सुखद राहिला. ⭐⭐⭐⭐⭐",
  "पारदर्शक बिलिंग आणि कामाची वॉरंटी देणारे {businessName} हे परिसरातील सर्वात विश्वासार्ह गॅरेज आहे. ⭐⭐⭐⭐⭐",
  "गाडीची डेंटिंग, पेंटिंग आणि {serviceName} चे काम अगदी नव्या गाडीसारखे फिनिशिंग देऊन केले. मनापासून धन्यवाद! ⭐⭐⭐⭐⭐",
  "{businessName} मधील सर्व कर्मचारी अतिशय नम्र आणि अनुभवी आहेत. {serviceName} चे काम चोख झाले. ⭐⭐⭐⭐⭐",
  "रस्त्यात गाडी बंद पडल्यावर {businessName} ने तातडीने मदत पाठवून {serviceName} चे काम व्यवस्थित करून दिले. ⭐⭐⭐⭐⭐",
  "गाडीची संपूर्ण तपासणी करून {businessName} ने {serviceName} संदर्भात योग्य सल्ला दिला. ५ स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "वाजवी दर आणि उत्कृष्ट दर्जाचे मेकॅनिकल काम! {businessName} मध्ये {serviceName} करून पूर्ण समाधान मिळाले. ⭐⭐⭐⭐⭐",
  "इंजिन ट्युनिंग आणि {serviceName} चे काम अत्यंत कौशल्याने पूर्ण केले. {businessName} चे मनापासून आभार! ⭐⭐⭐⭐⭐",
  "{businessName} मध्ये कामाची स्वच्छता आणि टापटीप खूप छान आहे. {serviceName} चा अनुभव अप्रतिम राहिला. ⭐⭐⭐⭐⭐",
  "गाडी चालवताना आता खूप सुरक्षित आणि स्मूथ वाटते. {businessName} मधील {serviceName} सेवेची नक्की शिफारस करेन. ⭐⭐⭐⭐⭐",
  "अनुभवी तंत्रज्ञ आणि वेळेचे पक्के कारागीर! {businessName} मध्ये {serviceName} करून खूप आनंद झाला. ⭐⭐⭐⭐⭐",
  "गाडीची वॉशिंग आणि इंटिरिअर क्लिनिंगसह {serviceName} ची सर्विस {businessName} मध्ये उत्तम झाली. ⭐⭐⭐⭐⭐",
  "{serviceName} कामासाठी {businessName} हेच आमचे नेहमीचे आणि खात्रीशीर ठिकाण आहे. सर्वोत्तम ऑटो वर्कशॉप! ⭐⭐⭐⭐⭐"
];

// 3. DINING / RESTAURANT REVIEWS
const diningEnglish = [
  "Absolutely delicious food and fantastic atmosphere at {businessName}! The {serviceName} was freshly prepared and flavorful. Friendly service too! ⭐⭐⭐⭐⭐",
  "Great presentation, quick service, and clean ambience at {businessName}. Especially enjoyed the {serviceName}. Will definitely be returning! ⭐⭐⭐⭐⭐",
  "Top-notch culinary experience at {businessName}! Every dish was flavorful, especially the {serviceName}. Highly recommend to all food lovers! ⭐⭐⭐⭐⭐",
  "Warm hospitality, cozy seating, and mouth-watering {serviceName} at {businessName}. A wonderful place to visit with family and friends! ⭐⭐⭐⭐⭐",
  "A must-visit food destination! {businessName} never disappoints with their authentic taste and stellar customer attention. Loved the {serviceName}! ⭐⭐⭐⭐⭐",
  "Incredible flavors, generous portion sizes, and hygienic preparation at {businessName}. The {serviceName} was simply outstanding! ⭐⭐⭐⭐⭐",
  "The dining vibe at {businessName} is unmatched. Music, decor, and the delicious {serviceName} made our evening unforgettable. ⭐⭐⭐⭐⭐",
  "Prompt service and courteous staff at {businessName}. The chef did an extraordinary job with {serviceName}. 5 stars! ⭐⭐⭐⭐⭐",
  "Fresh ingredients and authentic recipes! {businessName} serves the best {serviceName} in town without a doubt. ⭐⭐⭐⭐⭐",
  "Great value for money and welcoming staff at {businessName}. The {serviceName} was cooked to perfection! ⭐⭐⭐⭐⭐",
  "Celebrated a family milestone at {businessName} and the hospitality was world-class. Loved the {serviceName}! ⭐⭐⭐⭐⭐",
  "Clean seating, polite waiters, and quick delivery of food at {businessName}. The {serviceName} exceeded all expectations. ⭐⭐⭐⭐⭐",
  "Rich aroma and exquisite presentation! Every bite of {serviceName} at {businessName} was pure delight. ⭐⭐⭐⭐⭐",
  "If you are looking for authentic taste, visit {businessName}. Their signature {serviceName} is a masterpiece! ⭐⭐⭐⭐⭐",
  "Crisp, fresh, and bursting with flavors. The {serviceName} at {businessName} is a must-try for everyone! ⭐⭐⭐⭐⭐",
  "Outstanding dessert, refreshing mocktails, and incredible {serviceName} at {businessName}. Highly recommended! ⭐⭐⭐⭐⭐",
  "Fast table turnover, clean restrooms, and delightful food at {businessName}. The {serviceName} was exceptional. ⭐⭐⭐⭐⭐",
  "The staff went out of their way to customize our {serviceName} order at {businessName}. Great customer care! ⭐⭐⭐⭐⭐",
  "Super cozy ambience and photogenic plating at {businessName}. Loved having {serviceName} with friends! ⭐⭐⭐⭐⭐",
  "Consistent taste every single visit! {businessName} maintains high standards in every serving of {serviceName}. ⭐⭐⭐⭐⭐",
  "Great spot for weekend dinner! The {serviceName} at {businessName} was fresh, hot, and full of flavor. ⭐⭐⭐⭐⭐",
  "Pocket-friendly prices and royal treatment at {businessName}. Their {serviceName} will make you keep coming back! ⭐⭐⭐⭐⭐",
  "Warm smiles, fast ordering, and delectable {serviceName} at {businessName}. Best restaurant in the city! ⭐⭐⭐⭐⭐",
  "Everything from starters to the main course {serviceName} was top notch at {businessName}. 5 stars all the way! ⭐⭐⭐⭐⭐",
  "Truly authentic spices and perfectly cooked {serviceName} at {businessName}. Can't wait to visit again! ⭐⭐⭐⭐⭐"
];

const diningHindi = [
  "{businessName} में लाजवाब स्वाद और बहुत ही शानदार माहौल! {serviceName} का स्वाद बेहद स्वादिष्ट था। सेवा भी बहुत तेज और विनम्र थी। ⭐⭐⭐⭐⭐",
  "परिवार के साथ भोजन के लिए {businessName} सबसे बढ़िया जगह है। {serviceName} की गुणवत्ता और स्वच्छता बहुत पसंद आई। 5 स्टार! ⭐⭐⭐⭐⭐",
  "{businessName} में हर व्यंजन का स्वाद अनोखा और ताज़ा है। {serviceName} की प्रस्तुति और खुशबू ने दिल जीत लिया। ⭐⭐⭐⭐⭐",
  "बहुत ही खूबसूरत इंटीरियर और तेज़ सर्विस! {businessName} में {serviceName} का स्वाद हमेशा याद रहेगा। ⭐⭐⭐⭐⭐",
  "उचित दाम, भरपूर मात्रा और बेहतरीन स्वाद! {businessName} में {serviceName} खाने का मज़ा ही कुछ और है। ⭐⭐⭐⭐⭐",
  "{businessName} का स्टाफ बहुत ही विनम्र और सहयोगी है। {serviceName} एकदम गरमा-गरम और स्वादिष्ट परोसा गया। ⭐⭐⭐⭐⭐",
  "स्वाद के दीवानों के लिए {businessName} स्वर्ग जैसा है। यहाँ का {serviceName} ज़रूर ट्राय करना चाहिए। ⭐⭐⭐⭐⭐",
  "साफ-सफाई और हाइजीन का पूरा ध्यान रखा गया है {businessName} में। {serviceName} की क्वालिटी बेस्ट थी। ⭐⭐⭐⭐⭐",
  "जन्मदिन की पार्टी के लिए {businessName} को चुना था, सबका अनुभव बहुत बढ़िया रहा। {serviceName} लाजवाब था! ⭐⭐⭐⭐⭐",
  "असली मसालों का स्वाद और बेहतरीन सर्विस! {businessName} में {serviceName} खाकर दिल खुश हो गया। ⭐⭐⭐⭐⭐",
  "{businessName} में खाने का हर निवाला स्वाद से भरपूर था। {serviceName} के लिए 5 स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "वीकेंड पर परिवार के साथ आउटिंग के लिए {businessName} बेहतरीन जगह है। {serviceName} का स्वाद अद्भुत था। ⭐⭐⭐⭐⭐",
  "{businessName} में बहुत ही शांत और खुशनुमा माहौल है। {serviceName} बहुत ही स्वादिष्ट बना था। ⭐⭐⭐⭐⭐",
  "तेज़ डिलीवरी और शानदार पैकिंग के साथ {businessName} का {serviceName} बहुत बढ़िया लगा। ⭐⭐⭐⭐⭐",
  "अगर आप बेहतरीन स्वाद और अच्छे माहौल की तलाश में हैं तो {businessName} ज़रूर आएं। {serviceName} शानदार था! ⭐⭐⭐⭐⭐",
  "{businessName} के शेफ की कुकिंग कला लाजवाब है। {serviceName} का हर बाइट स्वादिष्ट था। ⭐⭐⭐⭐⭐",
  "बच्चों और बड़ों दोनों को {businessName} का खाना बहुत पसंद आया। {serviceName} सचमुच बहुत टेस्टी था। ⭐⭐⭐⭐⭐",
  "किफायती दामों में फाइव स्टार जैसा खाना और माहौल! {businessName} में {serviceName} का अनुभव बहुत खास रहा। ⭐⭐⭐⭐⭐"
];

const diningMarathi = [
  "{businessName} मधील जेवणाची चव आणि स्वच्छता खरोखरच अप्रतिम आहे. {serviceName} चा स्वाद अतिशय रुचकर होता. पुन्हा नक्की भेट देणार! ⭐⭐⭐⭐⭐",
  "उत्तम बैठक व्यवस्था, तत्पर सेवा आणि चवदार {serviceName}. {businessName} मधील अनुभव खूप सुखद राहिला. ⭐⭐⭐⭐⭐",
  "कुटुंबासमवेत जेवणाचा आनंद घेण्यासाठी {businessName} हे सर्वोत्तम ठिकाण आहे. {serviceName} ची चव जिभेवर रेंगाळणारी आहे. ⭐⭐⭐⭐⭐",
  "{businessName} मधील आतिथ्य आणि कर्मचाऱ्यांची तत्परता कौतुकास्पद आहे. {serviceName} एकदम गरमागरम आणि ताज्या स्वरूपात मिळाले. ⭐⭐⭐⭐⭐",
  "उत्कृष्ट चव, माफक दर आणि भरपूर प्रमाण! {businessName} मध्ये {serviceName} खाण्याचा अनुभव अप्रतिम होता. ⭐⭐⭐⭐⭐",
  "स्वच्छता आणि सुंदर अंतर्गत सजावट! {businessName} मध्ये {serviceName} चा आस्वाद घेताना खूप आनंद झाला. ⭐⭐⭐⭐⭐",
  "अस्सल मसाल्यांचा सुवास आणि लाजवाब चव! {businessName} मधील {serviceName} प्रत्येकाने चाखायलाच हवे. ⭐⭐⭐⭐⭐",
  "मित्रांसोबत पार्टी करण्यासाठी {businessName} उत्तम जागा आहे. {serviceName} ची डिश सर्वांनाच खूप आवडली. ⭐⭐⭐⭐⭐",
  "{businessName} मध्ये जेवणाची क्वॉलिटी नेहमीच एक नंबर असते. {serviceName} साठी ५ स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "तत्पर ऑर्डर आणि हसतमुख सर्व्हिस! {businessName} मध्ये {serviceName} चा अनुभव मनाला भावणारा होता. ⭐⭐⭐⭐⭐",
  "मन तृप्त करणारी चव आणि प्रसन्न वातावरण! {businessName} मधील {serviceName} खरोखरच अप्रतिम होते. ⭐⭐⭐⭐⭐",
  "पारंपरिक चव आधुनिक पद्धतीने सादर करणारे {businessName} हे आमचे आवडते रेस्टॉरंट आहे. {serviceName} मस्तच! ⭐⭐⭐⭐⭐",
  "प्रत्येक पदार्थाची सजावट आणि चव उच्च दर्जाची होती. {businessName} मधील {serviceName} नक्की ट्राय करा. ⭐⭐⭐⭐⭐",
  "स्वच्छ किचन आणि आरोग्यदायी जेवण! {businessName} मध्ये {serviceName} चा आस्वाद खूप छान वाटला. ⭐⭐⭐⭐⭐",
  "वीकेंडला मनसोक्त जेवणासाठी {businessName} ची निवड अगदी योग्य ठरली. {serviceName} खूप चवदार होते. ⭐⭐⭐⭐⭐",
  "वाजवी दरात पंचतारांकित हॉटेलसारखा अनुभव {businessName} मध्ये मिळतो. {serviceName} साठी धन्यवाद! ⭐⭐⭐⭐⭐",
  "हॉटेलमधील शांत संगीत आणि रुचकर {serviceName} यामुळे संध्याकाळ खूप सुंदर झाली. {businessName} ला ५ स्टार! ⭐⭐⭐⭐⭐",
  "खवय्यांसाठी {businessName} हे पर्वणीच आहे. {serviceName} चा स्वाद अतिशय अप्रतिम होता! ⭐⭐⭐⭐⭐"
];

// 4. RETAIL / SHOPPING REVIEWS
const retailEnglish = [
  "Impressive collection, competitive pricing, and courteous staff at {businessName}. Found exactly what I needed for {serviceName}. Super happy! ⭐⭐⭐⭐⭐",
  "Seamless shopping experience at {businessName}. Staff helped me find the best options for {serviceName}. Highly recommend their store! ⭐⭐⭐⭐⭐",
  "Great variety, genuine products, and very welcoming staff at {businessName}. My go-to store for {serviceName}! ⭐⭐⭐⭐⭐",
  "High quality items and fantastic customer support at {businessName}. The shopping for {serviceName} was effortless! ⭐⭐⭐⭐⭐",
  "Very organized store layout and quick billing at {businessName}. Found exclusive choices for {serviceName}. ⭐⭐⭐⭐⭐",
  "The sales team at {businessName} is polite and never pushy. They guided me to the right product for {serviceName}. ⭐⭐⭐⭐⭐",
  "Unbeatable discounts and authentic brands at {businessName}. Extremely happy with my purchase of {serviceName}! ⭐⭐⭐⭐⭐",
  "Top quality finish and warranty support at {businessName}. Their collection for {serviceName} is trending and elegant. ⭐⭐⭐⭐⭐",
  "A delightful retail store with ample parking and great ambience! {businessName} made buying {serviceName} a pleasure. ⭐⭐⭐⭐⭐",
  "Friendly billing staff, hassle-free exchange policy, and superb variety for {serviceName} at {businessName}. ⭐⭐⭐⭐⭐",
  "I always find the latest arrivals at {businessName}. Their stock for {serviceName} is always fresh and modern. ⭐⭐⭐⭐⭐",
  "Transparent pricing and genuine invoices at {businessName}. Highly satisfied with {serviceName}! ⭐⭐⭐⭐⭐",
  "Staff helped customize my order for {serviceName} with great patience at {businessName}. 5-star customer care! ⭐⭐⭐⭐⭐",
  "Wide range of designs and premium quality material at {businessName}. Loved shopping for {serviceName}. ⭐⭐⭐⭐⭐",
  "Quick checkout, neat packaging, and friendly staff at {businessName}. Best place to purchase {serviceName}! ⭐⭐⭐⭐⭐",
  "Value for money shopping destination! {businessName} offers great perks on {serviceName}. Highly recommended! ⭐⭐⭐⭐⭐",
  "Clean aisles, well-displayed items, and helpful attendants at {businessName}. Got the best deal on {serviceName}. ⭐⭐⭐⭐⭐",
  "The product durability from {businessName} is second to none. Very pleased with my {serviceName} buy. ⭐⭐⭐⭐⭐",
  "Excellent customer appreciation and loyalty rewards at {businessName}. Truly loved the {serviceName} collection. ⭐⭐⭐⭐⭐",
  "One-stop shopping store with exceptional quality! {businessName} is our top recommendation for {serviceName}. ⭐⭐⭐⭐⭐"
];

const retailHindi = [
  "{businessName} में शानदार वैरायटी और बहुत अच्छा स्टाफ। {serviceName} के लिए बहुत सही विकल्प मिले। खरीदारी का अनुभव बेहतरीन रहा! ⭐⭐⭐⭐⭐",
  "उचित दाम और उच्च गुणवत्ता! {businessName} में {serviceName} की खरीदारी बहुत अच्छी रही। ⭐⭐⭐⭐⭐",
  "{businessName} में ग्राहकों की पसंद का पूरा ध्यान रखा जाता है। {serviceName} के ढेरों आधुनिक विकल्प उपलब्ध हैं। ⭐⭐⭐⭐⭐",
  "स्टाफ का व्यवहार बहुत ही सहयोगी और विनम्र है। {businessName} में {serviceName} खरीदना बहुत आसान रहा। ⭐⭐⭐⭐⭐",
  "असली उत्पाद और भरोसेमंद वारंटी! {businessName} से {serviceName} लेकर पूरा संतोष मिला। ⭐⭐⭐⭐⭐",
  "दुकान में बहुत ही व्यवस्थित डिस्प्ले और साफ-सफाई है। {businessName} में {serviceName} पर बहुत अच्छा डिस्काउंट मिला। ⭐⭐⭐⭐⭐",
  "हर बजट के लिए बेहतरीन सामान {businessName} में मौजूद है। {serviceName} के लिए 5 स्टार स्टोर! ⭐⭐⭐⭐⭐",
  "त्वरित बिलिंग और सुरक्षित पैकिंग! {businessName} में {serviceName} की शॉपिंग का मज़ा आ गया। ⭐⭐⭐⭐⭐",
  "नए और ट्रेंडी कलेक्शन के लिए {businessName} सबसे सही जगह है। {serviceName} की क्वालिटी बहुत उम्दा है। ⭐⭐⭐⭐⭐",
  "{businessName} में रिटर्न और एक्सचेंज पॉलिसी बहुत आसान है। {serviceName} की खरीदारी से बहुत खुश हूँ। ⭐⭐⭐⭐⭐",
  "पारदर्शी मूल्य और विश्वसनीय बिलिंग! {businessName} में {serviceName} का अनुभव बहुत सुखद था। ⭐⭐⭐⭐⭐",
  "स्टाफ ने बहुत धैर्य से सभी वैरायटी दिखाई। {businessName} में {serviceName} की बेस्ट डील मिली। ⭐⭐⭐⭐⭐",
  "प्रीमियम क्वालिटी का सामान और दोस्ताना माहौल! {businessName} में {serviceName} के लिए ज़रूर जाएं। ⭐⭐⭐⭐⭐",
  "त्योहारों की खरीदारी के लिए {businessName} सर्वोत्तम दुकान है। {serviceName} बहुत पसंद आया। ⭐⭐⭐⭐⭐",
  "{businessName} की आफ्टर-सेल्स सर्विस भी बहुत अच्छी है। {serviceName} के लिए पूरा पैसा वसूल! ⭐⭐⭐⭐⭐"
];

const retailMarathi = [
  "{businessName} मध्ये वाजवी दर आणि खात्रीशीर गुणवत्ता मिळते. {serviceName} साठी योग्य सहकार्य मिळाले. धन्यवाद! ⭐⭐⭐⭐⭐",
  "उत्कृष्ट व्हरायटी आणि विनम्र कर्मचारी! {businessName} मध्ये {serviceName} ची खरेदी अतिशय समाधानकारक झाली. ⭐⭐⭐⭐⭐",
  "{businessName} मध्ये नवीन आणि ट्रेंडी डिझाईन्सचे भरपूर पर्याय उपलब्ध आहेत. {serviceName} खरेदीचा अनुभव खूप छान होता. ⭐⭐⭐⭐⭐",
  "ग्राहकांच्या आवडीनुसार योग्य वस्तू सुचवणारे कुशल कर्मचारी {businessName} मध्ये आहेत. {serviceName} खूप आवडले! ⭐⭐⭐⭐⭐",
  "दर्जेदार उत्पादने आणि खात्रीशीर वॉरंटी! {businessName} मधून {serviceName} खरेदी करून पूर्ण समाधान मिळाले. ⭐⭐⭐⭐⭐",
  "दुकान अतिशय टापटीप आणि आकर्षक आहे. {businessName} मध्ये {serviceName} वर उत्तम डिस्काउंट मिळाला. ⭐⭐⭐⭐⭐",
  "जलद बिलिंग आणि व्यवस्थित पॅकिंग! {businessName} हे {serviceName} खरेदीसाठी सर्वोत्तम ठिकाण आहे. ⭐⭐⭐⭐⭐",
  "वाजवी किमतीत उच्च दर्जाच्या वस्तू मिळण्याचे खात्रीशीर ठिकाण म्हणजे {businessName}. {serviceName} साठी ५ स्टार! ⭐⭐⭐⭐⭐",
  "{businessName} मधील कर्मचाऱ्यांचा स्वभाव अतिशय नम्र आणि मदतशील आहे. {serviceName} ची छान निवड करता आली. ⭐⭐⭐⭐⭐",
  "सण-उत्सवाच्या खरेदीसाठी {businessName} हे आमचे आवडते दुकान आहे. {serviceName} ची क्वॉलिटी उत्तम आहे. ⭐⭐⭐⭐⭐",
  "पारदर्शक दर आणि पक्के बिल! {businessName} मधील {serviceName} खरेदीचा अनुभव मन प्रसन्न करणारा होता. ⭐⭐⭐⭐⭐",
  "प्रत्येक ग्राहकाला आदरपूर्वक सेवा देणारे {businessName} हे परिसरातील नंबर १ स्टोअर आहे. {serviceName} मस्त! ⭐⭐⭐⭐⭐",
  "{businessName} मध्ये उत्पादनांची टिकाऊपणा आणि फिनिशिंग उत्कृष्ट असते. {serviceName} साठी मनःपूर्वक धन्यवाद! ⭐⭐⭐⭐⭐",
  "खरेदीनंतरही उत्तम सेवा देणारे {businessName} हे अतिशय विश्वासार्ह आहे. {serviceName} नक्की खरेदी करा. ⭐⭐⭐⭐⭐",
  "माफक दरात उत्कृष्ट शॉपिंगचा आनंद {businessName} मध्ये मिळाला. {serviceName} साठी ५ स्टार रेटिंग! ⭐⭐⭐⭐⭐"
];

// 5. CORPORATE / TECH / CONSULTING REVIEWS
const corporateEnglish = [
  "Extremely professional agency! {businessName} delivered our project with exceptional attention to detail and timely support for {serviceName}. Outstanding work! ⭐⭐⭐⭐⭐",
  "{businessName} has been an invaluable growth partner for us. Their expertise in {serviceName}, strategic insight, and dedication are second to none. 5 stars! ⭐⭐⭐⭐⭐",
  "High quality deliverables, prompt communication, and great results by the team at {businessName} for {serviceName}. Highly recommended! ⭐⭐⭐⭐⭐",
  "The domain expertise demonstrated by {businessName} during {serviceName} helped accelerate our business goals significantly. ⭐⭐⭐⭐⭐",
  "Proactive problem solvers! Working with {businessName} on {serviceName} was smooth, structured, and completely transparent. ⭐⭐⭐⭐⭐",
  "Innovative solutions and top-tier execution! {businessName} transformed our approach to {serviceName}. ⭐⭐⭐⭐⭐",
  "Exceptional project management, clear milestones, and on-time delivery by {businessName} for {serviceName}. ⭐⭐⭐⭐⭐",
  "The technical competence of {businessName} in delivering {serviceName} exceeded our highest expectations. ⭐⭐⭐⭐⭐",
  "Reliable, responsive, and result-oriented team at {businessName}. They provided tremendous value for {serviceName}. ⭐⭐⭐⭐⭐",
  "Great collaboration and seamless integration! {businessName} handled our {serviceName} requirements with complete precision. ⭐⭐⭐⭐⭐",
  "Outstanding ROI and measurable business impact after partnering with {businessName} for {serviceName}. ⭐⭐⭐⭐⭐",
  "Dedicated account managers and swift turnaround on feedback. {businessName} is our trusted vendor for {serviceName}. ⭐⭐⭐⭐⭐",
  "Transparent reporting, strategic clarity, and deep commitment from {businessName} on {serviceName}. 5 stars! ⭐⭐⭐⭐⭐",
  "Highly skilled professionals who understand business nuance. {businessName} executed {serviceName} flawlessly. ⭐⭐⭐⭐⭐",
  "Flawless communication throughout the engagement. {businessName} made {serviceName} implementation completely hassle-free. ⭐⭐⭐⭐⭐",
  "Scalable, robust, and modern solutions delivered by {businessName} for our {serviceName} initiative. ⭐⭐⭐⭐⭐",
  "The team at {businessName} goes above and beyond to ensure client success. Incredible job on {serviceName}! ⭐⭐⭐⭐⭐",
  "Superb engineering standards and insightful consulting at {businessName}. Highly impressed with {serviceName}. ⭐⭐⭐⭐⭐",
  "Consistent quality and strategic innovation! Partnering with {businessName} for {serviceName} was our best decision this year. ⭐⭐⭐⭐⭐",
  "Dependable corporate partner! {businessName} delivered {serviceName} ahead of schedule with zero compromise on quality. ⭐⭐⭐⭐⭐"
];

const corporateHindi = [
  "{businessName} के साथ काम करने का अनुभव बहुत ही पेशेवर और सफल रहा। {serviceName} में उनकी विशेषज्ञता और सहयोग बहुत सराहनीय है। ⭐⭐⭐⭐⭐",
  "समय पर डिलीवरी और बेहतरीन तकनीकी समझ! {businessName} ने {serviceName} का काम बहुत ही उच्च मानकों के साथ पूरा किया। ⭐⭐⭐⭐⭐",
  "{businessName} की टीम बहुत ही इनोवेटिव और समर्पित है। {serviceName} के दौरान उनका संवाद और सहयोग लाजवाब था। ⭐⭐⭐⭐⭐",
  "हमारे व्यापार को आगे बढ़ाने में {businessName} ने {serviceName} के माध्यम से बहुत महत्वपूर्ण भूमिका निभाई है। ⭐⭐⭐⭐⭐",
  "स्पष्ट कार्ययोजना और उत्कृष्ट परिणाम! {businessName} के साथ {serviceName} पर काम करके बहुत खुशी हुई। ⭐⭐⭐⭐⭐",
  "{businessName} में काम करने का तरीका बहुत ही पारदर्शी और पेशेवर है। {serviceName} के लिए 5 स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "क्वालिटी और समयबद्धता के मामले में {businessName} बेमिसाल है। {serviceName} का आउटपुट बहुत शानदार रहा। ⭐⭐⭐⭐⭐",
  "हर समस्या का त्वरित और सटीक समाधान! {businessName} ने {serviceName} प्रोजेक्ट को बहुत कुशलता से संभाला। ⭐⭐⭐⭐⭐",
  "विश्वसनीय कॉर्पोरेट पार्टनर! {businessName} की टीम ने {serviceName} में हमारी उम्मीदों से बढ़कर काम किया। ⭐⭐⭐⭐⭐",
  "{businessName} की रणनीतिक सलाह और तकनीकी क्षमता ने {serviceName} को सफल बनाया। बहुत-बहुत धन्यवाद! ⭐⭐⭐⭐⭐",
  "क्लाइंट संतुष्टि को प्राथमिकता देने वाली कंपनी! {businessName} ने {serviceName} में बहुत उम्दा सेवाएं दीं। ⭐⭐⭐⭐⭐",
  "{businessName} के साथ प्रोजेक्ट करना बहुत ही सहज और तनावमुक्त रहा। {serviceName} का काम समय से पहले हुआ। ⭐⭐⭐⭐⭐",
  "उच्च कोटि की कार्यकुशलता और बेहतरीन सपोर्ट! {businessName} को {serviceName} के लिए अत्यधिक अनुशंसित करता हूँ। ⭐⭐⭐⭐⭐",
  "व्यावसायिक नैतिकता और मजबूत टीमवर्क! {businessName} ने {serviceName} में अपनी श्रेष्ठता साबित की। ⭐⭐⭐⭐⭐",
  "{businessName} एक भरोसेमंद एजेंसी है। {serviceName} के सफल क्रियान्वयन के लिए पूरी टीम को बधाई! ⭐⭐⭐⭐⭐"
];

const corporateMarathi = [
  "{businessName} ची कार्यपद्धती अत्यंत व्यावसायिक आणि दर्जेदार आहे. {serviceName} साठी त्यांनी दिलेले सहकार्य मोलाचे ठरले. ⭐⭐⭐⭐⭐",
  "वेळेवर काम पूर्ण करणे आणि उत्कृष्ट संवाद! {businessName} ने {serviceName} चे उद्दिष्ट अत्यंत प्रभावीपणे साध्य केले. ⭐⭐⭐⭐⭐",
  "{businessName} मधील तंत्रज्ञान आणि रणनीती कौशल्यामुळे {serviceName} चा प्रकल्प वेळेत व दर्जेदार झाला. ५ स्टार! ⭐⭐⭐⭐⭐",
  "आमच्या व्यवसायाला गती देण्यासाठी {businessName} चे {serviceName} क्षेत्रातील मार्गदर्शन खूप उपयोगी ठरले. ⭐⭐⭐⭐⭐",
  "पारदर्शक नियोजन आणि उच्च दर्जाची अंमलबजावणी! {businessName} सोबत {serviceName} साठी काम करणे सुखद होते. ⭐⭐⭐⭐⭐",
  "{businessName} ची संपूर्ण टीम अतिशय कल्पक आणि जबाबदार आहे. {serviceName} चे काम अत्यंत समाधानकारक झाले. ⭐⭐⭐⭐⭐",
  "ग्राहक समाधानाला प्राधान्य देणारी संस्था! {businessName} ने {serviceName} बाबत दिलेली सेवा सर्वोत्तम आहे. ⭐⭐⭐⭐⭐",
  "अचूक नियोजन आणि दर्जेदार आऊटपुट! {businessName} ने {serviceName} चे काम अगदी व्यवस्थित पार पाडले. ⭐⭐⭐⭐⭐",
  "विश्वासार्ह व्यावसायिक भागीदार! {businessName} कडून {serviceName} साठी मिळालेले सहकार्य अतुलनीय आहे. ⭐⭐⭐⭐⭐",
  "{businessName} च्या तांत्रिक कौशल्याने {serviceName} प्रकल्पाला नवीन उंचीवर नेले. मनःपूर्वक धन्यवाद! ⭐⭐⭐⭐⭐",
  "प्रत्येक टप्प्यावर योग्य संवाद आणि तत्पर सपोर्ट! {businessName} ला {serviceName} साठी ५ स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "अत्याधुनिक उपाय आणि प्रामाणिक काम! {businessName} ने {serviceName} मध्ये उत्कृष्ट कामगिरी केली. ⭐⭐⭐⭐⭐",
  "{businessName} सोबत काम करण्याचा अनुभव अत्यंत व्यावसायिक आणि फलदायी राहिला. {serviceName} साठी अभिनंदन! ⭐⭐⭐⭐⭐",
  "वेळेचे काटेकोर पालन आणि उच्च गुणवत्ता! {businessName} ने {serviceName} प्रकल्पात आपली गुणवत्ता सिद्ध केली. ⭐⭐⭐⭐⭐",
  "दीर्घकालीन व्यावसायिक संबंधांसाठी {businessName} ही सर्वात विश्वासार्ह संस्था आहे. {serviceName} साठी धन्यवाद! ⭐⭐⭐⭐⭐"
];

// 6. GENERAL BUSINESS REVIEWS
const generalEnglish = [
  "Exceptional service and outstanding quality from {businessName}! Their team was knowledgeable, polite, and went above and beyond to assist us with {serviceName}. ⭐⭐⭐⭐⭐",
  "Prompt, professional, and reliable. Dealing with {businessName} was a breeze, and their attention to detail on {serviceName} is commendable. Highly recommended! ⭐⭐⭐⭐⭐",
  "Amazing customer experience! The staff at {businessName} made sure all our requirements for {serviceName} were fulfilled promptly. Will definitely visit again. ⭐⭐⭐⭐⭐",
  "Great value, transparent pricing, and top-tier professionalism at {businessName}. Truly happy with their {serviceName} services! ⭐⭐⭐⭐⭐",
  "Loved the warm hospitality and seamless execution at {businessName}. They take immense pride in their work. 5-star experience all the way! ⭐⭐⭐⭐⭐",
  "Quick response time and honest advice at {businessName}. They handled our {serviceName} with supreme care and precision. ⭐⭐⭐⭐⭐",
  "I am thoroughly impressed by the integrity and high standards of {businessName}. The {serviceName} exceeded expectations! ⭐⭐⭐⭐⭐",
  "Smooth process from start to finish at {businessName}. Friendly staff and very efficient service for {serviceName}. ⭐⭐⭐⭐⭐",
  "Reliable and trustworthy! {businessName} delivers on every promise they make regarding {serviceName}. ⭐⭐⭐⭐⭐",
  "Extremely courteous team and clean environment at {businessName}. Thank you for the wonderful support with {serviceName}! ⭐⭐⭐⭐⭐",
  "Top quality results without any unnecessary hassle! {businessName} is our first choice for {serviceName}. ⭐⭐⭐⭐⭐",
  "Clear communication, affordable pricing, and fast delivery at {businessName}. Loving the outcome of {serviceName}! ⭐⭐⭐⭐⭐",
  "The entire staff at {businessName} is well-trained, polite, and attentive. Excellent handling of {serviceName}. ⭐⭐⭐⭐⭐",
  "A truly wonderful business to deal with! {businessName} handled our {serviceName} with utmost perfection. ⭐⭐⭐⭐⭐",
  "Punctual, dependable, and highly professional at {businessName}. My {serviceName} was completed ahead of time! ⭐⭐⭐⭐⭐",
  "Exceptional value for money and outstanding service standards at {businessName}. Highly satisfied with {serviceName}! ⭐⭐⭐⭐⭐",
  "Great customer support even after service completion at {businessName}. Highly recommend them for {serviceName}. ⭐⭐⭐⭐⭐",
  "Very pleasant experience! {businessName} made our {serviceName} process effortless and satisfying. ⭐⭐⭐⭐⭐",
  "Dedicated team, honest guidance, and superior execution at {businessName}. Thank you for great {serviceName}! ⭐⭐⭐⭐⭐",
  "Five stars are not enough for {businessName}! Their dedication to excellence in {serviceName} is truly commendable. ⭐⭐⭐⭐⭐",
  "Friendly front desk, knowledgeable specialists, and fast resolution at {businessName} for {serviceName}. ⭐⭐⭐⭐⭐",
  "Dependable quality and transparent transactions at {businessName}. We will definitely keep returning for {serviceName}! ⭐⭐⭐⭐⭐",
  "Impressive attention to every detail at {businessName}. They made {serviceName} a delightful experience. ⭐⭐⭐⭐⭐",
  "Always a pleasure doing business with {businessName}. Their {serviceName} standard remains consistently high! ⭐⭐⭐⭐⭐",
  "Super fast turnaround, friendly staff, and top quality results at {businessName}. 10/10 recommended! ⭐⭐⭐⭐⭐"
];

const generalHindi = [
  "{businessName} की सेवाएं बेहद उच्च स्तरीय और भरोसेमंद हैं। {serviceName} के दौरान उनका सहयोग और गुणवत्ता बहुत शानदार रही। ⭐⭐⭐⭐⭐",
  "बहुत ही विनम्र स्टाफ और बेहतरीन सेवा! {businessName} में {serviceName} का अनुभव बहुत ही सुखद और संतोषजनक था। ⭐⭐⭐⭐⭐",
  "{businessName} में काम कराने का अनुभव बहुत ही आसान और पारदर्शी रहा। {serviceName} के लिए 5 स्टार! ⭐⭐⭐⭐⭐",
  "उचित दाम और उच्च गुणवत्ता वाली सेवाएं! {businessName} ने {serviceName} का काम बहुत ही बारीकी से किया। ⭐⭐⭐⭐⭐",
  "समय की पाबंदी और ग्राहकों का सम्मान {businessName} की पहचान है। {serviceName} से बहुत खुश हूँ। ⭐⭐⭐⭐⭐",
  "{businessName} का स्टाफ हर सवाल का जवाब बहुत धैर्य से देता है। {serviceName} का काम बहुत बढ़िया हुआ। ⭐⭐⭐⭐⭐",
  "भरोसेमंद और प्रामाणिक प्रतिष्ठान! {businessName} में {serviceName} की गुणवत्ता वाकई तारीफ के काबिल है। ⭐⭐⭐⭐⭐",
  "त्वरित सेवा और दोस्ताना माहौल! {businessName} में {serviceName} का अनुभव बहुत अच्छा रहा। ⭐⭐⭐⭐⭐",
  "{businessName} ने हमारी जरूरत को समझकर {serviceName} में बेहतरीन सहायता दी। धन्यवाद! ⭐⭐⭐⭐⭐",
  "हर स्तर पर पारदर्शिता और ईमानदारी! {businessName} में {serviceName} के लिए पूरा पैसा वसूल। ⭐⭐⭐⭐⭐",
  "{businessName} की सेवा ने हमें बहुत प्रभावित किया। {serviceName} का काम तय समय में पूरा हुआ। ⭐⭐⭐⭐⭐",
  "उत्कृष्ट कार्यशैली और समर्पित टीम! {businessName} में {serviceName} कराना बहुत सही फैसला रहा। ⭐⭐⭐⭐⭐",
  "ग्राहक संतुष्टि के मामले में {businessName} नंबर एक है। {serviceName} के लिए बहुत-बहुत धन्यवाद! ⭐⭐⭐⭐⭐",
  "{businessName} में हर काम बहुत ही पेशेवर ढंग से किया जाता है। {serviceName} के लिए 5 स्टार रेटिंग। ⭐⭐⭐⭐⭐",
  "शानदार अनुभव! {businessName} में {serviceName} के दौरान स्टाफ का व्यवहार बहुत ही आत्मीय था। ⭐⭐⭐⭐⭐",
  "सस्ती और टिकाऊ सेवा के लिए {businessName} सबसे उत्तम जगह है। {serviceName} बहुत पसंद आया। ⭐⭐⭐⭐⭐",
  "{businessName} के साथ जुड़कर बहुत अच्छा लगा। {serviceName} का कार्य अत्यंत संतोषजनक था। ⭐⭐⭐⭐⭐",
  "बिना किसी देरी के तुरंत सेवा! {businessName} में {serviceName} का अनुभव अविस्मरणीय रहा। ⭐⭐⭐⭐⭐"
];

const generalMarathi = [
  "{businessName} कडून मिळालेली सेवा अतिशय दर्जेदार आणि तत्पर होती. {serviceName} चे काम अत्यंत समाधानकारक झाले. ५ स्टार! ⭐⭐⭐⭐⭐",
  "विश्वासार्ह आणि उत्कृष्ट कार्यपद्धती! {businessName} मधील सर्व कर्मचाऱ्यांचे सहकार्य खूप छान होते. मनापासून धन्यवाद! ⭐⭐⭐⭐⭐",
  "{businessName} मध्ये ग्राहकांच्या समाधानाला नेहमीच प्राधान्य दिले जाते. {serviceName} चे काम वेळेत पूर्ण झाले. ⭐⭐⭐⭐⭐",
  "पारदर्शक व्यवहार आणि वाजवी दर! {businessName} मध्ये {serviceName} चा अनुभव अतिशय आनंददायी होता. ⭐⭐⭐⭐⭐",
  "अतिशय नम्र आणि अनुभवी कर्मचारी! {businessName} कडून {serviceName} साठी मिळालेले मार्गदर्शन खूप मोलाचे होते. ⭐⭐⭐⭐⭐",
  "{businessName} मधील कामाचा दर्जा खरोखरच कौतुकास्पद आहे. {serviceName} साठी ५ स्टार रेटिंग! ⭐⭐⭐⭐⭐",
  "वेळेचे काटेकोर नियोजन आणि दर्जेदार सेवा {businessName} ची खासियत आहे. {serviceName} खूप छान झाले. ⭐⭐⭐⭐⭐",
  "कामात तत्परता आणि प्रामाणिकपणा! {businessName} मध्ये {serviceName} करून खूप समाधान वाटले. ⭐⭐⭐⭐⭐",
  "{businessName} हे परिसरातील सर्वात विश्वासार्ह ठिकाण आहे. {serviceName} च्या कामासाठी नक्की भेट द्या. ⭐⭐⭐⭐⭐",
  "कोणताही त्रास न होता झटपट सेवा मिळाली. {businessName} मधील {serviceName} चा अनुभव उत्तम होता. ⭐⭐⭐⭐⭐",
  "वाजवी खर्चात उच्च दर्जाची सेवा {businessName} देते. {serviceName} चे काम मन जिंकणारे होते. ⭐⭐⭐⭐⭐",
  "{businessName} मधील प्रत्येक व्यक्ती अतिशय आदराने वागते. {serviceName} साठी मनःपूर्वक धन्यवाद! ⭐⭐⭐⭐⭐",
  "उत्कृष्ट सेवा, प्रामाणिक सल्ला आणि जलद निकाल! {businessName} मध्ये {serviceName} करून आनंद झाला. ⭐⭐⭐⭐⭐",
  "{businessName} च्या कार्यपद्धतीवर आमचा पूर्ण विश्वास आहे. {serviceName} साठी ५ स्टार! ⭐⭐⭐⭐⭐",
  "ग्राहकांची प्रत्येक अडचण समजून घेणारे {businessName} हे आदर्श प्रतिष्ठान आहे. {serviceName} मस्त! ⭐⭐⭐⭐⭐",
  "कामातील अचूकता आणि स्वच्छता पाहून समाधान वाटले. {businessName} मध्ये {serviceName} चा अनुभव छान राहिला. ⭐⭐⭐⭐⭐",
  "{businessName} मधील कामाची गुणवत्ता कायम उच्च दर्जाची असते. {serviceName} साठी खूप खूप शुभेच्छा! ⭐⭐⭐⭐⭐",
  "सर्वोत्तम ग्राहक सेवा आणि दर्जेदार काम! {businessName} मध्ये {serviceName} चा अनुभव खूप सुखद होता. ⭐⭐⭐⭐⭐"
];

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
  description: "400+ Unique Dynamic Industry-Specific Review Templates with Keyword Interpolation and Multi-Language Variation (English, Hindi, Marathi)",
  totalTemplates: totalCount,
  templates: allTemplates
};

const serverPath = path.join(__dirname, '../data/reviewsPool.json');
const clientPath = path.join(__dirname, '../../client/src/data/reviewsPool.json');

fs.writeFileSync(serverPath, JSON.stringify(finalPool, null, 2), 'utf8');
fs.writeFileSync(clientPath, JSON.stringify(finalPool, null, 2), 'utf8');

console.log(`Successfully generated ${totalCount} review templates in server and client reviewsPool.json!`);
