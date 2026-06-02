export interface MockArticle {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    username: string;
    avatar: string | null;
    followers: number;
  };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  likes: number;
  comments: number;
  featured: boolean;
  /** Model slugs referenced in the piece — powers @mentions and the rail */
  models?: string[];
  /** Freshness state shown near the title */
  freshness?: { status: "current" | "aging" | "outdated"; verified: string };
}

export const mockArticles: MockArticle[] = [
  {
    id: "opus-4-8",
    title: "Claude Opus 4.8: the model that finally caught its own mistakes",
    excerpt:
      "I spent the week after release actually using Opus 4.8 — not running benchmarks, just doing my everyday work. Here's what I honestly think about the honesty.",
    author: {
      name: "David Oratokhai",
      username: "davidoratokhai",
      avatar: null,
      followers: 4210,
    },
    publishedAt: "2026-05-31",
    readingTime: "7 min read",
    tags: ["Models & Research", "Benchmarks"],
    likes: 1284,
    comments: 96,
    featured: true,
    models: ["claude-opus-4-8", "gpt-5-5"],
    freshness: { status: "current", verified: "May 2026" },
  },
  {
    id: "1",
    title: "Building a production RAG system with Claude and pgvector",
    excerpt:
      "After six months running RAG in production across three different applications, here's everything I wish I knew before starting. The devil is in the chunking strategy.",
    author: {
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: null,
      followers: 2840,
    },
    publishedAt: "2026-05-28",
    readingTime: "12 min read",
    tags: ["RAG", "LLM Apps", "Infrastructure"],
    models: ["claude-sonnet-4-5"],
    likes: 347,
    comments: 42,
    featured: true,
  },
  {
    id: "2",
    title: "Claude 4 vs GPT-4o for code generation: a real benchmark",
    excerpt:
      "I ran 200 real-world coding tasks across both models. Not synthetic benchmarks — actual tasks from my codebase. The results surprised me.",
    author: {
      name: "Marcus Webb",
      username: "marcuswebb",
      avatar: null,
      followers: 5120,
    },
    publishedAt: "2026-05-27",
    readingTime: "18 min read",
    tags: ["Benchmarks", "Models & Research"],
    models: ["claude-sonnet-4", "gpt-4o"],
    likes: 891,
    comments: 134,
    featured: true,
  },
  {
    id: "3",
    title: "The prompt engineering technique nobody talks about: negative space",
    excerpt:
      "We spend so much time on what to include in prompts. I've been experimenting with what to explicitly exclude — and it changes everything.",
    author: {
      name: "Priya Nair",
      username: "priyanair",
      avatar: null,
      followers: 1230,
    },
    publishedAt: "2026-05-26",
    readingTime: "8 min read",
    tags: ["Prompt Engineering"],
    likes: 612,
    comments: 89,
    featured: false,
  },
  {
    id: "4",
    title: "How I built an AI co-founder that actually helps me ship faster",
    excerpt:
      "Not a demo. Not a toy. A real system I've been using daily for four months. Here's the full architecture and the honest results.",
    author: {
      name: "James Okafor",
      username: "jamesokafor",
      avatar: null,
      followers: 3670,
    },
    publishedAt: "2026-05-25",
    readingTime: "15 min read",
    tags: ["Agents & Automation", "LLM Apps"],
    models: ["claude-opus-4-5"],
    likes: 445,
    comments: 67,
    featured: false,
  },
  {
    id: "5",
    title: "Fine-tuning Llama 3 on domain data: what actually moves the needle",
    excerpt:
      "I've run 40+ fine-tuning experiments in the past three months. Most of the conventional wisdom is wrong. Here's what the data actually shows.",
    author: {
      name: "Alicia Torres",
      username: "aliciatorres",
      avatar: null,
      followers: 892,
    },
    publishedAt: "2026-05-24",
    readingTime: "22 min read",
    tags: ["Fine-tuning & Training", "Models & Research"],
    models: ["llama-3-3-70b"],
    likes: 278,
    comments: 31,
    featured: false,
  },
  {
    id: "6",
    title: "Why every AI product I've seen gets evals completely wrong",
    excerpt:
      "Evals are the most misunderstood part of building AI products. I've reviewed dozens of systems. The same mistakes appear every time.",
    author: {
      name: "David Park",
      username: "davidpark",
      avatar: null,
      followers: 4100,
    },
    publishedAt: "2026-05-23",
    readingTime: "10 min read",
    tags: ["LLM Apps", "Industry & Business"],
    models: ["gpt-5"],
    likes: 734,
    comments: 98,
    featured: false,
  },
];

