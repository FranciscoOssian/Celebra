import { Timestamp } from "firebase/firestore";

export interface SubscriptionType {
  amount: number;
  purchasedAt: Timestamp;
}
