export type PageType = "opt-in" | "sales" | "booking" | "thanks";

export type TemplateId =
  | "opt-in-dense"
  | "opt-in-light"
  | "sales-long"
  | "sales-brutal"
  | "booking-editorial"
  | "booking-letter"
  | "thanks-next";

export type FontId =
  | "instrument-serif"
  | "newsreader"
  | "fraunces"
  | "playfair"
  | "source-serif"
  | "syne"
  | "bebas"
  | "outfit"
  | "dm-sans"
  | "libre-franklin";

export type BrandKit = {
  name: string
  logo?: string;
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  surface: string;
  headingFont: FontId;
  bodyFont: FontId;
  radius: "none" | "sm" | "md";
};

export type ProofItem = {
  quote: string;
  name: string;
  role?: string;
  image?: string;
};

export type StepItem = {
  title: string;
  text: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type PageCopy = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaHref: string;
  ctaSecondary?: string;
  audience: string;
  leadTitle: string;
  problems: string[];
  bodyTitle: string;
  body: string;
  mechanismTitle: string;
  mechanismSteps: StepItem[];
  offerTitle: string;
  offerName: string;
  offerBullets: string[];
  bonuses: string[];
  proof: ProofItem[];
  guaranteeTitle: string;
  guarantee: string;
  notFor: string[];
  willGet: string[];
  faqs: FaqItem[];
  nextStep: string;
  legal: string;
};

export type Photos = {
  hero?: string;
  portrait?: string;
  gallery: string[];
};

export type FormConfig = {
  fields: Array<"firstName" | "lastName" | "email" | "phone" | "business">;
  submitLabel: string;
  note: string;
};

export type Project = {
  id: string;
  name: string;
  partner: string;
  type: PageType;
  template: TemplateId;
  brand: BrandKit;
  copy: PageCopy;
  photos: Photos;
  form: FormConfig;
  createdAt: string;
  updatedAt: string;
};

export type QualityFlag = {
  id: string;
  letter?: string;
  title: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};
