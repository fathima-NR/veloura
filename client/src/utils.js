export function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

const labels = {
  serums: "Serums",
  moisturizers: "Moisturizers",
  cleansers: "Cleansers",
  spf: "SPF",
  sets: "Sets",
  body: "Body",
  hair: "Hair",
};

export function categoryLabel(slug) {
  return labels[slug] || slug;
}

export function useFallbackImage(event) {
  event.currentTarget.src = "/placeholder.svg";
}
