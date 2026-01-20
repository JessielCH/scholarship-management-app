import { Skeleton } from "./Skeleton";

export default {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
};

// Historia 1: Una barra de texto
export const TextLine = {
  args: {
    className: "h-4 w-[250px]",
  },
};

// Historia 2: Un avatar redondo
export const Avatar = {
  args: {
    className: "h-12 w-12 rounded-full",
  },
};

// Historia 3: Una tarjeta grande
export const BigCard = {
  args: {
    className: "h-[200px] w-full rounded-xl",
  },
};
