import { useEffect, useState } from 'react'
import Logo from '../../assets/logo.png'

function FullPageSplash({ minimumDuration = 1000, children }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, minimumDuration)
    return () => clearTimeout(timeout)
  }, [minimumDuration])

  if (!isVisible) return children

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <img
        src={Logo}
        alt="RS Pelita"
        className="h-32 w-auto animate-pulse"
      />
    </div>
  )
}

export default FullPageSplash

