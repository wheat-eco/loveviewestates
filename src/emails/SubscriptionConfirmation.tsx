import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "@react-email/components"

interface SubscriptionConfirmationEmailProps {
  email: string
  domain?: string
}

export default function SubscriptionConfirmationEmail({
  email,
  domain = "loveviewestates.co.uk",
}: SubscriptionConfirmationEmailProps) {
  const websiteUrl = `https://${domain}`
  const logoUrl = `https://${domain}/img/love-view-logo.png`

  // Styles
  const main = {
    backgroundColor: "#ffffff",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  }

  const container = {
    margin: "0 auto",
    padding: "20px 0",
    maxWidth: "600px",
  }

  const logo = {
    margin: "0 auto 20px auto",
    display: "block",
  }

  const content = {
    padding: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e4e4e4",
    borderRadius: "5px",
  }

  const heading = {
    fontSize: "24px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#333",
    textAlign: "center" as const,
    margin: "30px 0",
  }

  const paragraph = {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#444",
    margin: "16px 0",
  }

  const bulletPoints = {
    margin: "20px 0",
  }

  const bulletPoint = {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#444",
    margin: "8px 0",
  }

  const button = {
    backgroundColor: "#e4b611",
    borderRadius: "4px",
    color: "#000",
    fontWeight: "600",
    padding: "12px 20px",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    margin: "30px auto",
    width: "220px",
  }

  const hr = {
    borderColor: "#e4e4e4",
    margin: "30px 0",
  }

  const footerText = {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#666",
    fontStyle: "italic",
  }

  const footerContainer = {
    textAlign: "center" as const,
    margin: "20px 0",
    color: "#666",
    fontSize: "14px",
  }

  const footerLink = {
    color: "#666",
    textDecoration: "underline",
  }

  return (
    <Html>
      <Head />
      <Preview>Welcome to Love View Estates Newsletter</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={logoUrl} alt="Love View Estates" width="150" height="50" style={logo} />

          <Section style={content}>
            <Heading style={heading}>Welcome to Our Newsletter!</Heading>

            <Text style={paragraph}>
              Thank you for subscribing to the Love View Estates newsletter. You'll now receive updates on:
            </Text>

            <Section style={bulletPoints}>
              <Text style={bulletPoint}>• New property listings</Text>
              <Text style={bulletPoint}>• Market insights and trends</Text>
              <Text style={bulletPoint}>• Exclusive offers and events</Text>
              <Text style={bulletPoint}>• Property investment tips</Text>
            </Section>

            <Button href={`${websiteUrl}/available-properties`} style={button}>
              Browse Our Properties
            </Button>

            <Hr style={hr} />

            <Text style={footerText}>
              You're receiving this email because you signed up for the Love View Estates newsletter with {email}. If
              you didn't subscribe, you can safely ignore this email.
            </Text>
          </Section>

          <Section style={footerContainer}>
            <Text>© {new Date().getFullYear()} Love View Estates. All rights reserved.</Text>
            <Text>
              <a href={websiteUrl} style={footerLink}>
                Visit our website
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
