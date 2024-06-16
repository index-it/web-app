import { contrastColor } from "../utils/color-utils";

interface IxListCardProps {
  name: string;
  color: string;
  icon: string;
}

export function IxListCard({ name, color, icon }: IxListCardProps) {
  return (
    <div
      className="flex flex-col justify-between rounded-xl p-3 gap-3"
      style={{ backgroundColor: color }}
    >
      <span className="text-xl">
        {icon}
      </span>
      <span style={{ color: contrastColor(color) }}>
        {name}
      </span>
    </div>
  )
}