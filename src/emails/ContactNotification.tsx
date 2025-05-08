import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Link, Img } from "@react-email/components"

interface ContactNotificationEmailProps {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  domain: string
}

export const ContactNotificationEmail = ({
  name,
  email,
  phone = "Not provided",
  subject = "General Inquiry",
  message,
  domain = "loveviewestates.co.uk",
}: ContactNotificationEmailProps) => {
  // Ensure all URLs use the correct domain
  const websiteUrl = `https://${domain}`
  const logoUrl = `https://${domain}/logo.png`
  const adminUrl = `https://${domain}/admin`

  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={logoUrl} width="150" height="50" alt="Love View Estates" style={logo} />
          <Heading style={heading}>New Contact Form Submission</Heading>

          <Section style={section}>
            <Text style={subheading}>Contact Details</Text>
            <Text style={detailRow}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={detailRow}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={detailRow}>
              <strong>Phone:</strong> {phone}
            </Text>
            <Text style={detailRow}>
              <strong>Subject:</strong> {subject}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={subheading}>Message</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>This is an automated notification from your website contact form.</Text>
            <Text style={footerText}>
              <Link href={websiteUrl} style={link}>
                Love View Estates
              </Link>
              {" | "}
              <Link href={adminUrl} style={link}>
                Admin Portal
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactNotificationEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "4px",
  maxWidth: "600px",
}

const logo = {
  margin: "0 auto 24px",
  display: "block",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
  textAlign: "center" as const,
}

const section = {
  padding: "16px 0",
}

const subheading = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#e4b611",
  margin: "16px 0",
}

const detailRow = {
  fontSize: "14px",
  color: "#3c4043",
  margin: "8px 0",
}

const messageText = {
  fontSize: "14px",
  color: "#3c4043",
  margin: "8px 0",
  lineHeight: "1.6",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const footer = {
  color: "#9ca299",
  fontSize: "12px",
  marginTop: "20px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#9ca299",
  fontSize: "12px",
  margin: "4px 0",
}

const link = {
  color: "#e4b611",
  textDecoration: "underline",
}
