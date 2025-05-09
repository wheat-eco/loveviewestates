import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import type { CSSProperties } from "react"

interface ValuationStatusUpdateEmailProps {
  name: string
  address: string
  status: string
  requestType: string
  domain?: string
}

export default function ValuationStatusUpdateEmail({
  name,
  address,
  status,
  requestType,
  domain = "loveviewestates.co.uk",
}: ValuationStatusUpdateEmailProps) {
  const baseUrl = `https://${domain}`

  // Email styles
  const main: CSSProperties = {
    fontFamily: '"Segoe UI", sans-serif',
    backgroundColor: "#ffffff",
  }

  const container: CSSProperties = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "580px",
  }

  const header: CSSProperties = {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    textAlign: "center",
    borderBottom: "3px solid #e4b611",
  }

  const logo: CSSProperties = {
    margin: "0 auto",
  }

  const section: CSSProperties = {
    padding: "20px",
  }

  const heading: CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "24px",
  }

  const paragraph: CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#333",
    marginBottom: "16px",
  }

  const button: CSSProperties = {
    backgroundColor: "#e4b611",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "12px 24px",
    margin: "32px auto",
    maxWidth: "220px",
  }

  const footer: CSSProperties = {
    borderTop: "1px solid #ddd",
    padding: "20px",
    textAlign: "center",
  }

  const footerText: CSSProperties = {
    fontSize: "14px",
    color: "#666",
    margin: "8px 0",
  }

  const statusBox: CSSProperties = {
    padding: "16px",
    backgroundColor: status === "completed" ? "#f6ffed" : "#fff7e6",
    borderRadius: "4px",
    marginBottom: "24px",
    borderLeft: `4px solid ${status === "completed" ? "#52c41a" : "#faad14"}`,
  }

  const statusHeading: CSSProperties = {
    fontSize: "18px",
    fontWeight: "bold",
    color: status === "completed" ? "#52c41a" : "#faad14",
    margin: "0 0 8px 0",
  }

  const propertyBox: CSSProperties = {
    padding: "16px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    marginBottom: "24px",
  }

  // Email subject and preview
  const subject =
    status === "completed"
      ? `Your ${requestType} Valuation is Complete`
      : `Update on Your ${requestType} Valuation Request`

  const previewText =
    status === "completed"
      ? `Your property valuation for ${address} has been completed`
      : `There's an update on your valuation request for ${address}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img src={`${baseUrl}/logo.png`} width="150" height="50" alt="Love View Estate" style={logo} />
          </Section>

          <Section style={section}>
            <Heading style={heading}>
              {status === "completed" ? "Your Property Valuation is Complete" : "Update on Your Valuation Request"}
            </Heading>

            <Text style={paragraph}>Hello {name},</Text>

            <div style={statusBox}>
              <Text style={statusHeading}>
                {status === "completed"
                  ? "Valuation Completed"
                  : status === "cancelled"
                    ? "Valuation Cancelled"
                    : "Status Updated"}
              </Text>
              <Text style={paragraph}>
                {status === "completed"
                  ? `We've completed the ${requestType.toLowerCase()} valuation for your property.`
                  : status === "cancelled"
                    ? `Your ${requestType.toLowerCase()} valuation request has been cancelled.`
                    : `The status of your ${requestType.toLowerCase()} valuation request has been updated.`}
              </Text>
            </div>

            <div style={propertyBox}>
              <Text style={{ ...paragraph, marginBottom: "8px", fontWeight: "bold" }}>Property Address:</Text>
              <Text style={{ ...paragraph, marginBottom: "0" }}>{address}</Text>
            </div>

            {status === "completed" ? (
              <>
                <Text style={paragraph}>
                  Our team has carefully assessed your property and prepared a detailed valuation report. One of our
                  agents will be in touch with you shortly to discuss the results and answer any questions you may have.
                </Text>

                <Link href={`${baseUrl}/contact`} style={button}>
                  Contact Us
                </Link>
              </>
            ) : status === "cancelled" ? (
              <>
                <Text style={paragraph}>
                  If you believe this is an error or would like to reschedule your valuation, please don't hesitate to
                  contact us.
                </Text>

                <Link href={`${baseUrl}/valuation`} style={button}>
                  Request New Valuation
                </Link>
              </>
            ) : (
              <Text style={paragraph}>
                If you have any questions about your valuation request, please feel free to contact us.
              </Text>
            )}

            <Text style={paragraph}>Thank you for choosing Love View Estate for your property needs.</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} Love View Estate. All rights reserved.</Text>
            <Text style={footerText}>123 Estate Avenue, Ayrshire, United Kingdom</Text>
            <Text style={footerText}>
              <Link href={`${baseUrl}`} style={{ color: "#e4b611" }}>
                Visit our website
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
