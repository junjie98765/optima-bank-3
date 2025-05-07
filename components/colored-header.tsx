interface ColoredHeaderProps {
    title: string
    description: string
    backgroundColor?: string
    textColor?: string
  }
  
  export default function ColoredHeader({
    title,
    description,
    backgroundColor = "#4b0082", // Deep purple by default
    textColor = "#ffffff", // White by default
  }: ColoredHeaderProps) {
    return (
      <div
        className="p-8 rounded-lg mb-8"
        style={{
          backgroundColor,
          color: textColor,
        }}
      >
        <h1
          className="text-3xl font-bold mb-4"
          style={{
            color: textColor,
          }}
        >
          {title}
        </h1>
        <p
          className="text-lg"
          style={{
            color: textColor,
          }}
        >
          {description}
        </p>
      </div>
    )
  }
  