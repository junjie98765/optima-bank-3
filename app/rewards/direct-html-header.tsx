"use client"

export default function DirectHtmlHeader() {
  return (
    <div
      style={{
        backgroundColor: "#4b0082",
        padding: "2rem",
        borderRadius: "0.5rem",
        marginBottom: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "700",
          marginBottom: "1rem",
          color: "white",
        }}
      >
        Rewards Marketplace
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          color: "white",
        }}
      >
        Redeem your points for exclusive rewards, discounts, and vouchers from our partner brands.
      </p>
    </div>
  )
}
