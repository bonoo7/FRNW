export const modernThemes = {
  blue: {
    colors: {
      primary: '#1E40AF',
      secondary: '#1E3A8A',
      success: '#4CAF50',
      error: '#F72585',
      warning: '#FF9800',
      info: '#00BCD4',
      disabled: '#E0E0E0',
      
      text: {
        primary: '#2B2D42',
        secondary: '#8D99AE',
        light: '#FFFFFF',
        disabled: 'rgba(45, 45, 45, 0.38)',
        accent: '#1E40AF',
      },

      background: {
        primary: 'rgba(255, 255, 255, 0.98)',
        secondary: 'rgba(245, 245, 245, 0.98)',
        card: 'rgba(255, 255, 255, 0.9)',
        surface: 'rgba(248, 249, 250, 0.9)',
        accent: 'rgba(30, 64, 175, 0.05)',
        pattern: {
          type: 'grid',
          opacity: 0.12,
          size: 32,
          rotation: 45,
          color: '#1E40AF',
          density: 1
        },
        containerImage: require('../assets/bc.png')
      },

      border: {
        primary: '#2E5DB8',
        secondary: '#2E5DB8',
        light: '#2E5DB8',
        dark: '#2E5DB8',
        accent: '#2E5DB8'
      },
      overlay: 'rgba(0, 0, 0, 0.5)',

      gradient: {
        primary: ['#1E40AF', '#3B82F6', '#1E40AF'],
        success: ['#4CAF50', '#388E3C'],
        error: ['#F72585', '#B5179E'],
        card: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.95)']
      }
    }
  },
  dark: {
    colors: {
      primary: '#1A1A1A',
      secondary: '#2D2D2D',
      success: '#4CAF50',
      error: '#FF0000',
      warning: '#FFA726',
      info: '#29B6F6',
      disabled: '#424242',

      text: {
        primary: '#FFFFFF',
        secondary: '#CCCCCC',
        light: '#FFFFFF',
        disabled: 'rgba(255, 255, 255, 0.38)',
        accent: '#1A1A1A'
      },

      background: {
        primary: '#000000',
        secondary: '#0A0A0A',
        card: '#1A1A1A',
        surface: '#2A2A2A',
        accent: '#404040',
        pattern: {
          type: 'grid',
          opacity: 0.1,
          size: 32,
          rotation: 45,
          color: '#333333',
          density: 1,
          background: '#010101'
        }
      },
      border: {
        primary: '#3A3A3A',
        secondary: '#2D2D2D',
        light: '#1A1A1A',
        dark: '#0A0A0A',
        accent: '#4A4A4A'
      },
      overlay: 'rgba(0, 0, 0, 0.7)',

      button: {
        primary: '#3A3A3A',
        secondary: '#4A4A4A',
        accent: '#5A5A5A',
        text: '#FFFFFF',
        disabled: '#444444'
      },

      gradient: {
        primary: ['#1A1A1A', '#2D2D2D', '#1A1A1A'],
        success: ['#4CAF50', '#388E3C'],
        error: ['#FF0000', '#D32F2F'],
        card: ['#1A1A1A', '#2A2A2A']
      },
      
      shadow: {
        color: '#000000',
        opacity: 0.8,
        offset: {
          width: 0,
          height: 0
        },
        radius: 10,
        elevation: 5
      }
    }
  },
  fresh: {
    colors: {
      primary: '#2D6A4F',
      secondary: '#52B788',
      success: '#4CAF50',
      error: '#F72585',
      warning: '#FF9800',
      info: '#00BCD4',
      disabled: '#E0E0E0',
      
      text: {
        primary: '#1B4D2B',
        secondary: '#5A7A5A',
        light: '#FFFFFF',
        disabled: 'rgba(27, 77, 43, 0.38)',
        accent: '#2D6A4F',
      },

      background: {
        primary: 'rgba(232, 245, 233, 0.98)',
        secondary: 'rgba(200, 230, 201, 0.98)',
        card: 'rgba(232, 245, 233, 0.95)',
        surface: 'rgba(232, 245, 233, 0.92)',
        accent: 'rgba(45, 106, 79, 0.08)',
        pattern: {
          type: 'leaves',
          opacity: 0.15,
          size: 28,
          rotation: 45,
          color: '#2D6A4F',
          density: 1
        }
      },
      
      button: {
        primary: '#2D6A4F',
        secondary: '#52B788',
        accent: '#40916C',
        text: '#FFFFFF',
        disabled: '#CCCCCC'
      },

      border: {
        primary: '#2D6A4F',
        secondary: '#52B788',
        light: '#95D5B2',
        dark: '#1B4D2B',
        accent: '#40916C'
      },
      
      overlay: 'rgba(0, 0, 0, 0.5)',

      gradient: {
        primary: ['#2D6A4F', '#52B788', '#2D6A4F'],
        success: ['#4CAF50', '#388E3C'],
        error: ['#F72585', '#B5179E'],
        card: ['rgba(232,245,233,0.9)', 'rgba(232,245,233,0.95)']
      }
    }
  },
  purple: {
    colors: {
      primary: '#FF69B4',
      secondary: '#FF1493',
      success: '#4CAF50',
      error: '#F72585',
      warning: '#FF9800',
      info: '#00BCD4',
      disabled: '#E0E0E0',
      
      text: {
        primary: '#8B3A62',
        secondary: '#B56B8C',
        light: '#FFFFFF',
        disabled: 'rgba(139, 58, 98, 0.38)',
        accent: '#FF69B4',
      },

      background: {
        primary: 'rgba(255, 240, 245, 0.98)',
        secondary: 'rgba(255, 228, 236, 0.98)',
        card: 'rgba(255, 245, 248, 0.95)',
        surface: 'rgba(255, 240, 245, 0.92)',
        accent: 'rgba(255, 105, 180, 0.08)',
        pattern: {
          color: '#FF69B4',
          opacity: 0.1,
          type: 'hearts',
          size: 24,
          rotation: 0
        }
      },

      button: {
        primary: '#FF69B4',
        secondary: '#FF1493',
        accent: '#DB7093',
        text: '#FFFFFF',
        disabled: '#CCCCCC'
      },

      border: {
        primary: '#FF69B4',
        secondary: '#FF1493',
        light: '#FFB6C1',
        dark: '#DB7093',
        accent: '#FFC0CB'
      },
      overlay: 'rgba(0, 0, 0, 0.5)',

      gradient: {
        primary: ['#FF69B4', '#FF1493', '#FF69B4'],
        success: ['#4CAF50', '#388E3C'],
        error: ['#F72585', '#B5179E'],
        card: ['rgba(255,240,245,0.9)', 'rgba(255,240,245,0.95)']
      }
    }
  }
};