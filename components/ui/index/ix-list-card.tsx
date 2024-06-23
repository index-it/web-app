import { contrastColor } from "../utils/color-utils";

interface IxListCardProps {
  name: string;
  color: string;
  icon: string;
}

export function IxListCard({ name, color, icon }: IxListCardProps) {
  return (
    <div
      className="flex flex-col w-36 justify-between rounded-xl p-3 gap-3 hover:opacity-85"
      style={{ backgroundColor: color }}
    >
      <div className="flex justify-between">
        <span className="text-xl text-ellipsis">
          {icon}
        </span>
      </div>
      <span style={{ color: contrastColor(color) }}>
        {name}
      </span>
    </div>
  )
}