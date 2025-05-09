import Image from "next/image"
import styles from "./landlords.module.css"

export default function LandlordsPage() {
  return (
    <div className={styles.landlordContainer}>
      <h1 className={styles.pageTitle}>LANDLORDS</h1>

      <div className={styles.contentWrapper}>
        <div className={styles.imageContainer}>
          <Image
            src="/placeholder.svg?height=600&width=500&text=Property+Image"
            alt="Property managed by Love View Estate"
            width={500}
            height={600}
            className={styles.propertyImage}
          />
        </div>

        <div className={styles.textContent}>
          <p className={styles.introText}>
            Love View Estate is delighted to offer our professional services to landlords and tenants when it comes to property management.
          </p>

          <p className={styles.introText}>
            We are proud to be registered with the Scottish Government to be accepted on the Letting Agent Register in Scotland.
          </p>

          <p className={styles.registrationNumber}>Letting Agent Registration Number: LARN-</p>

          <p className={styles.introText}>
            Love View Estate offers a comprehensive full management service for landlords as well as a tenant find option.
          </p>

          <h2 className={styles.sectionTitle}>Full Management Service includes:</h2>

          <ul className={styles.servicesList}>
            <li>Full Advertising of the Property</li>
            <li>Carrying out accompanied Viewings</li>
            <li>Referencing & interviewing Potential Tenants</li>
            <li>
              Creating Lease, Inventory, Ensuring all legal certificates are done prior to tenant moving in (Landlords
              Gas Safety, EICR, Wired in Smoke Alarms (Heat Detectors), Carbon Monoxide, Landlords Insurance up to date)
            </li>
            <li>Updating utilities & council tax</li>
            <li>Collection of Rent each month (statement provided to landlord & payment sent by Bank Transfer)</li>
            <li>Collection of Deposit & transferred to Tenancy Deposit Scheme</li>
            <li>Regular inspections on the property</li>
            <li>Arranging any Repairs on the property (quotes provided)</li>
            <li>Main point of contact for the tenant</li>
            <li>Chasing Rent (if required)</li>
            <li>Serving Notices (if required)</li>
            <li>Check out inspections when tenants change over</li>
            <li>
              Dealing with any of issues in regards to the property or tenant, i.e. Insurance works, Complaints etc.
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.tenantFindSection}>
        <h2 className={styles.sectionTitle}>Tenant Find Service</h2>

        <p className={styles.introText}>
          We can offer a tenant find service for landlords who generally like to look after their own properties. At
          Love View Estate, we believe the key to successful property management is choosing the correct tenant. Our tenant find
          service involves the following:
        </p>

        <ul className={styles.servicesList}>
          <li>Full Advertising of the Property</li>
          <li>Carrying out accompanied Viewings</li>
          <li>Referencing & interviewing Potential Tenants</li>
          <li>
            Creating Lease, Inventory, Ensuring all legal certificates are done prior to tenant moving in (Landlords Gas
            Safety, EICR, Wired in Smoke Alarms (Heat Detectors), Carbon Monoxide, Landlords Insurance up to date)
          </li>
          <li>Updating utilities & council tax</li>
          <li>Collection of Deposit & Registered to Tenancy Deposit Scheme</li>
        </ul>

        <p className={styles.contactText}>
          We can offer a tailormade solution for your needs. For more information on our landlord services or a
          quotation, please get in touch.
        </p>
      </div>
    </div>
  )
}
