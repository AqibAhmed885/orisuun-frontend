export type Article = {
    id: number;
    image: string;
    date: string;
    readTime: string;
    title: string;
    description: string;
    tag: string;
  featured: boolean;
  banner?: string; 
  popular: boolean; // New field to indicate if the article is popular
  };
  