import ValuationForm from "@/components/valuation/ValuationForm"

export const metadata = {
  title: "Sales Valuation | Love View Estate",
  description: "Get a free sales valuation for your property with Love View Estate.",
}

export default function SalesValuationPage() {
  return <ValuationForm valuationType="sale" />
}
