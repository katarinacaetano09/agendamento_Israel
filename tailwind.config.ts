import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais do sistema
        primary: {
          DEFAULT: '#4F6BFF', // Azul moderado - cor principal de ação e destaque
          50: '#F0F3FF',
          100: '#E1E7FF',
          200: '#C3CFFF',
          300: '#A5B7FF',
          400: '#869FFF',
          500: '#4F6BFF', // Base
          600: '#3C55DB',
          700: '#2B40B7',
          800: '#1C2B94',
          900: '#111A70',
        },
        // Cor secundária - para elementos complementares
        secondary: {
          DEFAULT: '#34D399', // Verde suave - para status de confirmação/sucesso
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399', // Base
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Tons neutros para textos, fundos, separadores
        neutral: {
          DEFAULT: '#6B7280', // Tom médio para textos secundários
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280', // Base
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Cores de estado (mínimas, porém necessárias)
        state: {
          error: '#EF4444',    // Vermelho para erros
          warning: '#F59E0B',  // Âmbar para alertas
          info: '#3B82F6',     // Azul claro para informações
          success: '#10B981',  // Verde para sucesso
          pending: '#8B5CF6',  // Roxo para pendente/aguardando
        }
      },
      // Bordas arredondadas
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      // Espaçamentos customizados para layout consistente
      spacing: {
        // Mantemos os padrões do Tailwind e adicionamos alguns específicos
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Tipografia - sistema minimalista e legível
      fontFamily: {
        sans: [
          'Inter', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
        // Opcionalmente, pode adicionar uma fonte mono para dados tabulares de agendamentos
        mono: [
          'JetBrains Mono', 
          'Menlo', 
          'Monaco', 
          'Consolas', 
          'Liberation Mono', 
          'Courier New', 
          'monospace'
        ]
      },
      // Sombras sutis para elevação de elementos
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Transições suaves
      transitionDuration: {
        DEFAULT: '150ms',
        'fast': '100ms',
        'slow': '300ms',
      }
    },
  },
  plugins: [
    // Plugins futuros podem ser adicionados aqui quando necessário
  ],
  // Modo escuro opcional - pode ser configurado para 'media' (baseado nas preferências do sistema)
  // ou 'class' (controle manual por classe)
  darkMode: 'class',
};