interface IxListCardProps {
  name: string;
  color: string;
  icon: string;
}

export function IxListCard({ name, color, icon }: IxListCardProps) {
  return (
    <div className="flex flex-col justify-between">
      <span>
        {icon}
      </span>
      <span>
        {name}
      </span>
    </div>
  )
}