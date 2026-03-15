import { GoogleGenAI, Type } from '@google/genai';
import { Company } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type AnalysisMode = 'compass' | 'radar' | 'lens';

export async function analyzeRequirement(userInput: string, chatHistory: string, mode: AnalysisMode = 'compass') {
  let modePrompt = '';
  
  if (mode === 'compass') {
    modePrompt = `
      Task:
      1. Product Segmentation & Industry Insights: Break down the user's product into key dimensions (e.g., Materials/Fabric, Size, Execution Standards, Price Tiers, Special Requirements). Provide a brief, professional industry summary for each dimension to educate the user and help them clarify their needs.
      2. Benchmark Cases & Core Enterprises: Based on the product, list 3-5 industry benchmark companies, their target products, specifications, pricing, and market positioning.
      3. Search Keyword Combinations: Generate a set of highly effective keyword combinations (including long-tail keywords, industry jargon, and standard codes) derived from the benchmark products, to be used for extensive supplier searching in the next stage.
      4. Identify information gaps: What key parameters are still missing from the current specifications?
      5. Generate follow-up questions: Use a combination of multiple-choice and open-ended questions to guide the user to supplement information.
      
      Focus: Deep industry and product research. Provide more and finer search keywords as the conversation progresses.
    `;
  } else if (mode === 'radar') {
    modePrompt = `
      Context: You are operating within the industry and product specifications defined in the previous "Requirement Compass" phase. 
      STRICT RULE: Do NOT ask product refinement or specification questions. That is the job of the "Requirement Compass".
      Task:
      1. Keyword-Driven Discovery: Focus ONLY on the search keyword combinations provided or the user's emphasis on specific supplier attributes (e.g., location/address, company size/headcount, production capacity, certifications).
      2. Supplier Identification: Generate an incremental list of companies that match these keywords and attributes.
      3. Attribute Emphasis: If the user asks to "emphasize capacity" or "find suppliers in [Region]", prioritize those attributes in your search and explanation.
      
      Focus: Discovering suppliers based on keywords and specific supplier-side attributes (capacity, location, etc.).
    `;
  } else if (mode === 'lens') {
    modePrompt = `
      Context: You are focusing on a specific target company.
      Task:
      1. Deep Dive: Focus on the specific company mentioned in the context.
      2. Information Supplement & Profile Update: Use the keywords and user input to deeply search for and supplement information into the company profile. 
      3. Structured Data Update: You MUST provide updated scores for the following dimensions in the 'radarData' field of the JSON response: Quality (质量), Capacity (产能), ESG (环保与社会责任), Cost (成本), Finance (财务), Logistics (物流).
      4. Risk Analysis: Identify specific risks for this company and add them to 'riskAlerts'.
      
      Focus: Surround the specified company, use keywords to deeply search and supplement information to complete and UPDATE the company portrait.
    `;
  }

  const prompt = `
    You are a senior export product consultant with 15 years of experience in the relevant industry.
    Your name is "Requirement Compass".
    
    Current mode: ${mode}
    Current chat history: ${chatHistory}
    User's latest input: "${userInput}"
    
    ${modePrompt}
    
    You MUST provide your response in BOTH English and Chinese.
    
    CRITICAL FORMATTING RULES:
    - STRICTLY use Markdown for readability.
    - DO NOT use HTML tags like <br>. Use standard markdown newlines (\\n\\n) for spacing.
    - Use headers (###), bold text (**bold**), and bullet points (- item). 
    - Follow this exact structure (use the appropriate language for each field):
    
    ### 📊 Analysis & Insights / 分析与洞察
    [Detailed response based on the task above]
    
    ### 🏆 Benchmark Cases & Core Enterprises / 标杆案例与核心企业
    * **[Company A]**: [Target Product, Spec X, Pricing Y, Market Z]
    * **[Company B]**: ...
    
    ### 🔑 Search Keyword Combinations / 广泛搜索关键词组合
    * **Primary Keywords / 核心关键词**: ...
    * **Long-tail/Spec Keywords / 长尾/规格关键词**: ...
    * **Standard/Certification Keywords / 标准/认证关键词**: ...
    
    ### ❓ Needs Clarification / 需要明确
    * **Currently confirmed / 目前已确认**: ...
    * **Still need to confirm / 仍需确认**: ...
    
    ### 💡 Please select or supplement / 请选择或补充：
    1. **Option A / 选项A**: [Spec combination]
    2. **Option B / 选项B**: [Spec combination]
    3. **Option C / 选项C**: [Spec combination]
    
    **Custom input / 自定义输入**: [Open input box / 开放输入框]
    
    
    Also:
    - Assess the "Spec Clarity" (0-100).
    - Identify what details are still missing ("awaitingDetails").
    - Simulate 3 realistic supplier companies that match the user's requirements. 
    - For each company, perform "Deep Competitive Research" (竞争性调研) simulating multiple intelligence agents. 
    - **CRITICAL: Provide COMPREHENSIVE and DETAILED descriptions (at least 100-200 words per field) for Legal Integrity, Production Capacity, Market Price, and Main Customers.** 
    - The information must be professional, exhaustive, and cover specific competitive advantages or historical context.
    - Include: Registration info, Legal integrity, Capital, Production capacity, Core products, Market prices, and Main customers.
    - Ensure company names are bilingual (e.g., "Intco Medical (英科医疗)").
    - Extract the generated search keyword combinations into the JSON array.
  `;

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiResponseEn: { type: Type.STRING },
              aiResponseZh: { type: Type.STRING },
              specClarity: { type: Type.NUMBER },
              awaitingDetailsEn: { type: Type.STRING },
              awaitingDetailsZh: { type: Type.STRING },
              keywordCombinations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    textEn: { type: Type.STRING },
                    textZh: { type: Type.STRING }
                  }
                }
              },
              companies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    logoSeed: { type: Type.STRING },
                    locationEn: { type: Type.STRING },
                    locationZh: { type: Type.STRING },
                    isRecommended: { type: Type.BOOLEAN },
                    responseTime: { type: Type.STRING },
                    trustScore: { type: Type.NUMBER },
                    exportMaturity: { type: Type.NUMBER },
                    ontology: {
                      type: Type.OBJECT,
                      properties: {
                        qualifications: { type: Type.NUMBER },
                        capacity: { type: Type.NUMBER },
                        compliance: { type: Type.NUMBER }
                      }
                    },
                    registration: {
                      type: Type.OBJECT,
                      properties: {
                        date: { type: Type.STRING },
                        statusEn: { type: Type.STRING },
                        statusZh: { type: Type.STRING },
                        capital: { type: Type.STRING }
                      }
                    },
                    legalIntegrityEn: { type: Type.STRING },
                    legalIntegrityZh: { type: Type.STRING },
                    productionCapacityEn: { type: Type.STRING },
                    productionCapacityZh: { type: Type.STRING },
                    coreProductsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coreProductsZh: { type: Type.ARRAY, items: { type: Type.STRING } },
                    marketPriceEn: { type: Type.STRING },
                    marketPriceZh: { type: Type.STRING },
                    mainCustomersEn: { type: Type.ARRAY, items: { type: Type.STRING } },
                    mainCustomersZh: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tags: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          textEn: { type: Type.STRING },
                          textZh: { type: Type.STRING },
                          type: { type: Type.STRING }
                        }
                      }
                    },
                    radarData: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          labelEn: { type: Type.STRING },
                          labelZh: { type: Type.STRING },
                          value: { type: Type.NUMBER }
                        }
                      }
                    },
                    riskAlerts: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          typeEn: { type: Type.STRING },
                          typeZh: { type: Type.STRING },
                          severity: { type: Type.STRING },
                          descriptionEn: { type: Type.STRING },
                          descriptionZh: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!response.text) {
        throw new Error("No response from AI");
      }

      return JSON.parse(response.text);
    } catch (error: any) {
      retryCount++;
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        if (retryCount >= maxRetries) throw error;
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(`Quota exceeded, retrying in ${delay}ms... (Attempt ${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed after retries");
}
