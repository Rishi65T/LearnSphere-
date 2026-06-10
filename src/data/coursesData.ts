export interface MultilingualVideo {
  English: string;
  Tamil: string;
  Hindi: string;
  Telugu: string;
  Spanish: string;
}

export interface Lesson {
  id: number;
  title: string;
  type: "VIDEO" | "READING" | "LAB" | "PROJECT";
  time: string;
  embeds?: MultilingualVideo;
  iconName: "book" | "video" | "code" | "sparkles";
  chapterNotes: string;
  keyPoints: string[];
  transcripts?: Record<string, { time: string; text: string }[]>;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  difficulty: "Beginner" | "Medium" | "Hard";
  iconName: "brain" | "layout" | "terminal" | "cloud";
  themeColor: string;
  lessons: Lesson[];
}

export const ENGINEERING_COURSES: Course[] = [
  {
    id: "genai-101",
    title: "Generative AI Foundations & LLMs",
    description: "Master LLMs, transformer architecture, self-attention, prompt engineering, and API integrations.",
    instructor: "Dr. Maria Patel",
    category: "AI & Data Science",
    difficulty: "Beginner",
    iconName: "brain",
    themeColor: "from-orange-400 to-rose-400",
    lessons: [
      {
        id: 1,
        title: "Introduction to Generative Artificial Intelligence",
        type: "VIDEO",
        time: "15 min",
        iconName: "sparkles",
        embeds: {
          English: "https://www.youtube.com/embed/2eWuYf-aZE4",
          Tamil: "https://www.youtube.com/embed/Z3Qk1nreKic",
          Hindi: "https://www.youtube.com/embed/yXfJqGkP_Qk",
          Telugu: "https://www.youtube.com/embed/SgM52D3kO1M",
          Spanish: "https://www.youtube.com/embed/_OqfH5P7D0s"
        },
        chapterNotes: `## Chapter 1: Introduction to Generative Artificial Intelligence
        
Generative Artificial Intelligence (GenAI) represents a paradigm shift where deep learning neural networks learn the underlying core probability distribution of training datasets to generate entirely new, contextually cohesive media—ranging from human-like text and programming source code to synthesized audio files and high-resolution digital art.

Unlike traditional discriminative machine learning algorithms designed to predict labels or categorize structured data streams, generative models focus on modeling statistical patterns to generate candidate samples that belong to the learned training distributions.

### Historical Milestones:
1. **Rule-Based Grammars**: Synthesizing rigid, predefined template prompts.
2. **Generative Adversarial Networks (GANs, 2014)**: Pitting a generator network against a discriminator network to achieve beautiful image outputs.
3. **The Transformer Revolution (2017)**: Google's breakthrough attention layer, permitting unprecedented compute scaling and parallel model optimization.

### Practical Application Strategy:
* Evaluate feasibility: Verify whether you require high-dimensional factual classification (discriminative models) or interactive semantic creation (generative models).
* Clean raw datasets thoroughly beforehand to prevent the garbage-in, garbage-out data pipeline trap.`,
        keyPoints: [
          "Generative AI learns dataset distributions to produce realistic novel artifacts.",
          "Distinct differences exist between content classifiers (discriminative) and text generators (generative).",
          "Transformers unlocked incredible scaling laws by replacing recurrence with fully parallel attention calculation."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Welcome to Generative AI Foundations. Today we study class models and content synthesis." },
            { time: "3:10", text: "Generative networks guess target elements using high-dimensional probability maps." },
            { time: "7:45", text: "We will proceed to explore transformers and pre-training objectives next." }
          ],
          Tamil: [
            { time: "0:00", text: "வணக்கம்! ஜெனரேடிவ் ஏஐ (Generative AI) பற்றிய அடிப்படைகளை இன்று கற்றுக்கொள்ள போகிறோம்." },
            { time: "3:05", text: "புதிய கருத்துக்கள், படங்கள், மற்றும் கட்டுரைகளை உருவாக்க ஜெனரேடிவ் மாடல்கள் பயன்படுகின்றன." },
            { time: "7:20", text: "உயர்தரப் பயிற்சிகள் மூலம் கணினித் தரவை உருவாக்குவதை நாம் இப்போது காணலாம்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्कार! जेनेरेटिव एआई (Generative AI) की इस पहली क्लास में आपका स्वागत है।" },
            { time: "3:15", text: "जेनेरेटिव मॉडल्स पुरानी जानकारी को याद रखकर कुछ नया बनाने की क्षमता प्रदान करते हैं।" },
            { time: "7:30", text: "आइए इसकी मशीन लर्निंग और डीप लर्निंग आर्किटेक्चर को विस्तार से समझें।" }
          ],
          Telugu: [
            { time: "0:00", text: "నమస్కారం! ఈ క్లాస్ లో మనం జెనరేటివ్ పద్ధతులు మరియు AI టెక్నాలజీ గురించి చర్చిద్దాం." },
            { time: "3:20", text: "మెషీన్ లెర్నింగ్ లో ఈ కొత్త జనరేషన్ ఎలా పనిచేస్తుందో ఇప్పుడు ఉదాహరణలతో చూద్దాం." },
            { time: "7:15", text: "పటాలు మరియు కోడింగ్ ని సులభంగా క్రియేట్ చేయడానికి ఇవి ఇండస్ట్రీలో దూసుకుపోతున్నాయి." }
          ],
          Spanish: [
            { time: "0:00", text: "Bienvenidos al curso de Inteligencia Artificial Generativa y sus aplicaciones prácticas." },
            { time: "3:12", text: "Aprenderemos cómo la distribución estadística de datos ayuda a recrear patrones reales." },
            { time: "7:40", text: "Comencemos analizando la diferencia entre redes predictivas y redes generativas." }
          ]
        }
      },
      {
        id: 2,
        title: "How Large Language Models Work",
        type: "VIDEO",
        time: "25 min",
        iconName: "video",
        embeds: {
          English: "https://www.youtube.com/embed/zjkBMFhNj_g",
          Tamil: "https://www.youtube.com/embed/S2pA1ZzW0Y0",
          Hindi: "https://www.youtube.com/embed/6m6YlI9z-V0",
          Telugu: "https://www.youtube.com/embed/Pj1b1Y9mOn8",
          Spanish: "https://www.youtube.com/embed/I061H-NenQY"
        },
        chapterNotes: `## Chapter 2: Large Language Model Mechanics

Large Language Models (LLMs) are deep-learning neural network architectures trained on petabytes of text data. High-quality vector embeddings convert textual tokens into dense, continuous multi-dimensional mathematical vectors, capturing semantic meaning and context.

### The Autoregressive Model Objective:
At its core, an autoregressive LLM calculates the probability of the next token $x_n$ based on preceding tokens:
$$P(x_n \mid x_1, x_2, \dots, x_{n-1})$$

### Core Concepts:
- **Tokenization**: Breaking raw characters into sub-word tokens.
- **Context Window**: The maximum sequence length the model is capable of processing in a single run.
- **Decoding Temperature**: Dictates the random variability of model selections: lower temperature yields deterministic outputs, higher values yield creative outputs.`,
        keyPoints: [
          "Autoregressive models predict the single next most likely token mathematically.",
          "Tokenizers convert natural language words/subwords into high-dimensional matrix indexes.",
          "Decoding parameters (temperature, Top-P, Top-K) tune model output creativity vs. strictness."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "In this lesson, we study Large Language Models (LLMs) and context tokens." },
            { time: "2:10", text: "We represent tokens as dense vector spaces in high-dimensional coordinate rooms." },
            { time: "4:50", text: "Temperature adjustments modify the selection probabilities during decoding turns." }
          ],
          Tamil: [
            { time: "0:00", text: "வணக்கம்! இன்று நாம் Large Language Models (LLMs) எவ்வாறு செயல்படுகின்றன என்று பார்க்கப்போகிறோம்." },
            { time: "2:20", text: "வேர்ட் எம்பெடிங்ஸ் மற்றும் டோக்கன் முறையில் சொற்கள் எண்களாக மாற்றப்படுகின்றன." },
            { time: "5:15", text: "டெம்பரேச்சர் அதிகரித்தால் பதில்களில் வேற்றுமைகள் மற்றும் கிரியேட்டிவிட்டி கூடும்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्कार! इस वीडियो में हम देखेंगे कि Large Language Models (LLMs) कैसे काम करते हैं।" },
            { time: "2:05", text: "टोकनाइजेशन शब्दों को छोटे-छोटे संख्यात्मक भागों में विभाजित करने की महत्वपूर्ण प्रक्रिया है।" },
            { time: "4:40", text: "तापमान (Temperature) सेटिंग से उत्पन्न होने वाले उत्तरों की रचनात्मकता को नियंत्रित किया जा सकता है।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో! ఈ రోజు క్లాస్ లో మనం లార్జ్ లాంగ్వేజ్ మోడల్స్ (LLMs) పనిచేసే విధానం నేర్చుకుందాం." },
            { time: "2:15", text: "టోకనైజేషన్ అనేది టెక్స్ట్ ని చిన్న ముక్కలుగా మార్చే ఒక పద్ధతి." },
            { time: "5:00", text: "టెంపరేచర్ పెంచితే మోడల్ కొత్త ఊహలతో కూడిన జవాబులు ఇస్తుంది." }
          ],
          Spanish: [
            { time: "0:00", text: "¡Bienvenidos! Hoy aprenderemos cómo funcionan los Grandes Modelos de Lenguaje (LLMs)." },
            { time: "2:00", text: "La tokenización convierte palabras humanas en vectores numéricos de alta densidad." },
            { time: "4:35", text: "La temperatura modula la variedad probabilística del texto de salida generado." }
          ]
        }
      },
      {
        id: 3,
        title: "Transformer Architecture & Self-Attention",
        type: "VIDEO",
        time: "32 min",
        iconName: "video",
        embeds: {
          English: "https://www.youtube.com/embed/5vcj8c_uKB4",
          Tamil: "https://www.youtube.com/embed/S492C0Y6b8U",
          Hindi: "https://www.youtube.com/embed/XmXzCgGzI84",
          Telugu: "https://www.youtube.com/embed/TeunJ-E0zU4",
          Spanish: "https://www.youtube.com/embed/V7bL9p6x85s"
        },
        chapterNotes: `## Chapter 3: Under the Hood of Transformers

The Transformer architecture, presented in the foundational paper *"Attention Is All You Need"* (2017), replaced traditional RNNs and LSTMs.

### The Mathematics of Self-Attention:
Self-Attention processes information in parallel by computing three matrices: **Queries (Q)**, **Keys (K)**, and **Values (V)**.
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

### Architectural Pillars:
- **Scalability**: Parallel processing allows training on enormous datasets across thousands of GPUs.
- **Positional Encoding**: Since Transformers process all words at once, we inject specialized sinusoidal functions of sequence positions to preserve word order.
- **Multi-Head Attention**: Lets the network attend to information from different representation subspaces simultaneously.`,
        keyPoints: [
          "Transformers fully replaced recurrent architectures by computing sequential inputs in parallel.",
          "Self-attention uses Query, Key, and Value vectors to weigh relative semantic relations.",
          "Scale factor sqrt(d_k) prevents large values in dot-products from saturating the softmax function."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "This chapter covers the mathematical structure of the Multi-Head Self-Attention." },
            { time: "3:40", text: "Query, Key, and Value mechanisms mirror relational SQL lookup queries." },
            { time: "8:22", text: "Positional encoding adds a constant wave vector representing index places." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் டிரான்ஸ்பார்மர் ஆர்க்கிடெக்சர் மற்றும் செல்ஃப்-அட்டென்ஷன் பற்றி கற்றுக்கொள்கிறோம்." },
            { time: "3:50", text: "Query, Key மற்றும் Value என்ற மூன்று மேட்ரிஸ்கள் மூலம் சொற்களுக்கிடையேயான தொடர்பு கணக்கிடப்படுகிறது." },
            { time: "8:10", text: "சொற்களின் வரிசையை நினைவில் வைக்க பொசிஷனல் என்கோடிங் பயன்படுகிறது." }
          ],
          Hindi: [
            { time: "0:00", text: "इस पाठ में हम प्रसिद्ध Transformer Architecture और Attention की गणितीय रचना को समझेंगे।" },
            { time: "3:45", text: "Query (Q), Key (K) और Value (V) के बीच डॉट प्रोडक्ट निकाल कर भारित सम्बन्ध निर्धारित किये जाते हैं।" },
            { time: "8:00", text: "पोसिशनल एन्कोडिंग शब्दों के अनुक्रम यानी उनके नम्बर को बनाए रखने के लिए प्रयोग होती है।" }
          ],
          Telugu: [
            { time: "0:00", text: "ఈ రోజు లెక్చర్ లో మనం ట్రాన్స్‌ఫార్మర్ ఆర్కిటెక్చర్ లోని గణిత సిద్ధాంతాల గురించి తెలుసుకుందాం." },
            { time: "3:30", text: "సెల్ఫ్-అటెన్షన్ అనేది వివిధ పదాల సంబంధాలను కనుగొనడానికి సహాయపడుతుంది." },
            { time: "8:15", text: "పదాల క్రమాన్ని గుర్తుంచడానికి పొజిషనల్ ఎన్‌కోడింగ్స్ యాడ్ చేస్తారు." }
          ],
          Spanish: [
            { time: "0:00", text: "Bienvenidos a la arquitectura clásica de Transformer creada en el reporte original de Google." },
            { time: "3:15", text: "Las matrices Q, K y V calculan cuantitativamente el peso relativo de cada palabra." },
            { time: "8:05", text: "La codificación posicional inyecta ondas sinusoidales para saber el orden de la estructura." }
          ]
        }
      },
      {
        id: 4,
        title: "Prompt Engineering Fundamentals",
        type: "VIDEO",
        time: "30 min",
        iconName: "code",
        embeds: {
          English: "https://www.youtube.com/embed/3EjtHs_l_Xw",
          Tamil: "https://www.youtube.com/embed/r7OkaN_tX6c",
          Hindi: "https://www.youtube.com/embed/gZ0_JOnSRE0",
          Telugu: "https://www.youtube.com/embed/fN6pE-u6tRE",
          Spanish: "https://www.youtube.com/embed/yYms_L3bVp0"
        },
        chapterNotes: `## Chapter 4: Dynamic Query Design & Prompt Engineering

Prompt engineering is the systematic art of designing structured queries that guide generative LLMs to yield highly accurate metrics, reasoning paths, and programmatically formatted outputs.

### Crucial Engineering Techniques:
1. **Few-Shot Prompting**: Providing concrete output examples directly within the query body to demonstrate expected syntax.
2. **Chain-of-Thought (CoT)**: Explicitly instructing the model to output its intermediate markdown reasoning stages before emitting the final result.
3. **Persona Context Constraints**: Laying down behavioral limits (e.g., *"Act as a strict compliance officer"*).
4. **Structured Format Guarding**: Demanding structural syntaxes (e.g., nesting outputs in precise, parsing JSON schemas).

### Anti-Hallucination Measures:
- Mandate citing external database values or factual groundings.
- Explicitly authorize emitting *"I don't know key data"* states when queried about values outside the provided context limits.`,
        keyPoints: [
          "Structured prompts convert ad-hoc chats into repeatable programmatic results.",
          "Few-shot context injections dramatically outperform zero-shot triggers on syntax-sensitive work.",
          "Reasoning instructions (Chain-of-Thought) prevent decoder shortcuts and logical failures."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Today we understand prompts, structured JSON schema outputs, and instruction context limits." },
            { time: "4:20", text: "Providing few-shot context examples allows the model to map outputs to targeted variables cleanly." },
            { time: "9:15", text: "Wait, using Chain-of-Thought encourages sequential step-by-step reasoning outputs." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் பிராம்ட் இன்ஜினியரிங் (Prompt Engineering) முறைகளை விரிவாக ஆராயப் போகிறோம்." },
            { time: "4:30", text: "Few-shot மற்றும் Chain-of-thought முறைகள் மூலம் கணினியின் அறிவை மேலும் சீராக்க முடியும்." },
            { time: "9:00", text: "ப்ராம்ப்ட் நுட்பங்களை எவ்வாறு எளிதாகப் பயன்படுத்துவது என்று இப்போது பார்ப்போம்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्ते! आज की वेब डिज़ाइन और इंजीनियरिंग क्लास में हम प्रॉम्प्ट इंजीनियरिंग तकनीक सीखेंगे।" },
            { time: "4:15", text: "Few-shot प्रॉम्प्टिंग का अर्थ है मॉडल को कुछ ठोस उदाहरण देना ताकि वह मनचाहा आउटपुट दे।" },
            { time: "9:10", text: "कदम-दर-कदम सोचने के निर्देश देने से मॉडल भ्रामक जवाब नहीं देता।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో ఫ్రెండ్స్! ఈ రోజు మనం ప్రాంప్ట్ ఇంజనీరింగ్ యొక్క బేసిక్ కాన్సెప్ట్స్ నేర్చుకుందాం." },
            { time: "4:25", text: "కొన్ని ఉదాహరణలను ఇవ్వడం ద్వారా AI మోడల్స్ మెరుగైన ఫలితాలను ఇస్తాయి." },
            { time: "9:05", text: "దశలవారీగా ఆలోచించమని కోరితే జవాబులు చాలా స్పష్టంగా వస్తాయి." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola. Hoy entraremos en el mundo de la ingeniería de instrucciones y diseño de prompts." },
            { time: "4:00", text: "Al proveer ejemplos pocos disparos (few-shot), la IA aprende el formato esperado perfectamente." },
            { time: "9:05", text: "El razonamiento paso a paso evita las alucinaciones estructurales de los modelos." }
          ]
        }
      }
    ]
  },
  {
    id: "systems-201",
    title: "System Design & Distributed Architectures",
    description: "Learn load balancers, database sharding, microservices, caches, and high-availability setups.",
    instructor: "Dr. Maria Patel",
    category: "System Design",
    difficulty: "Hard",
    iconName: "layout",
    themeColor: "from-blue-500 to-indigo-600",
    lessons: [
      {
        id: 1,
        title: "Scaling Web Applications: Scale Up vs. Out",
        type: "VIDEO",
        time: "20 min",
        iconName: "book",
        embeds: {
          English: "https://www.youtube.com/embed/L7LtVbV5j8U",
          Tamil: "https://www.youtube.com/embed/Y1VtoYF-5Zg",
          Hindi: "https://www.youtube.com/embed/_eIuYF8r_Fw",
          Telugu: "https://www.youtube.com/embed/Hsh2Fz9b0lE",
          Spanish: "https://www.youtube.com/embed/f4bLqH7y9T0"
        },
        chapterNotes: `## Chapter 1: Scale Up vs. Scale Out
        
Distributed system design requires planning for failure from inception. When incoming application user traffic volume grows, developers face two paths to allocate resources.

### Architectural Comparison:
* **Vertical Scaling (Scale Up)**: Upgrading the CPU, computational cores, RAM bandwidth, or NVMe disk arrays on a single server machine.
* **Horizontal Scaling (Scale Out)**: Interconnecting multiple commodity servers across an load balanced pool cluster network.

### Scaling Mechanics:
| Metric | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
|---|---|---|
| **Max Capacity Limit** | Strict hardware physical bounds | Infinite capacity additions possible |
| **Failover Strategy** | Single point of failure (SPOF) risks | Distributed redundant replicas |
| **Complexity Level** | Low (no code upgrades needed) | High (requires distributed routers, cache synchronizations) |
| **Network Cost** | Moderate | High internal network overhead |

### Best Engineering Practices:
Keep application servers strictly stateless. Delegate all persistence requirements to dedicated, clustered databases and caching clusters to allow servers to scale horizontally without complex state syncing.`,
        keyPoints: [
          "Vertical scaling is limited by hardware ceilings and introduces highly dangerous single-point-of-failure risks.",
          "Horizontal scaling requires load balancing layers but offers virtually limitless infrastructure extensibility.",
          "Designing stateless web controllers makes automated container scaling significantly easier."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Welcome. This class is about system scaling. We contrast vertical and horizontal scaling." },
            { time: "3:40", text: "Upgrading individual CPU boards results in rapid physics ceilings and high costs." },
            { time: "7:50", text: "Deploying parallel nodes lets us scale horizontally as user traffic expands." }
          ],
          Tamil: [
            { time: "0:00", text: "அனைவருக்கும் வணக்கம்! சிஸ்டம் டிசைனில் வெர்டிகல் மற்றும் ஹாரிஸாண்டல் ஸ்கேலிங் பற்றி அறியலாம்." },
            { time: "3:30", text: "ஒரு கணினியிலேயே மெமரி மற்றும் CPU கூட்டுவதே வெர்டிகல் ஸ்கேலிங் எனப்படும்." },
            { time: "7:25", text: "பல கணினிகளை இணையாகப் பயன்படுத்துவது ஹாரிஸாண்டல் ஸ்கேலிங் ஆகும்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्कार! आज हम बात करेंगे वेब सिस्टम को डिज़ाइन करने और उसे स्केल करने के बारे में।" },
            { time: "3:45", text: "वर्टिकल स्केलिंग का मतलब है एक सर्वर की ताकत बढ़ाना, जिसकी एक भौतिक सीमा होती है।" },
            { time: "7:35", text: "हॉरिजॉन्टल स्केलिंग में हम एक से अधिक सीपीयू और सर्वर को समानांतर जोड़ते हैं।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో ఫ్రెండ్స్! ఈ క్లాస్ లో మనం వెబ్ సిస్టమ్స్ ని ఎలా స్కేల్ చేయాలో చూద్దాం." },
            { time: "3:35", text: "ఒకే సర్వర్ యొక్క సామర్థ్యాన్ని పెంచడాన్ని వర్టికల్ స్కేలింగ్ అని పిలుస్తారు." },
            { time: "7:40", text: "నెట్ వర్క్ లో కొత్త నోడ్స్ ని యాడ్ చేసి కనెక్ట్ చేయటాన్ని హారిజాంటల్ స్కేలింగ్ అంటాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Bienvenidos. Hoy analizaremos cómo escalar servidores para soportar millones de usuarios." },
            { time: "3:30", text: "El escalado vertical tiene límites de hardware y aumenta los puntos únicos de falla." },
            { time: "7:30", text: "El escalado horizontal agrega múltiples nodos de forma distribuida e infinita." }
          ]
        }
      },
      {
        id: 2,
        title: "Load Balancers and Horizontal Scaling",
        type: "VIDEO",
        time: "30 min",
        iconName: "video",
        embeds: {
          English: "https://www.youtube.com/embed/m8I0fJ_Ym94",
          Tamil: "https://www.youtube.com/embed/m6gNveU1XN0",
          Hindi: "https://www.youtube.com/embed/A8S9D_fE26g",
          Telugu: "https://www.youtube.com/embed/sLhU7M2b7l8",
          Spanish: "https://www.youtube.com/embed/_GOnLg90V-4"
        },
        chapterNotes: `## Chapter 2: High Availability Load Balancers

A Load Balancer acts as a reverse proxy, distributing standard network requests across a pool of microservice backend nodes.

### Standard Distribution Algorithms:
- **Round Robin**: Routes requests sequentially. Does not account for host load metrics.
- **Least Connections**: Dispatches traffic to the node running the fewest active sessions. Perfect for long-lived operations.
- **IP-Hashing**: Map IP hash values to specific backend instances. Preserves local state or session caching.

### Network Levels:
- **Layer 4**: Routing based on transport protocol parameters (IP and TCP Port headers). Extremely low latency.
- **Layer 7**: Content-aware routing based on HTTP paths, Cookie headers, and payload data. Extremely flexible.`,
        keyPoints: [
          "Reverse proxy load balancers protect microservices clusters and manage incoming request loads.",
          "Layer 4 load balancers routing decisions are fast, operating strictly on TCP/IP packet information.",
          "Layer 7 load balancers parse full HTTP requests to route based on path names and cookie headers."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Today we understand reverse proxies, high-performance gateways, and load balancers." },
            { time: "4:00", text: "We compare Layer 4 network packet load routing against Layer 7 application path parsing." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் லோட் பேலன்சர் மற்றும் நெட்வொர்க் டிராஃபிக் பற்றி விரிவாகப் பார்க்கப் போகிறோம்." },
            { time: "4:15", text: "லேயர் 4 மற்றும் லேயர் 7 ரவுட்டிங் முறைகளுக்கு இடையே உள்ள வேறுபாடுகளை அறிந்து கொள்ளுங்கள்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्कार दोस्तों! आज हम लोड बैलेंसर (Load Balancers) और उनके विभिन्न रोटेशन एल्गोरिदम को समझेंगे।" },
            { time: "4:05", text: "लेयर 4 टीसीपी हेडर पर काम करता है, जबकि लेयर 7 पूरे HTTP अनुरोध को पढ़कर निर्णय लेता है।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో ఫ్రెండ్స్! ఈ రోజు సిస్టమ్ డిజైన్ పాఠంలో లోడ్ బ్యాలెన్సర్స్ ఎలా రన్ అవుతాయో తెలుసుకుందాం." },
            { time: "3:50", text: "లాయర్ 4 మరియు లాయర్ 7 నెట్‌వర్క్ డిస్ట్రిబ్యూషన్ల మధ్య గల తేడాలను అర్థం చేసుకుందాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola. Hoy aprenderemos sobre los balanceadores de carga y cómo distribuyen el tráfico web." },
            { time: "4:12", text: "La capa 4 maneja paquetes TCP directos de baja latencia; la capa 7 analiza las cabeceras HTTP." }
          ]
        }
      },
      {
        id: 3,
        title: "Database Sharding & Replication",
        type: "VIDEO",
        time: "35 min",
        iconName: "code",
        embeds: {
          English: "https://www.youtube.com/embed/5faMjKuBliA",
          Tamil: "https://www.youtube.com/embed/p10yW0mMyw8",
          Hindi: "https://www.youtube.com/embed/S_a6vVz-S3Q",
          Telugu: "https://www.youtube.com/embed/Xq-5U7f8l7c",
          Spanish: "https://www.youtube.com/embed/YfZ6fVj-98w"
        },
        chapterNotes: `## Chapter 3: Database Sharding & Active Replication

As read/write loads on a centralized database begin to peak, developers must look at database partitioning strategies to avoid bottlenecks.

### Core Strategies:
1. **Vertical Partitioning**: Splitting a wide table's columns among distinct files or disk setups (e.g., placing historical text payloads separately).
2. **Horizontal Partitioning (Sharding)**: Splitting table rows across independent cluster hosts. Each server acts as a unique 'shard'.
3. **Primary-Replica Replication**: Emitting massive writes to a primary database node while distributing high-volume reads among read-only replicas.

### Sharding Key Selection Rules:
Pick keys with high cardinality (e.g., \`user_id\` over \`status\`). High-cardinality keys distribute data evenly, preventing 'hotspots' that overwhelm individual database nodes.`,
        keyPoints: [
          "Database Sharding partitions data horizontally across independent database servers.",
          "Read replicas offload heavy primary databases, but introduce eventual consistency latency.",
          "Choosing high-cardinality shard keys prevents unbalanced data hotspots in clusters."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Welcome to Database Scale-Out! Today we analyze Master-Slave syncing and Sharding Keys." },
            { time: "4:10", text: "A poor sharding key can route all traffic to a single backend node, causing a crash." },
            { time: "8:50", text: "Let's review row hashing formulas to distribute records evenly." }
          ],
          Tamil: [
            { time: "0:00", text: "வரவேற்கிறோம்! தரவுத்தள அளவிடுதல் (Database Sharding & Replication) பற்றி இன்று கற்கப்போகிறோம்." },
            { time: "4:20", text: "தரவுத்தளங்களை பிரித்து பல சேவையகங்களில் சேமிப்பதன் மூலம் சுமையைக் குறைக்கலாம்." },
            { time: "8:40", text: "வாசிப்பு எண்ணிக்கையை அதிகப்படுத்த வாசிப்பு பிரதிகளை எவ்வாறு பயன்படுத்துவது என்று பார்ப்போம்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्कार! आज की एडवांस डेटाबेस क्लास में हम शार्डिंग और रिप्लिकेशन को विस्तार से पढ़ेंगे।" },
            { time: "4:25", text: "शार्डिंग डेटाबेस को हॉरिजॉन्टली विभाजित करता है ताकि लोडिंग टाइम को कम किया जा सके।" },
            { time: "8:35", text: "रीड रिपब्लिकस की मदद से हम डेटाबेस से अधिक तेजी से जानकारी पढ़ सकते हैं।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో ఫ్రెండ్స్! డేటాబేస్ స్కేలింగ్ మరియు రెప్లికేషన్ ప్రాసెస్ లెక్చర్ కి స్వాగతం." },
            { time: "4:15", text: "శార్డింగ్ అంటే డేటాని క్రమబద్ధంగా వేర్వేరు సర్వర్ల లోకి విభజించడమే." },
            { time: "8:30", text: "డేటా నష్టం జరగకుండా ఒక ప్రైమరీ ఇంకా మల్టిపుల్ రీడ్ కాపీలను ఎలా మెయింటైన్ చేయాలో చూద్దాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola. Hoy profundizaremos en el diseño físico y escalamiento de bases de datos masivas." },
            { time: "4:05", text: "El sharding divide las tablas horizontalmente distribuyendo las filas entre servidores." },
            { time: "8:42", text: "La réplica de lectura nos permite optimizar consultas recurrentes sin saturar la primaria." }
          ]
        }
      },
      {
        id: 4,
        title: "Distributed Caching & CDN Routing",
        type: "VIDEO",
        time: "28 min",
        iconName: "sparkles",
        embeds: {
          English: "https://www.youtube.com/embed/H8_X0lZtX6A",
          Tamil: "https://www.youtube.com/embed/f63bN_uTzIs",
          Hindi: "https://www.youtube.com/embed/S4VfX69xS_Y",
          Telugu: "https://www.youtube.com/embed/t83f-Xf0J5Y",
          Spanish: "https://www.youtube.com/embed/G3pY-m8p9_I"
        },
        chapterNotes: `## Chapter 4: Caching Models & Content Delivery Networks (CDNs)

Caching avoids duplicating slow calculations and database queries, drastically speeding up application response times.

### Caching Levels:
1. **Edge Cache (CDNs)**: Delivering static files (HTML, JS, images, media files) from physical caches located closest to the end user.
2. **Application Memory Cache (Redis / Memcached)**: Fast, non-relational, memory-resident key-value structures used to store database queries.
3. **Browser Storage (localStorage, Cache Storage)**: Storing non-sensitive data directly on user devices.

### Classic Cache Invalidation Cache Strategies:
* **Write-Through**: Save updates to both cache and back-end database simultaneously.
* **Cache-Aside**: Read from cache. On cache-miss, pull from master database, update the cache, and return results.
* **Write-Behind (Write-Back)**: Write directly to cache. Run asynchronous background jobs to periodically persist cache changes to database.`,
        keyPoints: [
          "CDNs cache static assets closer to the user, drastically reducing network round-trip times.",
          "In-memory storage (Redis) offloads repetitive query compilation from the primary database cluster.",
          "Proactively invalidating caches prevents stale data from causing application bugs."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Today we review high speed Redis caching and CDN geographic latency reductions." },
            { time: "4:00", text: "Dynamic database requests take hundreds of milliseconds; memory stores take less than one." },
            { time: "8:25", text: "Wait, cache eviction policies like LRU or LFU ensure memory limits are respected." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் ரெடிஸ் கேச்சிங் (Redis Caching) மற்றும் சிடிஎன் (CDN) பற்றி விரிவாகக் கற்கப் போகிறோம்." },
            { time: "4:05", text: "மெமரி கேச் பயன்படுத்துவதால் இணையதள வேகம் பன்மடங்கு அதிகரிக்கும்." },
            { time: "8:15", text: "பழைய தரவுகளை தானாகவே அழிக்கும் எவிக்ஷன் கொள்கைகளை இப்போது காண்போம்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्ते दोस्तों! आज हम कैशिंग रणनीतियों (Redis/Memcached) और CDN नेटवर्क्स को समझेंगे।" },
            { time: "4:15", text: "CDN हमारे यूज़र्स के भौगोलिक रूप से सबसे नज़दीकी सर्वर से डेटा डिलीवर करता है।" },
            { time: "8:10", text: "कैश-असाइड रणनीति में हम डेटा मिस होने पर ही मुख्य डेटाबेस से संपर्क करते हैं।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో ఫ్రెండ్స్! ఈ రోజు లెక్చర్ లో మనం వెబ్ పర్ఫార్మెన్స్ అండ్ క్యాషింగ్ సిస్టమ్స్ గురించి నేర్చుకుందాం." },
            { time: "4:10", text: "CDN ద్వారా ప్రపంచవ్యాప్తంగా వివిధ ప్రాంతాలలో ఫైళ్ళను త్వరగా లోడ్ చేయవచ్చు." },
            { time: "8:20", text: "ఎప్పటికప్పుడు క్యాష్ ని క్లియర్ చేయటం ద్వారా ఎర్రర్స్ రాకుండా ఎలా చూసుకోవాలో చూద్దాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola. Hoy aprenderemos sobre la optimización extrema mediante Redis y redes de entrega CDN." },
            { time: "4:00", text: "Guardar consultas recurrentes en memoria de acceso rápido reduce la carga en más de un noventa por ciento." },
            { time: "8:10", text: "Las políticas de revocación como LRU liberan espacio automáticamente sin comprometer la base de datos." }
          ]
        }
      }
    ]
  },
  {
    id: "dsa-301",
    title: "Advanced Data Structures & Algorithms",
    description: "Conquer complex algorithms: Dynamic Programming, Graph Traversals, and Custom Caching systems.",
    instructor: "Dr. Alan Turing",
    category: "Software Engineering",
    difficulty: "Hard",
    iconName: "terminal",
    themeColor: "from-emerald-400 to-teal-500",
    lessons: [
      {
        id: 1,
        title: "Dynamic Programming and Memoization",
        type: "VIDEO",
        time: "35 min",
        iconName: "video",
        embeds: {
          English: "https://www.youtube.com/embed/oBt53YbR9K8",
          Tamil: "https://www.youtube.com/embed/m9Yy68S1pYw",
          Hindi: "https://www.youtube.com/embed/5_5oE5c47b4",
          Telugu: "https://www.youtube.com/embed/5T2VfA-V1IE",
          Spanish: "https://www.youtube.com/embed/e8bXf2rX9rE"
        },
        chapterNotes: `## Chapter 1: Dynamic Programming Principles

Dynamic Programming (DP) accelerates recursive algorithms by storing and reusing intermediate answers to overlapping sub-problems.

### Core Pillars of DP:
1. **Overlapping Sub-problems**: Re-computing the exact same sub-structures repeatedly.
2. **Optimal Sub-structure**: The overall optimal solution is composed of the mathematical optimal solution of its sub-parts.

### Methods:
- **Top-Down (Memoization)**: Keep a standard lookup map/cache of recursive tree leaf outputs, stopping redundant recursive descents.
- **Bottom-Up (Tabulation)**: Build a flat multidimensional array, filling indices iteratively from basic states up.`,
        keyPoints: [
          "Memoization stores previous recursive outputs dynamically to reduce complexity from exponential to linear.",
          "Optimal sub-structure means larger problems are solved cleanly by combining lower state results.",
          "Tabulation avoids stack-overflow risks by substituting recursion with simple array tables."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Welcome to Algorithm Analysis. We start with recursive computations for Fibonacci sequences." },
            { time: "5:10", text: "Overlapping calculations exponentially balloon memory. Memoization caches these steps." }
          ],
          Tamil: [
            { time: "0:00", text: "வணக்கம்! இன்று டைனமிக் புரோகிராமிங் மற்றும் மெமோயிசேஷன் எவ்வாறு செயல்படுகிறது என்று பார்ப்போம்." },
            { time: "5:15", text: "ஒரே கணக்கீட்டை மீண்டும் செய்யாமல், மெமரியில் சேமித்துத் திரும்பப் பெறுவதே மெமோயிசேஷன்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्ते! आज की कोडिंग एल्गोरिदम क्लास में हम डायनेमिक प्रोग्रामिंग (DP) के मूल सिद्धांतों को सीखेंगे।" },
            { time: "5:00", text: "मेमोइजेशन का अर्थ है पुरानी गणनाओं को कैश टेबल में संग्रह करना ताकि समय को बचाया जा सके।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో! అల్గోరిథమ్స్ క్లాస్ కి స్వాగతం. ఈ రోజు మనం డైనమిక్ ప్రోగ్రామింగ్ గురించి నేర్చుకుందాం." },
            { time: "5:20", text: "మెమోయిజేషన్ ద్వారా పాత రిజల్ట్స్ ని స్టోర్ చేసుకొని సరికొثة సమస్యలను త్వరగా సాల్వ్ చేయవచ్చు." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola a todos. Hoy estudiaremos la estrategia de Programación Dinámica y Memoización de estados." },
            { time: "5:12", text: "Almacenar llamadas a funciones recurrentes ayuda a bajar la complejidad exponencial a una lineal." }
          ]
        }
      },
      {
        id: 2,
        title: "Graph Algorithms: Dijkstra & A* Pathfinding",
        type: "VIDEO",
        time: "32 min",
        iconName: "video",
        embeds: {
          English: "https://www.youtube.com/embed/EFg3tW_9I2U",
          Tamil: "https://www.youtube.com/embed/sUCO_u9733Y",
          Hindi: "https://www.youtube.com/embed/3A9i60ZkE38",
          Telugu: "https://www.youtube.com/embed/DscY2lHq_o8",
          Spanish: "https://www.youtube.com/embed/G9bI8nS2v8Q"
        },
        chapterNotes: `## Chapter 2: Graph Pathfinding Theory & Application

Graph algorithms are crucial for routing, logistics, social network analyzing, and GPS directional planning.

### Dijkstra's Shortest Path Algorithm:
Designed to solve the single-source shortest path problem on weighted directed graphs. It uses a **priority queue** to greedily visit nodes with the lowest total distance from the starting point.

### Dijkstra's Mathematical Logic:
1. Set the starting node's distance to 0, and all other nodes to infinity.
2. Extract the unvisited node with the smallest cumulative distance.
3. Update distances for all of its neighbors:
   $$\text{dist}[v] = \min(\text{dist}[v], \text{dist}[u] + w(u,v))$$
4. Repeat until all nodes have been visited.

### A* Pathfinding Algorithm:
Extends Dijkstra's algorithm by using heuristics (such as Euclidean or Manhattan distance) to estimate total distance remaining, focusing path searches directly toward the destination target.`,
        keyPoints: [
          "Dijkstra's algorithm uses a priority queue to solve weighted shortest path problems with high efficiency.",
          "Dijkstra's algorithmic complexity is O((V + E) log V), using adjacent list formats.",
          "A* pathfinding adds heuristic estimation vectors to bypass exploring redundant paths."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Hello! Today we examine Graph Traversals, Breadth First, and Dijkstra's routing algorithms." },
            { time: "4:40", text: "A Priority Queue acts as the backing structure to select the next shortest edge." },
            { time: "9:20", text: "A* uses heuristics to prevent Dijkstra from exploring unnecessary directions." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் வரைபட வழிமுறைகள் (Graph Algorithms) மற்றும் டைக்ஸ்ட்ராவின் வழிமுறை பற்றி பார்க்கப்போகிறோம்." },
            { time: "4:32", text: "குறைந்த தூர பாதையை கண்டறிய முன்னுரிமை வரிசை (Priority Queue) பயன்படுத்தப்படுகிறது." },
            { time: "9:10", text: "வடிவியல் கணிப்புகள் மூலமாக தேடுதல் வேகத்தை அதிகரிக்க ஏ ஸ்டார் ஏதுவாகிறது." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्ते! इस ग्राफ अल्गोरिथम क्लास में हम Dijkstra's और A* सर्च एल्गोरिदम को विस्तार से पढ़ेंगे।" },
            { time: "4:45", text: "शॉर्टेस्ट पाथ खोजने के लिए हम मिन-हीप या प्रायोरिटी क्यू का उपयोग करते हैं।" },
            { time: "9:15", text: "A* अनुमानी मूल्य (heuristic) का इस्तेमाल कर सही दिशा में खोज को तेज़ करता है।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో! ఈ రోజు మనం గ్రాఫ్స్ లోని సరికొత్త షార్టెస్ట్ పాత్ అల్గోరిథమ్స్ గురించి నేర్చుకుందాం." },
            { time: "4:30", text: "డైక్స్ట్రా అల్గోరిథమ్ ఒక నోడ్ నుండి మరొక నోడ్ కి తక్కువ దూరాన్ని ఎలా లెక్కిస్తుందో చూద్దాం." },
            { time: "9:05", text: "మ్యాప్స్ మరియు రూట్స్ కోసం A* అల్గోరిథమ్ వాడే విధానాన్ని నేర్చుకుందాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Bienvenidos. Hoy revisaremos los algoritmos de navegación y rutas más cortas en grafos." },
            { time: "4:35", text: "Dijkstra utiliza una cola de prioridad para buscar continuamente el camino con el coste mínimo." },
            { time: "9:12", text: "El algoritmo A* incorpora heurísticas para estimar la posición y agilizar el procesamiento." }
          ]
        }
      },
      {
        id: 3,
        title: "Advanced Trees: Segment & Fenwick Trees",
        type: "VIDEO",
        time: "38 min",
        iconName: "sparkles",
        embeds: {
          English: "https://www.youtube.com/embed/2b1U3p_l9eU",
          Tamil: "https://www.youtube.com/embed/XqE-379r9Is",
          Hindi: "https://www.youtube.com/embed/3vL9b7G9X8Y",
          Telugu: "https://www.youtube.com/embed/2S9X0V1pL_k",
          Spanish: "https://www.youtube.com/embed/1xS9Z2pI_vU"
        },
        chapterNotes: `## Chapter 3: Advanced Interval Range Computational Trees

When building high-compliance transactional applications, we often need to compute interval ranges and handle dynamic array value updates in real time.

### The Limitation of Simple Arrays:
- Calculating range sums inside a standard array takes $O(N)$ time.
- Updating individual values takes $O(1)$ time.
- When there are millions of edits and queries happening concurrently, this linear search bottleneck can cause systemic slowdowns.

### Segment Trees (Interval Trees):
A Segment Tree is a binary tree database representation storing range intervals. It offers a balanced trade-off:
- **Range Queries**: $O(\log N)$ time.
- **Point Updates**: $O(\log N)$ time.

### Fenwick Trees (Binary Indexed Trees):
Fenwick Trees offer similar logarithmic performance bounds but use much less memory, using quick low-level bit operations:
$$\text{LSB}(x) = x \ \& \ (-x)$$`,
        keyPoints: [
          "Segment Trees split arrays into contiguous intervals to speed up range queries.",
          "Fenwick Trees use low-level bitwise operations to calculate prefix sums with minimal memory overhead.",
          "Both structures reduce range processing times from linear to logarithmic."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Welcome. Today we solve interval segment calculations and logarithmic range arrays." },
            { time: "5:20", text: "Updating point values shifts up parent tree indexes quickly." },
            { time: "9:50", text: "Let's review the bitwise math behind Binary Indexed Trees." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் செக்மென்ட் மரங்கள் (Segment Trees) மற்றும் பென்விக் மரங்கள் பற்றிப் படிக்கப்போகிறோம்." },
            { time: "5:15", text: "ஒரு பெரிய வரிசையின் குறிப்பிட்ட இடைவெளியை நொடிகளில் கணக்கிட இவை உதவுகின்றன." },
            { time: "9:35", text: "பிட்வைஸ் கணக்கீடுகள் எவ்வாறு கணக்கீட்டு வேகத்தை அதிகரிக்கின்றன என்று பார்ப்போம்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्ते! आज हम द्विआधारी अनुक्रमित पेड़ों (Fenwick / Segment Trees) के बारे में विस्तार से चर्चा करेंगे।" },
            { time: "5:18", text: "इसकी मदद से हम किसी भी लम्बे रेंज की जोड़ या तुलना केवल लॉग टाइम में कर सकते हैं।" },
            { time: "9:40", text: "बिट वाइज़ लॉजिक (LSB) से हम डेटा को और भी कम मेमोरी में स्टोर कर सकते हैं।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో! అల్గోరిథమ్స్ లో అడ్వాన్స్డ్ ట్రీ స్ట్రక్చర్స్ లెక్చర్ కి స్వాగతం." },
            { time: "5:10", text: "సెగ్మెంట్ ట్రీస్ ద్వారా రేంజ్ క్వెరీస్ ని ఫాస్ట్ గా చేయడం ఎలాగో నేర్చుకుందాం." },
            { time: "9:30", text: "ఫెన్విక్ ట్రీస్ లోని బిట్ వైస్ ఆపరేషన్స్ మరియు వాటి ఉపయోగాలు చూద్దాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola a todos. Hoy analizaremos estructuras avanzadas de árboles segmentados." },
            { time: "5:05", text: "Las consultas de rango se pueden resolver con complejidad logarítmica sin procesar todo el arreglo." },
            { time: "9:30", text: "El árbol de Fenwick utiliza máscaras de bits para optimizar la memoria al extremo." }
          ]
        }
      }
    ]
  },
  {
    id: "devops-401",
    title: "Cloud DevOps & Kubernetes Engineering",
    description: "Dive into container orchestration, pipeline automation, state metrics, and micro-cluster maintenance.",
    instructor: "Dr. Maria Patel",
    category: "DevOps & Cloud",
    difficulty: "Hard",
    iconName: "cloud",
    themeColor: "from-indigo-500 to-purple-600",
    lessons: [
      {
        id: 1,
        title: "Kubernetes Orchestration & Core Concepts",
        type: "VIDEO",
        time: "40 min",
        iconName: "video",
        embeds: {
          English: "https://www.youtube.com/embed/X48VuDVv0do",
          Tamil: "https://www.youtube.com/embed/5F_CLa4E6Xw",
          Hindi: "https://www.youtube.com/embed/3A_9Wz7Z_D0",
          Telugu: "https://www.youtube.com/embed/bL76F9oD2Zg",
          Spanish: "https://www.youtube.com/embed/U3fWkiX_cAg"
        },
        chapterNotes: `## Chapter 1: Kubernetes Micro-Cluster Coordination

Kubernetes (K8s) is a production-grade, open-source orchestrator automating deployment, scaling, and management of containerized services.

### Fundamental Declarative Objects:
- **Pods**: The smallest execution unit, hosting one or more closely tied container instances.
- **Deployments**: Declares a target count of running Pod replica states, matching actual state with target descriptors.
- **Services**: Stable, permanent local routing endpoints translating IP allocations among transient ephemerally running Pods.
- **ConfigMaps & Secrets**: Externalized configurations separating environment variables and certificates from Docker code.`,
        keyPoints: [
          "Kubernetes manages containerized workloads declaratively via target state descriptions.",
          "Pods are ephemeral clusters sharing local networking and storage namespaces.",
          "Services route load traffic reliably among pods, hiding IP changes from clients."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Today we demystify Kubernetes clusters, Control Planes, and Declarative YAMLs." },
            { time: "6:20", text: "The Control Plane monitors and automatically starts replicas in case of worker node crashes." }
          ],
          Tamil: [
            { time: "0:00", text: "வணக்கம்! குபெர்னெட்டிஸ் (Kubernetes) என்றால் என்ன, அது எவ்வாறு கன்டெய்னர்களை நிர்வகிக்கிறது என்று பார்ப்போம்." },
            { time: "6:30", text: "கன்ட்ரோல் பிளேன் தானாகவே பழுதான கன்டெய்னர்களை மாற்றி புதியவற்றைத் தொடங்கும்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्कार! इस क्लाउड सीरीज में आज हम दुनिया के सबसे लोकप्रिये आर्केस्ट्रेटर Kubernetes के बारे में जानेंगे।" },
            { time: "6:15", text: "कंट्रोल प्लेन स्वचालित रूप से खराब पॉड्स को हटाकर नए पॉड्स का री-शेड्यूल सुनिश्चित करता है।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో! ప్రొడక్షన్ లెవెల్ క్లౌడ్ కోర్స్ లో ఈ రోజు మనం కుబెర్నెటిస్ ఆర్కిటెక్చర్ నేర్చుకుందాం." },
            { time: "6:40", text: "కంట్రోల్ ప్లేన్ ఎప్పటికప్పుడు చెక్ చేస్తూ కొత్త కంటైనర్లను ఆటోమేటిక్ గా రన్ చేస్తుంది." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola. Hoy daremos un recorrido profundo por las entrañas de Kubernetes y contenedores Docker." },
            { time: "6:08", text: "El nodo maestro supervisa continuamente y reemplaza pods terminados de forma automática." }
          ]
        }
      },
      {
        id: 2,
        title: "Designing CI/CD Deployment Pipelines",
        type: "VIDEO",
        time: "30 min",
        iconName: "code",
        embeds: {
          English: "https://www.youtube.com/embed/ScD_X48eW-s",
          Tamil: "https://www.youtube.com/embed/g3bW_2pLe9Y",
          Hindi: "https://www.youtube.com/embed/v9L_2S98oIo",
          Telugu: "https://www.youtube.com/embed/f8S2bW9I_eU",
          Spanish: "https://www.youtube.com/embed/0x7S_X6bVpQ"
        },
        chapterNotes: `## Chapter 2: Automated CI/CD Pipelines

A highly resilient Software Development Lifecycle (SDLC) depends on automated pipelines to continuously integrate and deploy code.

### Pipeline Stages:
1. **Linting & Code Verification**: Catching syntax errors, formatting inconsistencies, and anti-patterns.
2. **Unit & Integration Testing**: Validating code changes against existing test suites automatically.
3. **Containerization & Versioning**: Packaging compiled binaries into tagged Docker images, pushing them to remote registries.
4. **Automated Rollouts (CD)**: Deploying compiled builds to live production environments using progressive rollout techniques.

### Progressive Delivery Models:
* **Blue/Green Deployment**: Maintaining two active production environments (Blue and Green). Traffic is instantly routed to Green upon successful verification, with Blue held as a backup.
* **Canary Release**: Progressively rolling out code updates to a small subset of servers first (e.g., 5% of users), and expanding only after verifying stability metrics.`,
        keyPoints: [
          "CI/CD pipelines automate testing, building, and deployment processes to eliminate human error.",
          "Blue/Green deployments offer near-instant rollbacks if bugs are detected in the new build.",
          "Canary releases allow testing new updates on real users with minimal risk exposure."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Today we build automated pipelines, linting guards, and Blue-Green server rollouts." },
            { time: "5:10", text: "Canary releases let us stream five percent of incoming user transactions through the news builds first." },
            { time: "8:40", text: "If metrics degrade, we automatically roll back before the rest of the node pool updates." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் தேவ்ஆப்ஸ் (DevOps) தொடர் ஒருங்கிணைப்பு (CI/CD) மற்றும் தானியங்கி குழாய்கள் பற்றிப் பார்ப்போம்." },
            { time: "5:00", text: "கோடு மாற்றங்களை அதுவாகவே பரிசோதித்து தயாரிப்புக்குக் கொண்டு செல்ல இது கை கொடுக்கிறது." },
            { time: "8:45", text: "புதிய கோப்பில் ஏதேனும் பழுது இருந்தால் பழைய நிலைக்கு நொடியில் மாறலாம்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्ते! आज की क्लाउड इंजीनियरिंग में हम स्वचालित CI/CD पाइपलाइन्स का निर्माण करना सीखेंगे।" },
            { time: "5:12", text: "कैनरी डिप्लॉयमेंट का मतलब है नया कोड पहले केवल पाँच प्रतिशत यूज़र्स को दिखाना।" },
            { time: "8:50", text: "यदि कोई एरर मिलता है, तो हम स्वचालित रूप से पुराने संस्करण पर रोलबैक कर लेते हैं।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో ఫ్రెండ్స్! ప్రొడక్షన్ లెవల్ CI/CD పైప్ లైన్స్ బిల్డింగ్ లెక్చర్ కి స్వాగతం." },
            { time: "5:08", text: "కొత్త మార్పులను ఆటోమేటిక్ గా కంటైనర్స్ లోకి బిల్డ్ చేసి సర్వర్లలో ఎలా రన్ చేయాలో చూద్దాం." },
            { time: "8:35", text: "యూజర్స్ కి ఎటువంటి అంతరాయం కలగకుండా బ్లూ-గ్రీన్ డిప్లాయ్మెంట్ చేసే విధానాన్ని తెలుసుకుందాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola. Hoy automatizaremos el ciclo de vida del software con pipelines CI/CD." },
            { time: "5:02", text: "Las implementaciones de tipo Canary permiten dirigir un pequeño porcentaje de tráfico a la versión nueva." },
            { time: "8:38", text: "Si las métricas de monitoreo de errores suben, se deshace el despliegue al instante." }
          ]
        }
      },
      {
        id: 3,
        title: "Dockerizing Applications & Microservices Security",
        type: "VIDEO",
        time: "32 min",
        iconName: "sparkles",
        embeds: {
          English: "https://www.youtube.com/embed/gAkwW2tuSVE",
          Tamil: "https://www.youtube.com/embed/X8S2bW9I_Xk",
          Hindi: "https://www.youtube.com/embed/S_3xG8v9eIY",
          Telugu: "https://www.youtube.com/embed/2pS9L2kV_Y8",
          Spanish: "https://www.youtube.com/embed/D_9fX2bS1vU"
        },
        chapterNotes: `## Chapter 3: Dockerization & Container Security

Docker containers package source code, runtime libraries, and environment configurations into a single, standardized, isolated image that runs reliably across any machine.

### Multi-Stage Builds:
Multi-stage Docker builds separate compile-time build dependencies from run-time packages. This helps produce lightweight production images by leaving compiling tools ahead of deployment:

\`\`\`dockerfile
# Stage 1: Build & Compile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Minimal Runtime
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

### Container Security Rules:
- **Run as Non-Root**: Avoid running container processes with root privileges inside the container.
- **Scan for Vulnerabilities**: Check libraries for vulnerabilities (using tools like Trivy or Snyk) during the build process.
- **Minimize Baselines**: Choose smaller, audited base images (e.g., \`alpine\` or \`distroless\`) instead of full operating system baselines.`,
        keyPoints: [
          "Docker packages application code and configurations to ensure consistent deployments across environments.",
          "Multi-stage builds separate compile tools from runtime environments, creating lightweight production images.",
          "Docker security focuses on non-root execution, vulnerability scanning, and minimal base images."
        ],
        transcripts: {
          English: [
            { time: "0:00", text: "Today we master containerizing applications, lightweight alpine layers, and multi-stage Docker builds." },
            { time: "5:40", text: "By using multi-stage builds, compile tools are left behind, ensuring small production footprint sizes." },
            { time: "9:15", text: "Running container processes under non-root namespaces prevents host escalation hacks." }
          ],
          Tamil: [
            { time: "0:00", text: "இன்று நாம் டாக்கர் கன்டெய்னர்கள் (Dockerization) மற்றும் அதன் பாதுகாப்பு அம்சங்களை விரிவாகக் காண்போம்." },
            { time: "5:30", text: "மல்டி ஸ்டேஜ் பில்ட் முறையில் மிகச் சிறிய அளவிலான இறுதி தயாரிப்புப் படங்களை உருவாக்க முடியும்." },
            { time: "9:20", text: "ரூட் அல்லாத பயனர் கணக்குகளைப் பயன்படுத்துவது கூடுதல் பாதுகாப்பைத் தரும்." }
          ],
          Hindi: [
            { time: "0:00", text: "नमस्कार! आज की कोडिंग डिज़ाइन क्लास में हम डौकर (Dockerizing Applications) और सुरक्षा नियमों को समझेंगे।" },
            { time: "5:35", text: "मल्टी-स्टेज बिल्ड से हम फालतू कंपाइलर फ़ाइलों को हटाकर केवल ज़रूरी फ़ाइलें रनटाइम इमेज में डालते हैं।" },
            { time: "9:10", text: "सुरक्षा सुनिश्चित करने के लिए हमेशा नॉन-रूट (non-root) यूज़र सेटिंग का चुनाव करें।" }
          ],
          Telugu: [
            { time: "0:00", text: "హలో ఫ్రెండ్స్! డాకర్ డెవలప్మెంట్ రన్ కంటైనర్స్ కోర్స్ కి పునఃస్వాగతం." },
            { time: "5:45", text: "మల్టీ స్టేజ్ బిల్డ్స్ ద్వారా ప్రొడక్షన్ ఫైల్ సైజులని తగ్గించడం ఎలాగో చూద్దాం." },
            { time: "9:15", text: "కంటైనర్స్ కి రూట్ పర్మిషన్స్ లేకుండా సెక్యూర్ గా హోస్ట్ చేయడం నేర్చుకుందాం." }
          ],
          Spanish: [
            { time: "0:00", text: "Hola. Hoy aprenderemos a empaquetar aplicaciones ligeras y seguras usando contenedores Docker." },
            { time: "5:20", text: "Las build de múltiples fases separan las dependencias del compilador de las de ejecución final." },
            { time: "9:05", text: "No usar privilegios root garantiza que el contenedor esté protegido contra intrusiones." }
          ]
        }
      }
    ]
  }
];
