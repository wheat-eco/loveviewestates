import ValuationForm from "@/components/valuation/ValuationForm"

export const metadata = {
  title: "Rental Valuation | Love View Estate",
  description: "Get a free rental valuation for your property with Love View Estate.",
}

export default function RentalValuationPage() {
  return <ValuationForm valuationType="rental" />
}
