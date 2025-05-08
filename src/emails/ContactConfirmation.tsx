import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from "@react-email/components"
  
  interface ContactConfirmationEmailProps {
    name: string
    subject?: string
    message: string
  }
  
  export const ContactConfirmationEmail = ({
    name,
    subject = "General Inquiry",
    message,
  }: ContactConfirmationEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Thank you for contacting Love View Estates</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img
              src="https://loveviewestates.co.uk/logo.png"
              width="150"
              height="50"
              alt="Love View Estates"
              style={logo}
            />
            <Heading style={heading}>Thank You For Contacting Us</Heading>
  
            <Section style={section}>
              <Text style={text}>Dear {name},</Text>
              <Text style={text}>
                Thank you for reaching out to Love View Estates. We have received your inquiry and a member of our team
                will be in touch with you shortly.
              </Text>
              <Text style={text}>We aim to respond to all inquiries within 24 hours during business days.</Text>
            </Section>
  
            <Hr style={hr} />
  
            <Section style={section}>
              <Text style={subheading}>Your Message</Text>
              <Text style={detailRow}>
                <strong>Subject:</strong> {subject}
              </Text>
              <Text style={messageText}>{message}</Text>
            </Section>
  
            <Section style={ctaSection}>
              <Button style={button} href="https://loveviewestates.co.uk/available-properties">
                Browse Our Properties
              </Button>
            </Section>
  
            <Hr style={hr} />
  
            <Section style={footer}>
              <Text style={footerText}>Kind regards,</Text>
              <Text style={footerText}>The Love View Estates Team</Text>
              <Text style={footerContact}>
                <Link href="tel:+441234567890" style={link}>
                  +44 1234 567890
                </Link>{" "}
                |{" "}
                <Link href="mailto:info@loveviewestates.co.uk" style={link}>
                  info@loveviewestates.co.uk
                </Link>
              </Text>
              <Text style={footerAddress}>123 Property Street, Ayrshire, Scotland, UK</Text>
              <Text style={socialLinks}>
                <Link href="https://facebook.com/loveviewestates" style={socialLink}>
                  Facebook
                </Link>
                {" | "}
                <Link href="https://instagram.com/loveviewestates" style={socialLink}>
                  Instagram
                </Link>
                {" | "}
                <Link href="https://twitter.com/loveviewestates" style={socialLink}>
                  Twitter
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    )
  }
  
  export default ContactConfirmationEmail
  
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
  
  const text = {
    fontSize: "14px",
    color: "#3c4043",
    margin: "12px 0",
    lineHeight: "1.5",
  }
  
  const subheading = {
    fontSize: "16px",
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
    padding: "12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    lineHeight: "1.6",
  }
  
  const ctaSection = {
    padding: "24px 0",
    textAlign: "center" as const,
  }
  
  const button = {
    backgroundColor: "#e4b611",
    borderRadius: "4px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 24px",
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
  
  const footerContact = {
    color: "#9ca299",
    fontSize: "12px",
    margin: "8px 0",
  }
  
  const footerAddress = {
    color: "#9ca299",
    fontSize: "12px",
    margin: "4px 0 12px",
  }
  
  const link = {
    color: "#e4b611",
    textDecoration: "underline",
  }
  
  const socialLinks = {
    margin: "12px 0",
  }
  
  const socialLink = {
    color: "#e4b611",
    textDecoration: "none",
  }
  