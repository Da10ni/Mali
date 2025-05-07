import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

const Fireworks = () => {
  const { width, height } = useWindowSize();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-stop confetti after 5 seconds (optional)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return isVisible ? <div className='absolute top-0 min-w-full h-screen'>
    <Confetti className='mx-auto' width={1000} height={1000} numberOfPieces={500} /> 
  </div>
  : null;
};

export default Fireworks;
