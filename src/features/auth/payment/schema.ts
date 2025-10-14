import { user } from "@/db/schema";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const singlePurchase = pgTable("single_purchase", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customer_id")
    .notNull()
    .references(() => user.stripeCustomerId),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  priceId: text("product_id").notNull(),
});
