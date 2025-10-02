// Importações necessárias
import Toast, { type PluginOptions, POSITION } from 'vue-toastification';
// Importando estilos
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  // Opções de configuração
  const options: PluginOptions = {
    // Opções padrão do toast
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    toastClassName: "custom-toast-class",
    // Customização das cores para corresponder ao sistema de design
    toastDefaults: {
      // Customizando estilos por tipo
      success: {
        toastClassName: "toast-success",
        icon: true
      },
      error: {
        toastClassName: "toast-error",
        icon: true
      },
      warning: {
        toastClassName: "toast-warning",
        icon: true
      },
      info: {
        toastClassName: "toast-info",
        icon: true
      },
    }
  };

  // Registrando o plugin
  nuxtApp.vueApp.use(Toast, options);
});