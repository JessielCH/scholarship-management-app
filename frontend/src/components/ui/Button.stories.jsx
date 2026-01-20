// 1. Importamos TU componente existente
import { Button } from "./Button";

// 2. Configuración General del componente en Storybook
export default {
  title: "UI/Button", // Dónde aparecerá en el menú lateral
  component: Button,
  tags: ["autodocs"], // Crea la documentación automática
  argTypes: {
    // Aquí definimos los "controles" para jugar
    variant: {
      control: "select",
      options: ["primary", "outline", "ghost", "danger"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    onClick: { action: "clicked" }, // Registra cuando haces clic
  },
};

// 3. Creamos las "Variantes" (Las historias)

// Historia A: El botón estándar
export const Primary = {
  args: {
    children: "Guardar Cambios",
    variant: "primary",
  },
};

// Historia B: El botón secundario (borde)
export const Outline = {
  args: {
    children: "Cancelar",
    variant: "outline",
  },
};

// Historia C: Botón de peligro
export const Danger = {
  args: {
    children: "Eliminar Beca",
    className: "bg-red-600 hover:bg-red-700 text-white", // Forzando estilos extra
  },
};

// Historia D: Botón cargando
export const Loading = {
  args: {
    children: "Procesando...",
    disabled: true, // Simulamos que está deshabilitado
  },
};
