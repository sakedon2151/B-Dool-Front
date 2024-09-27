// input atom component

// union
export type InputType = 'text' | 'radio' | 'password' | 'checkbox'

// interface: with HTMLInputElement
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: InputType
    className?: string
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    className = '',
    disabled = false,

    ...props
}) => {
  return (
    <input type={type} className={`input input-bordered ${className}`} disabled={disabled} {...props} />
  )
}

export default Input