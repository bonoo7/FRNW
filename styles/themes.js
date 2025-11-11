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
          type: 'image',
          opacity: 1,
          imagePath: require('../assets/bc.png')
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
        primary: ['#1E40AF', '#3B82F6'],
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
          type: 'svg',
          opacity: 1,
          background: '#010101',
          svgData: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'142\' height=\'142\' viewBox=\'0 0 200 200\'%3E%3Cg %3E%3Cpolygon fill=\'%230e011b\' points=\'100 57.1 64 93.1 71.5 100.6 100 72.1\'/%3E%3Cpolygon fill=\'%230f031b\' points=\'100 57.1 100 72.1 128.6 100.6 136.1 93.1\'/%3E%3Cpolygon fill=\'%230e011b\' points=\'100 163.2 100 178.2 170.7 107.5 170.8 92.4\'/%3E%3Cpolygon fill=\'%230f031b\' points=\'100 163.2 29.2 92.5 29.2 107.5 100 178.2\'/%3E%3Cpath fill=\'%2310041C\' d=\'M100 21.8L29.2 92.5l70.7 70.7l70.7-70.7L100 21.8z M100 127.9L64.6 92.5L100 57.1l35.4 35.4L100 127.9z\'/%3E%3Cpolygon fill=\'%2318051e\' points=\'0 157.1 0 172.1 28.6 200.6 36.1 193.1\'/%3E%3Cpolygon fill=\'%23190720\' points=\'70.7 200 70.8 192.4 63.2 200\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'27.8 200 63.2 200 70.7 192.5 0 121.8 0 157.2 35.3 192.5\'/%3E%3Cpolygon fill=\'%23190720\' points=\'200 157.1 164 193.1 171.5 200.6 200 172.1\'/%3E%3Cpolygon fill=\'%2318051e\' points=\'136.7 200 129.2 192.5 129.2 200\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'172.1 200 164.6 192.5 200 157.1 200 157.2 200 121.8 200 121.8 129.2 192.5 136.7 200\'/%3E%3Cpolygon fill=\'%2318051e\' points=\'129.2 0 129.2 7.5 200 78.2 200 63.2 136.7 0\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'200 27.8 200 27.9 172.1 0 136.7 0 200 63.2 200 63.2\'/%3E%3Cpolygon fill=\'%23190720\' points=\'63.2 0 0 63.2 0 78.2 70.7 7.5 70.7 0\'/%3E%3Cpolygon fill=\'%231A0A21\' points=\'0 63.2 63.2 0 27.8 0 0 27.8\'/%3E%3C/g%3E%3C/svg%3E'
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
        primary: '#2D2D2D',
        secondary: '#3A3A3A',
        accent: '#4A4A4A',
        disabled: '#444444'
      },

      gradient: {
        primary: ['#1A1A1A', '#2D2D2D'],
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
      primary: '#A2FF76',
      secondary: '#FFA000',
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
        accent: '#2E5DB8',
      },

      background: {
        primary: 'rgba(255, 255, 255, 0.98)',
        secondary: 'rgba(253, 248, 235, 0.98)',
        card: 'rgba(255, 255, 255, 0.9)',
        surface: 'rgba(255, 252, 245, 0.9)',
        accent: 'rgba(46, 93, 184, 0.05)',
        pattern: {
          type: 'image',
          opacity: 1,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundColor: '#A2FF76',
          svgData: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1600 800\'%3E%3Cg fill-opacity=\'0.93\'%3E%3Cpath fill=\'%23b2ff75\' d=\'M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z\'/%3E%3Cpath fill=\'%23c2ff74\' d=\'M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z\'/%3E%3Cpath fill=\'%23d3ff72\' d=\'M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z\'/%3E%3Cpath fill=\'%23e3ff71\' d=\'M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z\'/%3E%3Cpath fill=\'%23F3FF70\' d=\'M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z\'/%3E%3Cpath fill=\'%23f5eb66\' d=\'M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z\'/%3E%3Cpath fill=\'%23f8d85c\' d=\'M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z\'/%3E%3Cpath fill=\'%23fac452\' d=\'M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z\'/%3E%3Cpath fill=\'%23fdb148\' d=\'M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z\'/%3E%3Cpath fill=\'%23FF9D3E\' d=\'M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z\'/%3E%3C/g%3E%3C/svg%3E'
        }
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
        primary: ['#2E5DB8', '#1E40AF'],
        success: ['#4CAF50', '#388E3C'],
        error: ['#F72585', '#B5179E'],
        card: ['rgba(255,252,240,0.9)', 'rgba(255,252,240,0.95)']
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
        primary: '#2B2D42',
        secondary: '#8D99AE',
        light: '#FFFFFF',
        disabled: 'rgba(45, 45, 45, 0.38)',
        accent: '#FF69B4',
      },

      background: {
        primary: 'rgba(255, 240, 245, 0.8)',
        secondary: 'rgba(255, 228, 235, 0.8)',
        card: 'rgba(255, 245, 248, 0.9)',
        surface: 'rgba(255, 235, 242, 0.9)',
        accent: 'rgba(255, 105, 180, 0.05)',
        pattern: {
          color: '#FF69B4',
          opacity: 0.1,
          type: 'hearts',
          size: 24,
          rotation: 0
        }
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
        primary: ['#FF69B4', '#FF1493'],
        success: ['#4CAF50', '#388E3C'],
        error: ['#F72585', '#B5179E'],
        card: ['rgba(255,245,248,0.9)', 'rgba(255,245,248,0.95)']
      }
    }
  }
}; 