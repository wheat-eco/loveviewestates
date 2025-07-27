import Image from "next/image"
import styles from "./team.module.css"

export const metadata = {
  title: "Our Team | Love View Estate",
  description: "Meet the dedicated professionals behind Love View Estate's success in Ayrshire.",
}

export default function TeamPage() {
  type TeamMember = {
    id: number
    name: string
    position: string
    bio: string
    image?: string
  }

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Jane Doe",
      position: "Managing Director",
      bio: "With over 20 years of experience in the Ayrshire property market, Jane leads the team with a passion for exceptional service and client success.",
      image: "/img/team.jpg",
    },
    {
      id: 2,
      name: "John Smith",
      position: "Sales Manager",
      bio: "John is an expert negotiator with an unparalleled understanding of property values in the region, ensuring clients always get the best deal.",
      image: "/img/john.jpg",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      position: "Lettings Manager",
      bio: "Sarah oversees our rental portfolio, providing landlords and tenants with professional, friendly, and efficient property management services.",
      image: "/img/sarah.jpg",
    },
    {
      id: 4,
      name: "David Wilson",
      position: "Senior Sales Negotiator",
      bio: "David's friendly approach and dedication make the buying and selling process a smooth and enjoyable experience for all his clients.",
      image: "/img/david.jpg",
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
                  src={member.image || "https://placehold.co/400x400.png"}
                  alt={member.name}
                  width={400}
                  height={400}
                  className={styles.memberImage}
                  data-ai-hint="professional headshot"
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
            <a href="mailto:careers@loveviewestate.co.uk">careers@loveviewestate.co.uk</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
