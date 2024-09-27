// avatar atom component

// union
export type isOnline = 'online' | 'offline'

// interface
interface AvatarProps {
  isOnline: isOnline
  onClick?: () => void
  className?: string
  src?: string
}

const Avatar: React.FC<AvatarProps> = ({
  isOnline = 'offline',
  onClick = () => {},
  className = '',
  src = 'https://picsum.photos/200',

  ...props
}) => {
  return (
    <div className={`avatar ${isOnline} ${className}`} onClick={onClick} {...props}>
      <div className="w-8 rounded-full">
        <img src={src} alt="Profile Image" onError={(e) => {(e.target as HTMLImageElement).src = "https://picsum.photos/200"}} />
      </div>
    </div>
  )
}

export default Avatar