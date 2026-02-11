
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  colSpan?: number; // How many columns this group occupies in the mega menu grid
  itemGridCols?: number; // How many columns to split the children items into (internal grid)
  featured?: {
    title: string;
    description: string;
    image: string;
    linkText: string;
  };
}

export interface FeatureCardProps {
  category: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
