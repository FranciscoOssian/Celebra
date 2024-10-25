export interface EventType {
  id: string;
  description: string;
  creatorId: string;
  name: string;
  date: string;
  time: string;
  location: string;
  fileHero: string;
  createdAt: Date;
  puckData?: any;
  usePuck?: boolean;
}