export interface MockModel {
  id: string;
  name: string;
  company: string;
  slug: string;
  contextWindow: string;
  releaseDate: string;
  modalities: string[];
  articleCount: number;
  description: string;
}

export const mockModels: MockModel[] = [
  {
    id: "claude-opus-4-8",
    name: "Claude Opus 4.8",
    company: "Anthropic",
    slug: "claude-opus-4-8",
    contextWindow: "1M tokens",
    releaseDate: "2026-05",
    modalities: ["Text", "Vision"],
    articleCount: 1240,
    description:
      "Anthropic's flagship model, headlined by a 4x reduction in uncritically reporting flawed results and Dynamic Workflows with up to 1,000 parallel subagents.",
  },
  {
    id: "gpt-5-5",
    name: "GPT-5.5",
    company: "OpenAI",
    slug: "gpt-5-5",
    contextWindow: "400K tokens",
    releaseDate: "2026-04",
    modalities: ["Text", "Vision", "Audio"],
    articleCount: 1530,
    description:
      "OpenAI's flagship model, strong on command-driven agentic loops and a leader on Terminal-Bench 2.1.",
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    company: "Anthropic",
    slug: "claude-sonnet-4-6",
    contextWindow: "200K tokens",
    releaseDate: "2026-02",
    modalities: ["Text", "Vision"],
    articleCount: 1240,
    description: "Anthropic's most intelligent model, optimised for complex reasoning and coding tasks.",
  },
  {
    id: "claude-opus-4-5",
    name: "Claude Opus 4.5",
    company: "Anthropic",
    slug: "claude-opus-4-5",
    contextWindow: "200K tokens",
    releaseDate: "2025-11",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 1180,
    description:
      "Anthropic's flagship Opus-tier model focused on advanced reasoning, agentic workflows, and coding. Supports extended thinking and tool use with text and image input.",
  },
  {
    id: "claude-opus-4-1",
    name: "Claude Opus 4.1",
    company: "Anthropic",
    slug: "claude-opus-4-1",
    contextWindow: "200K tokens",
    releaseDate: "2025-08",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 690,
    description:
      "An incremental upgrade to Claude Opus 4 with improved coding and agentic performance. A high-capability reasoning model accepting text and images.",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    company: "Anthropic",
    slug: "claude-sonnet-4-5",
    contextWindow: "200K tokens",
    releaseDate: "2025-09",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 1320,
    description:
      "Anthropic's balanced mid-tier model known for strong coding and agentic capabilities at lower cost than Opus. Offers a 1M-token context window in beta.",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    company: "Anthropic",
    slug: "claude-haiku-4-5",
    contextWindow: "200K tokens",
    releaseDate: "2025-10",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 540,
    description:
      "Anthropic's fast, cost-efficient model and the first Haiku to include extended thinking, computer use, and context awareness. Handles text and image input.",
  },
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    company: "Anthropic",
    slug: "claude-3-7-sonnet",
    contextWindow: "200K tokens",
    releaseDate: "2025-02",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 980,
    description:
      "Anthropic's first hybrid reasoning model, combining quick responses and extended step-by-step thinking in one model. Known for strong coding and agentic tasks.",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    company: "Anthropic",
    slug: "claude-sonnet-4",
    contextWindow: "200K tokens",
    releaseDate: "2025-05",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 870,
    description:
      "The Claude 4 generation balanced model with improved reasoning and coding over 3.7 Sonnet. Accepts text and images with extended thinking support.",
  },
  {
    id: "gpt-5-2",
    name: "GPT-5.2",
    company: "OpenAI",
    slug: "gpt-5-2",
    contextWindow: "400K tokens",
    releaseDate: "2025-12",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 1410,
    description:
      "OpenAI's frontier GPT-5-series model offered in Instant, Thinking, and Pro variants for professional knowledge work. Delivers consistent gains in math, coding, science, and tool calling.",
  },
  {
    id: "gpt-5-1",
    name: "GPT-5.1",
    company: "OpenAI",
    slug: "gpt-5-1",
    contextWindow: "400K tokens",
    releaseDate: "2025-11",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 1290,
    description:
      "An iterative update to GPT-5 with improved reasoning and instruction following, released in Instant and Thinking variants. A general-purpose multimodal model.",
  },
  {
    id: "gpt-5",
    name: "GPT-5",
    company: "OpenAI",
    slug: "gpt-5",
    contextWindow: "400K tokens",
    releaseDate: "2025-08",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 2240,
    description:
      "OpenAI's GPT-5 flagship launched in August 2025, unifying fast responses and deeper reasoning with state-of-the-art coding, math, and writing. Accepts text and image input.",
  },
  {
    id: "gpt-4-1",
    name: "GPT-4.1",
    company: "OpenAI",
    slug: "gpt-4-1",
    contextWindow: "1M tokens",
    releaseDate: "2025-04",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 760,
    description:
      "A developer-focused GPT-4-series model with a 1M-token context window and strong coding and instruction-following. Released via the API ahead of the GPT-5 generation.",
  },
  {
    id: "openai-o3",
    name: "OpenAI o3",
    company: "OpenAI",
    slug: "openai-o3",
    contextWindow: "200K tokens",
    releaseDate: "2025-04",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 1120,
    description:
      "OpenAI's o-series reasoning model designed for complex multi-step problems in math, science, and coding. Can use tools and reason over images.",
  },
  {
    id: "openai-o4-mini",
    name: "OpenAI o4-mini",
    company: "OpenAI",
    slug: "openai-o4-mini",
    contextWindow: "200K tokens",
    releaseDate: "2025-04",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 480,
    description:
      "A smaller, cost-efficient o-series reasoning model optimized for fast math, coding, and visual tasks. Delivers strong performance for its size.",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    company: "OpenAI",
    slug: "gpt-4o",
    contextWindow: "128K tokens",
    releaseDate: "2024-05",
    modalities: ["Text", "Vision", "Audio", "Code"],
    articleCount: 2103,
    description:
      "OpenAI's natively multimodal GPT-4-class model handling text, image, and audio in real time. Long the default ChatGPT model before the GPT-5 generation.",
  },
  {
    id: "gpt-oss-120b",
    name: "gpt-oss-120b",
    company: "OpenAI",
    slug: "gpt-oss-120b",
    contextWindow: "128K tokens",
    releaseDate: "2025-08",
    modalities: ["Text", "Code"],
    articleCount: 610,
    description:
      "OpenAI's open-weight reasoning model released under a permissive license, designed to run on a single high-end GPU. Geared toward configurable reasoning and tool use.",
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    company: "Google",
    slug: "gemini-3-pro",
    contextWindow: "1M tokens",
    releaseDate: "2025-11",
    modalities: ["Text", "Vision", "Audio", "Video", "Code"],
    articleCount: 1350,
    description:
      "Google's flagship Gemini 3 reasoning model with a 1M-token context window and native multimodal input. Built for advanced reasoning, coding, and agentic tasks.",
  },
  {
    id: "gemini-3-flash",
    name: "Gemini 3 Flash",
    company: "Google",
    slug: "gemini-3-flash",
    contextWindow: "1M tokens",
    releaseDate: "2025-12",
    modalities: ["Text", "Vision", "Audio", "Video", "Code"],
    articleCount: 720,
    description:
      "A fast, cost-efficient Gemini 3 model that became the default in the Gemini app and Google Search. Supports up to ~1M input tokens with multimodal input.",
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    company: "Google",
    slug: "gemini-2-5-pro",
    contextWindow: "1M tokens",
    releaseDate: "2025-03",
    modalities: ["Text", "Vision", "Audio", "Video", "Code"],
    articleCount: 1460,
    description:
      "Google's Gemini 2.5 thinking model with strong reasoning and coding and a 1M-token context window. Natively handles text, image, audio, and video.",
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    company: "Google",
    slug: "gemini-2-5-flash",
    contextWindow: "1M tokens",
    releaseDate: "2025-06",
    modalities: ["Text", "Vision", "Audio", "Video", "Code"],
    articleCount: 690,
    description:
      "A fast, efficient Gemini 2.5 thinking model for high-volume tasks like summarization and document analysis. Multimodal with a 1M-token context window.",
  },
  {
    id: "gemini-2-0-flash",
    name: "Gemini 2.0 Flash",
    company: "Google",
    slug: "gemini-2-0-flash",
    contextWindow: "1M tokens",
    releaseDate: "2024-12",
    modalities: ["Text", "Vision", "Audio", "Video", "Code"],
    articleCount: 540,
    description:
      "Google's Gemini 2.0 workhorse model built for the agentic era with native tool use and multimodal input. Served as a default Gemini model in early 2025.",
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    company: "Meta",
    slug: "llama-4-maverick",
    contextWindow: "1M tokens",
    releaseDate: "2025-04",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 830,
    description:
      "Meta's open-weight natively multimodal MoE model with 17B active and 400B total parameters and a 1M-token context. Positioned as a strong general-purpose assistant and coding model.",
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    company: "Meta",
    slug: "llama-4-scout",
    contextWindow: "10M tokens",
    releaseDate: "2025-04",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 760,
    description:
      "Meta's open-weight MoE model with 17B active and 109B total parameters and an industry-leading 10M-token context window. Natively multimodal across text and images.",
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    company: "Meta",
    slug: "llama-3-3-70b",
    contextWindow: "128K tokens",
    releaseDate: "2024-12",
    modalities: ["Text", "Code"],
    articleCount: 654,
    description:
      "Meta's open-weight 70B dense text model offering performance near Llama 3.1 405B at lower cost. A widely used multilingual instruction-tuned model.",
  },
  {
    id: "mistral-large-3",
    name: "Mistral Large 3",
    company: "Mistral AI",
    slug: "mistral-large-3",
    contextWindow: "256K tokens",
    releaseDate: "2025-12",
    modalities: ["Text", "Code"],
    articleCount: 410,
    description:
      "Mistral's open-weight sparse MoE flagship with 41B active and 675B total parameters and a 256K-token context window. Built as a frontier-class reasoning and coding model.",
  },
  {
    id: "mistral-medium-3",
    name: "Mistral Medium 3",
    company: "Mistral AI",
    slug: "mistral-medium-3",
    contextWindow: "128K tokens",
    releaseDate: "2025-05",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 320,
    description:
      "A cost-efficient mid-tier Mistral model that delivers near-flagship benchmark performance at much lower price. Handles text and image input.",
  },
  {
    id: "magistral-medium",
    name: "Magistral Medium",
    company: "Mistral AI",
    slug: "magistral-medium",
    contextWindow: "128K tokens",
    releaseDate: "2025-06",
    modalities: ["Text", "Code"],
    articleCount: 230,
    description:
      "Mistral's reasoning-focused model with transparent multi-step chain-of-thought, aimed at math, logic, and structured problem solving. Available in open (Small) and enterprise (Medium) tiers.",
  },
  {
    id: "pixtral-large",
    name: "Pixtral Large",
    company: "Mistral AI",
    slug: "pixtral-large",
    contextWindow: "128K tokens",
    releaseDate: "2024-11",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 190,
    description:
      "Mistral's multimodal model combining vision and language for image question answering and document and chart analysis. Built on the Mistral Large backbone.",
  },
  {
    id: "grok-4",
    name: "Grok 4",
    company: "xAI",
    slug: "grok-4",
    contextWindow: "256K tokens",
    releaseDate: "2025-07",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 920,
    description:
      "xAI's flagship reasoning model with a 256K-token context window, released alongside a multi-agent Grok 4 Heavy variant. Known for strong reasoning and tool use.",
  },
  {
    id: "grok-4-fast",
    name: "Grok 4 Fast",
    company: "xAI",
    slug: "grok-4-fast",
    contextWindow: "2M tokens",
    releaseDate: "2025-09",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 480,
    description:
      "A faster, cheaper variant of Grok 4 with a context window up to 2M tokens. Optimized for high-throughput reasoning and agentic workloads.",
  },
  {
    id: "grok-3",
    name: "Grok 3",
    company: "xAI",
    slug: "grok-3",
    contextWindow: "1M tokens",
    releaseDate: "2025-02",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 740,
    description:
      "xAI's Grok 3 model with a large context window and a 'Think' reasoning mode, trained on the Colossus supercluster. Integrated into X with real-time information access.",
  },
  {
    id: "deepseek-v3-2",
    name: "DeepSeek-V3.2",
    company: "DeepSeek",
    slug: "deepseek-v3-2",
    contextWindow: "160K tokens",
    releaseDate: "2025-12",
    modalities: ["Text", "Code"],
    articleCount: 560,
    description:
      "An open-weight MoE model using DeepSeek Sparse Attention for near-linear context scaling and native thinking in tool use. Built for efficient long-context reasoning and agentic tasks.",
  },
  {
    id: "deepseek-v3-1",
    name: "DeepSeek-V3.1",
    company: "DeepSeek",
    slug: "deepseek-v3-1",
    contextWindow: "128K tokens",
    releaseDate: "2025-08",
    modalities: ["Text", "Code"],
    articleCount: 690,
    description:
      "An open-weight 671B-parameter (37B active) hybrid model combining the strengths of V3 and R1 into a single model. Supports both fast responses and reasoning.",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    company: "DeepSeek",
    slug: "deepseek-r1",
    contextWindow: "128K tokens",
    releaseDate: "2025-01",
    modalities: ["Text", "Code"],
    articleCount: 1680,
    description:
      "DeepSeek's open-weight reasoning model trained heavily with reinforcement learning, rivaling leading closed models on math and coding. Its release drew major industry attention in early 2025.",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek-V3",
    company: "DeepSeek",
    slug: "deepseek-v3",
    contextWindow: "128K tokens",
    releaseDate: "2024-12",
    modalities: ["Text", "Code"],
    articleCount: 940,
    description:
      "An open-weight 671B-parameter MoE model (37B active) known for strong performance at low training cost. A widely used base for general text and coding tasks.",
  },
  {
    id: "qwen3-max",
    name: "Qwen3-Max",
    company: "Alibaba",
    slug: "qwen3-max",
    contextWindow: "1M tokens",
    releaseDate: "2025-09",
    modalities: ["Text", "Code"],
    articleCount: 520,
    description:
      "Alibaba's largest proprietary Qwen3 model with a 1M-token context window and an extended-thinking mode. Positioned as the flagship of the Qwen lineup.",
  },
  {
    id: "qwen3-235b-a22b",
    name: "Qwen3-235B-A22B",
    company: "Alibaba",
    slug: "qwen3-235b-a22b",
    contextWindow: "256K tokens",
    releaseDate: "2025-04",
    modalities: ["Text", "Code"],
    articleCount: 610,
    description:
      "Alibaba's open-weight Apache-2.0 MoE model with 235B total and 22B active parameters and a switchable thinking mode. Supports 119 languages and MCP tool use.",
  },
  {
    id: "qwen3-vl-235b",
    name: "Qwen3-VL-235B",
    company: "Alibaba",
    slug: "qwen3-vl-235b",
    contextWindow: "256K tokens",
    releaseDate: "2025-09",
    modalities: ["Text", "Vision", "Code"],
    articleCount: 340,
    description:
      "The multimodal Qwen3 model combining the 235B MoE backbone with vision understanding, in Instruct and Thinking variants. Handles images and long documents.",
  },
  {
    id: "qwen2-5-max",
    name: "Qwen2.5-Max",
    company: "Alibaba",
    slug: "qwen2-5-max",
    contextWindow: "32K tokens",
    releaseDate: "2025-01",
    modalities: ["Text", "Code"],
    articleCount: 430,
    description:
      "Alibaba's large-scale MoE model from the Qwen2.5 generation, competitive with leading frontier models on benchmarks. Focused on text and code.",
  },
  {
    id: "command-a",
    name: "Command A",
    company: "Cohere",
    slug: "command-a",
    contextWindow: "256K tokens",
    releaseDate: "2025-03",
    modalities: ["Text", "Code"],
    articleCount: 280,
    description:
      "Cohere's enterprise-focused 111B open-weight model with a 256K-token context, optimized for RAG, tool use, and high throughput. Designed for efficient on-premise deployment.",
  },
  {
    id: "command-a-reasoning",
    name: "Command A Reasoning",
    company: "Cohere",
    slug: "command-a-reasoning",
    contextWindow: "256K tokens",
    releaseDate: "2025-08",
    modalities: ["Text", "Code"],
    articleCount: 190,
    description:
      "Cohere's flagship 111B reasoning model built for enterprise agentic workflows and tool use. Extends Command A with multi-step reasoning.",
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    company: "Cohere",
    slug: "command-r-plus",
    contextWindow: "128K tokens",
    releaseDate: "2024-08",
    modalities: ["Text", "Code"],
    articleCount: 360,
    description:
      "Cohere's enterprise model optimized for retrieval-augmented generation and multi-step tool use, refreshed in August 2024. Strong multilingual support across business use cases.",
  },
  {
    id: "amazon-nova-pro",
    name: "Amazon Nova Pro",
    company: "Amazon",
    slug: "amazon-nova-pro",
    contextWindow: "300K tokens",
    releaseDate: "2024-12",
    modalities: ["Text", "Vision", "Video", "Code"],
    articleCount: 240,
    description:
      "Amazon's capable multimodal Nova model handling text, image, and video input with a 300K-token context. Balances accuracy, speed, and cost on AWS Bedrock.",
  },
  {
    id: "amazon-nova-premier",
    name: "Amazon Nova Premier",
    company: "Amazon",
    slug: "amazon-nova-premier",
    contextWindow: "1M tokens",
    releaseDate: "2025-04",
    modalities: ["Text", "Vision", "Video", "Code"],
    articleCount: 170,
    description:
      "Amazon's most capable Nova model with a 1M-token context, used as a teacher for distilling smaller Nova variants. Handles complex multimodal tasks.",
  },
  {
    id: "amazon-nova-lite",
    name: "Amazon Nova Lite",
    company: "Amazon",
    slug: "amazon-nova-lite",
    contextWindow: "300K tokens",
    releaseDate: "2024-12",
    modalities: ["Text", "Vision", "Video", "Code"],
    articleCount: 150,
    description:
      "A low-cost, fast multimodal Nova model processing text, images, and up to 30 minutes of video. Aimed at high-volume workloads on AWS.",
  },
  {
    id: "amazon-nova-micro",
    name: "Amazon Nova Micro",
    company: "Amazon",
    slug: "amazon-nova-micro",
    contextWindow: "128K tokens",
    releaseDate: "2024-12",
    modalities: ["Text", "Code"],
    articleCount: 90,
    description:
      "Amazon's text-only Nova model optimized for the lowest latency and cost. Targets simple, high-throughput language tasks.",
  },
  {
    id: "phi-4",
    name: "Phi-4",
    company: "Microsoft",
    slug: "phi-4",
    contextWindow: "16K tokens",
    releaseDate: "2024-12",
    modalities: ["Text", "Code"],
    articleCount: 420,
    description:
      "Microsoft's 14B small language model trained heavily on synthetic data, with strong math and reasoning for its size. Part of the Phi family of efficient open models.",
  },
  {
    id: "phi-4-multimodal",
    name: "Phi-4-multimodal",
    company: "Microsoft",
    slug: "phi-4-multimodal",
    contextWindow: "128K tokens",
    releaseDate: "2025-02",
    modalities: ["Text", "Vision", "Audio", "Code"],
    articleCount: 230,
    description:
      "A 5.6B Phi model that simultaneously processes speech, vision, and text using a mixture-of-LoRAs architecture. Microsoft's first multimodal Phi model.",
  },
  {
    id: "phi-4-mini",
    name: "Phi-4-mini",
    company: "Microsoft",
    slug: "phi-4-mini",
    contextWindow: "128K tokens",
    releaseDate: "2025-02",
    modalities: ["Text", "Code"],
    articleCount: 280,
    description:
      "A 3.8B text-only Phi model engineered for speed and efficiency with a 128K-token context window. Strong reasoning performance for an on-device-class model.",
  },
  {
    id: "jamba-1-5-large",
    name: "Jamba 1.5 Large",
    company: "AI21 Labs",
    slug: "jamba-1-5-large",
    contextWindow: "256K tokens",
    releaseDate: "2024-08",
    modalities: ["Text", "Code"],
    articleCount: 130,
    description:
      "AI21's open hybrid SSM-Transformer model with 398B total (94B active) parameters and a 256K-token context. Built for efficient long-context enterprise workloads.",
  },
  {
    id: "dbrx-instruct",
    name: "DBRX Instruct",
    company: "Databricks",
    slug: "dbrx-instruct",
    contextWindow: "32K tokens",
    releaseDate: "2024-03",
    modalities: ["Text", "Code"],
    articleCount: 210,
    description:
      "Databricks' open-weight fine-grained MoE model with 132B total and 36B active parameters. A notable 2024 open model for general text and coding.",
  },
  {
    id: "reka-core",
    name: "Reka Core",
    company: "Reka AI",
    slug: "reka-core",
    contextWindow: "128K tokens",
    releaseDate: "2024-04",
    modalities: ["Text", "Vision", "Audio", "Video", "Code"],
    articleCount: 160,
    description:
      "Reka's flagship multimodal model able to reason over text, images, video, and audio. Released as part of the Core/Flash/Edge series.",
  },
  {
    id: "llama-3-1-nemotron-70b",
    name: "Llama 3.1 Nemotron 70B",
    company: "NVIDIA",
    slug: "llama-3-1-nemotron-70b",
    contextWindow: "128K tokens",
    releaseDate: "2024-10",
    modalities: ["Text", "Code"],
    articleCount: 290,
    description:
      "NVIDIA's RLHF-tuned customization of Llama 3.1 70B focused on response helpfulness, topping alignment benchmarks at launch. An open-weight instruction model.",
  },
  {
    id: "yi-large",
    name: "Yi-Large",
    company: "01.AI",
    slug: "yi-large",
    contextWindow: "32K tokens",
    releaseDate: "2024-05",
    modalities: ["Text", "Code"],
    articleCount: 180,
    description:
      "01.AI's large closed-source bilingual model with strong English and Chinese performance plus other languages. A notable 2024 frontier-tier model from the Yi series.",
  },
];

