// button atom component

// union
export type ButtonType = 'button' | 'submit'

// interface: with HTMLButtonElement
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type: ButtonType
  onClick?: () => void  
  className?: string
  disabled?: boolean
  children: React.ReactNode
}

const Button:React.FC<ButtonProps> = ({
  type = 'button',
  onClick = () => {},
  className = '',
  disabled = false,
  children,

  ...props
}) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick} disabled={disabled} {...props}>
        {children}
    </button>
  )
}

export default Button

