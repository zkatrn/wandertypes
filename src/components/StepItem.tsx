type StepItemProps = {
  number: number;
  title: string;
  description: string;
};

export function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-stone-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
        <p className="text-stone-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
