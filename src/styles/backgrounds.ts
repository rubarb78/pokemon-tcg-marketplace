export const backgroundStyles = {
  light: {
    default: `linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)`,
    pokeball: {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        backgroundImage: `url('/pokeball-bg.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        opacity: 0.1,
        zIndex: 0,
        pointerEvents: 'none',
      }
    }
  },
  dark: {
    default: `linear-gradient(135deg, #1a202c 0%, #2d3748 100%)`,
    pokeball: {
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)',
        backgroundImage: `url('/pokeball-bg.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        opacity: 0.1,
        zIndex: 0,
        pointerEvents: 'none',
      }
    }
  }
}
