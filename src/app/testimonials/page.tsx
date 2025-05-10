import styles from "./testimonials.module.css"

export const metadata = {
  title: "Testimonials | Love View Estate",
  description: "Read what our clients have to say about their experience with Love View Estate.",
}

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "John & Sarah Wilson",
      location: "North Ayrshire",
      text: "We cannot thank Love View Estate enough for their exceptional service in selling our home. From the initial valuation to completion, the team was professional, responsive, and genuinely cared about getting us the best outcome. We sold for above asking price within two weeks!",
      service: "Property Sale",
    },
    {
      id: 2,
      name: "Emma Thompson",
      location: "Kilmarnock",
      text: "As a first-time buyer, I was nervous about the whole process. The team at Love View Estate guided me through every step with patience and expertise. They found me the perfect property and made what could have been a stressful experience enjoyable.",
      service: "Property Purchase",
    },
    {
      id: 3,
      name: "Robert Campbell",
      location: "East Ayrshire",
      text: "I've been a landlord with Love View Estate for three years now, and their property management service is second to none. They find quality tenants quickly, handle maintenance issues promptly, and the rental income is always on time. Highly recommended!",
      service: "Letting Services",
    },
    {
      id: 4,
      name: "Margaret & David Brown",
      location: "North Ayrshire",
      text: "After trying another estate agent with no success, we switched to Love View Estate. What a difference! Their marketing was outstanding, the photography made our home look amazing, and they arranged quality viewings that led to a sale within a month.",
      service: "Property Sale",
    },
    {
      id: 5,
      name: "James McIntyre",
      location: "Kilmarnock",
      text: "The team at Love View Estate helped me find the perfect rental property when I relocated to Kilmarnock for work. They understood exactly what I was looking for and made the entire process smooth and stress-free. I wouldn't hesitate to use them again.",
      service: "Rental Search",
    },
    {
      id: 6,
      name: "Susan & Alan Reid",
      location: "East Ayrshire",
      text: "We've bought and sold several properties through Love View Estate over the years. Their knowledge of the local market is unmatched, and they always go above and beyond to ensure everything goes smoothly. They're our go-to estate agent for a reason!",
      service: "Multiple Services",
    },
  ]

  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.testimonialsContent}>
        <h1 className={styles.testimonialsHeading}>CLIENT TESTIMONIALS</h1>
        <p className={styles.testimonialsIntro}>
          Don't just take our word for it. Here's what our clients have to say about their experience with Love View
          Estate.
        </p>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.testimonialQuote}>❝</div>
              <p className={styles.testimonialText}>{testimonial.text}</p>
              <div className={styles.testimonialFooter}>
                <div className={styles.testimonialAuthor}>
                  <p className={styles.authorName}>{testimonial.name}</p>
                  <p className={styles.authorLocation}>{testimonial.location}</p>
                </div>
                <div className={styles.testimonialService}>{testimonial.service}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.leaveTestimonial}>
          <h2>Share Your Experience</h2>
          <p>
            We value feedback from all our clients. If you've recently used our services and would like to share your
            experience, please email us at <a href="mailto:feedback@loveviewestate.com">feedback@loveviewestate.com</a>{" "}
            or leave a review on our{" "}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Google Business
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  )
}
