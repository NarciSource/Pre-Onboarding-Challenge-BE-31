export default {
  properties: {
    id: { type: "keyword" },
    categories: { type: "integer" },
    created_at: { type: "date", format: "epoch_millis" },
    name: {
      type: "text",
      fields: { keyword: { type: "keyword" } },
    },
    short_description: { type: "text" },
    slug: { type: "keyword" },
    status: { type: "keyword" },
    base_price: { type: "long" },
    currency: { type: "keyword" },
    sale_price: { type: "keyword" },
    stock: { type: "integer" },
    primary_image: {
      properties: {
        url: { type: "keyword" },
        alt_text: { type: "text" },
      },
    },
    rating: { type: "integer" },
  },
  dynamic: false,
} as const;