export const mockTags = [
  "Models & Research",
  "Prompt Engineering",
  "RAG & Memory",
  "Agents & Automation",
  "Fine-tuning & Training",
  "LLM Apps",
  "Infrastructure",
  "Multimodal",
  "AI Ethics",
  "Industry & Business",
  "Tools & Platforms",
  "Tutorials & Guides",
];

export interface AuthorProfile {
  bio: string;
  role: string;
  location: string;
  since: string;
  github: string;
  website: string;
}

export const authorProfiles: Record<string, AuthorProfile> = {
  davidoratokhai: {
    bio: "Writing the AI era as I build in it. Honest takes on the models I actually ship with — no benchmark worship.",
    role: "Founder & builder",
    location: "Lagos",
    since: "2026",
    github: "davidoratokhai",
    website: "oratokhai.dev",
  },
  sarahchen: {
    bio: "RAG in production across three apps and counting. I write down what the blog posts get wrong about retrieval.",
    role: "AI engineer",
    location: "San Francisco",
    since: "2025",
    github: "sarahchen",
    website: "sarahchen.io",
  },
  marcuswebb: {
    bio: "Benchmarks are marketing. I run real tasks from my own codebase and report what actually happens.",
    role: "Staff engineer",
    location: "Berlin",
    since: "2025",
    github: "marcuswebb",
    website: "mwebb.dev",
  },
  priyanair: {
    bio: "Prompt engineering as a craft. Mostly thinking about what to leave out.",
    role: "Applied researcher",
    location: "Bangalore",
    since: "2025",
    github: "priyanair",
    website: "priyanair.ai",
  },
  jamesokafor: {
    bio: "Building an AI co-founder in public. Real systems, real failures, shipped daily.",
    role: "Indie founder",
    location: "London",
    since: "2025",
    github: "jamesokafor",
    website: "okafor.build",
  },
  aliciatorres: {
    bio: "40+ fine-tuning runs and a healthy distrust of conventional wisdom. I follow the data.",
    role: "ML engineer",
    location: "Mexico City",
    since: "2025",
    github: "aliciatorres",
    website: "atorres.ml",
  },
  davidpark: {
    bio: "Evals are the most misunderstood part of building with AI. I've reviewed dozens of systems — here's the pattern.",
    role: "AI product lead",
    location: "Seoul",
    since: "2024",
    github: "davidpark",
    website: "davidpark.co",
  },
};
