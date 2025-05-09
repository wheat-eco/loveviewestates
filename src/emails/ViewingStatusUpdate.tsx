import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import type { CSSProperties } from "react"

interface ViewingStatusUpdateEmailProps {
  name: string
  propertyTitle: string
  propertySlug: string
  status: string
  preferredDate?: string
  domain?: string
}

export default function ViewingStatusUpdateEmail({
  name,
  propertyTitle,
  propertySlug,
  status,
  preferredDate,
  domain = "loveviewestates.co.uk",
}: ViewingStatusUpdateEmailProps) {
  const baseUrl = `https://${domain}`
  const propertyUrl = `${baseUrl}/property/${propertySlug}`

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
    backgroundColor: status === "approved" ? "#f6ffed" : status === "rejected" ? "#fff1f0" : "#fff7e6",
    borderRadius: "4px",
    marginBottom: "24px",
    borderLeft: `4px solid ${status === "approved" ? "#52c41a" : status === "rejected" ? "#f5222d" : "#faad14"}`,
  }

  const statusHeading: CSSProperties = {
    fontSize: "18px",
    fontWeight: "bold",
    color: status === "approved" ? "#52c41a" : status === "rejected" ? "#f5222d" : "#faad14",
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
    status === "approved"
      ? "Your Property Viewing Request is Approved"
      : status === "rejected"
        ? "Update on Your Property Viewing Request"
        : "Update on Your Property Viewing Request"

  const previewText =
    status === "approved"
      ? `Your viewing request for ${propertyTitle} has been approved`
      : status === "rejected"
        ? `There's an update on your viewing request for ${propertyTitle}`
        : `There's an update on your viewing request for ${propertyTitle}`

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
              {status === "approved" ? "Your Viewing Request is Approved" : "Update on Your Viewing Request"}
            </Heading>

            <Text style={paragraph}>Hello {name},</Text>

            <div style={statusBox}>
              <Text style={statusHeading}>
                {status === "approved"
                  ? "Viewing Approved"
                  : status === "rejected"
                    ? "Viewing Request Declined"
                    : "Status Updated"}
              </Text>
              <Text style={paragraph}>
                {status === "approved"
                  ? `We're pleased to inform you that your request to view the property has been approved.`
                  : status === "rejected"
                    ? `We regret to inform you that your viewing request could not be accommodated at this time.`
                    : `The status of your viewing request has been updated.`}
              </Text>
            </div>

            <div style={propertyBox}>
              <Text style={{ ...paragraph, marginBottom: "8px", fontWeight: "bold" }}>Property:</Text>
              <Text style={{ ...paragraph, marginBottom: "0" }}>{propertyTitle}</Text>
              {preferredDate && (
                <>
                  <Text style={{ ...paragraph, marginTop: "16px", marginBottom: "8px", fontWeight: "bold" }}>
                    Preferred Date:
                  </Text>
                  <Text style={{ ...paragraph, marginBottom: "0" }}>
                    {new Date(preferredDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </>
              )}
            </div>

            {status === "approved" ? (
              <>
                <Text style={paragraph}>
                  One of our agents will contact you shortly to confirm the exact date and time for your viewing. Please
                  ensure your contact details are up to date.
                </Text>

                <Link href={propertyUrl} style={button}>
                  View Property Details
                </Link>
              </>
            ) : status === "rejected" ? (
              <>
                <Text style={paragraph}>
                  This could be due to scheduling conflicts or the property may no longer be available. Please feel free
                  to browse our other properties or request a viewing for a different date.
                </Text>

                <Link href={`${baseUrl}/available-properties`} style={button}>
                  Browse Other Properties
                </Link>
              </>
            ) : (
              <Text style={paragraph}>
                If you have any questions about your viewing request, please feel free to contact us.
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
