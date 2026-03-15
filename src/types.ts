export interface Message {
  role: 'user' | 'ai';
  content: string;
  contentZh: string;
}

export interface Tag {
  textEn: string;
  textZh: string;
  type: 'verified' | 'premium' | 'standard';
}

export interface RadarMetric {
  labelEn: string;
  labelZh: string;
  value: number;
}

export interface OntologyDimensions {
  qualifications: number; // 资质
  capacity: number;       // 产能
  compliance: number;     // 合规
}

export interface RiskAlert {
  typeEn: string;
  typeZh: string;
  severity: 'low' | 'medium' | 'high';
  descriptionEn: string;
  descriptionZh: string;
}

export interface KeywordCombination {
  textEn: string;
  textZh: string;
}

export interface Company {
  id: string;
  name: string;
  logoSeed: string;
  locationEn: string;
  locationZh: string;
  isRecommended: boolean;
  responseTime: string;
  trustScore: number;
  exportMaturity: number; // 0-100
  ontology: OntologyDimensions;
  tags: Tag[];
  radarData: RadarMetric[];
  riskAlerts: RiskAlert[];
  // Deep Research Fields
  registration?: {
    date: string;
    statusEn: string;
    statusZh: string;
    capital: string;
  };
  legalIntegrityEn?: string;
  legalIntegrityZh?: string;
  productionCapacityEn?: string;
  productionCapacityZh?: string;
  coreProductsEn?: string[];
  coreProductsZh?: string[];
  marketPriceEn?: string;
  marketPriceZh?: string;
  mainCustomersEn?: string[];
  mainCustomersZh?: string[];
}

export interface SimulationParams {
  materialFluctuation: number;
  logisticsPressure: number;
  geopoliticalRisk: number;
}
