export type ContactItem = {
  icon: string;
  label: string;
  value: string;
  href?: string;
};

export type InfoField = { label: string; value: string };

export type Experience = {
  start: string;
  end: string;
  title: string;
  subtitle?: string;
  location?: string;
  bullets: string[];
};

export type Education = Experience;

export type GaugeItem = { name: string; level: 1 | 2 | 3 | 4 | 5 };
