import Image from "next/image"
import styles from "./team.module.css"

export const metadata = {
  title: "Our Team | Love View Estate",
  description: "Meet the dedicated professionals behind Love View Estate's success in Ayrshire.",
}

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Michael Connelly",
      position: "Founder & Managing Director",
      bio: "With over 16 years of experience in the property sector across North and East Ayrshire, Michael founded Love View Estate in 2018. His extensive knowledge of the local market and commitment to client satisfaction has been the driving force behind the company's success.",
      image: "/placeholder.svg?height=400&width=400&text=Michael",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Head of Sales",
      bio: "Sarah brings 10 years of real estate experience to Love View Estate. She oversees all sales operations and ensures our clients receive exceptional service throughout their property journey.",
      image: "/placeholder.svg?height=400&width=400&text=Sarah",
    },
    {
      id: 3,
      name: "David Thompson",
      position: "Lettings Manager",
      bio: "David manages our growing rental portfolio with expertise and attention to detail. He works closely with landlords and tenants to create positive, long-lasting relationships.",
      image: "/placeholder.svg?height=400&width=400&text=David",
    },
    {
      id: 4,
      name: "Emma Wilson",
      position: "East Ayrshire Branch Manager",
      bio: "Emma leads our Kilmarnock branch, bringing local knowledge and enthusiasm to the East Ayrshire market. She has been instrumental in establishing our presence in the area since 2020.",
      image: "/placeholder.svg?height=400&width=400&text=Emma",
    },
  ]

  return (
    <div className={styles.teamContainer}>
      <div className={styles.teamContent}>
        <h1 className={styles.teamHeading}>OUR TEAM</h1>
        <p className={styles.teamIntro}>
          Meet the dedicated professionals who make Love View Estate the trusted name in Ayrshire property. Our team
          combines local expertise with industry knowledge to deliver exceptional service to all our clients.
        </p>

        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.id} className={styles.teamMember}>
              <div className={styles.memberImageWrapper}>
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={400}
                  height={400}
                  className={styles.memberImage}
                />
              </div>
              <div className={styles.memberInfo}>
                <h2 className={styles.memberName}>{member.name}</h2>
                <h3 className={styles.memberPosition}>{member.position}</h3>
                <p className={styles.memberBio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.joinTeam}>
          <h2>Join Our Team</h2>
          <p>
            We're always looking for talented individuals who share our passion for property and commitment to excellent
            service. If you're interested in joining Love View Estate, please send your CV to{" "}
            <a href="mailto:careers@loveviewestate.com">careers@loveviewestate.com</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
