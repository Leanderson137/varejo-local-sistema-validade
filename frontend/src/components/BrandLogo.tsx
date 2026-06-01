interface BrandLogoProps {
  size?: number
  className?: string
}

const BrandLogo = ({ size = 40, className = '' }: BrandLogoProps) => {
  return (
    <div
      className={`brand-logo ${className}`.trim()}
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: 'var(--primary)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.35,
        letterSpacing: '-0.02em'
      }}
    >
      VL
    </div>
  )
}

export default BrandLogo