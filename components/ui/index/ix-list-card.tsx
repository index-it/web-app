import { contrastColor } from "../utils/color-utils";

interface IxListCardProps {
  name: string;
  color: string;
  icon: string;
}

export function IxListCard({ name, color, icon }: IxListCardProps) {
  return (
    <div
      className="flex flex-col w-36 h-24 justify-between rounded-xl px-3 py-2 gap-3 hover:opacity-85"
      style={{ backgroundColor: color }}
    >
      <div className="flex justify-between">
        <span className="text-2xl text-ellipsis">
          {icon}
        </span>
      </div>
      <span style={{ color: contrastColor(color) }} className="font-semibold text-nowrap overflow-hidden text-ellipsis">
        {name}
      </span>
    </div>
  )
}