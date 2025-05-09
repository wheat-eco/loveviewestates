import Image from "next/image"
import styles from "./meet-the-team.module.css"

interface TeamMember {
  name: string
  title: string
  location: string
  image: string
}

export default function MeetTheTeamPage() {
  const teamMembers: TeamMember[] = [
    {
      name: "Mel Connelly",
      title: "Director",
      location: "",
      image: "/placeholder.svg?height=400&width=300&text=Mel+Connelly",
    },
    {
      name: "Robyn Cambridge",
      title: "Property Consultant",
      location: "Ayrshire",
      image: "/placeholder.svg?height=400&width=300&text=Robyn+Cambridge",
    },
    {
      name: "Gail Ryan",
      title: "Property Consultant",
      location: "Ayrshire",
      image: "/placeholder.svg?height=400&width=300&text=Gail+Ryan",
    },
    {
      name: "Shannon Watson",
      title: "Property Consultant",
      location: "Ayrshire",
      image: "/placeholder.svg?height=400&width=300&text=Shannon+Watson",
    },
    {
      name: "Julie Williams",
      title: "Property Consultant",
      location: "Ayrshire",
      image: "/placeholder.svg?height=400&width=300&text=Julie+Williams",
    },
  ]

  return (
    <div className={styles.teamContainer}>
      <h1 className={styles.pageTitle}>MEET THE TEAM</h1>

      <div className={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <div key={index} className={styles.teamMember}>
            <div className={styles.imageContainer}>
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={300}
                height={400}
                className={styles.memberImage}
              />
            </div>
            <div className={styles.memberInfo}>
              <h2 className={styles.memberName}>{member.name}</h2>
              <p className={styles.memberTitle}>
                {member.title}
                {member.location && `, ${member.location}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
