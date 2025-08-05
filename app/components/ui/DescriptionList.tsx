type Props = {
  children?: React.ReactNode;
  className?: string;
};

const Label = ({ children }: { children: React.ReactNode }) => {
  return <dt className="font-bold">{children}</dt>;
};

const Value = ({ children }: { children: React.ReactNode }) => {
  return <dd className="mb-4 last:mb-0">{children}</dd>;
};

const DescriptionListComponent = ({ children, className }: Props) => {
  return <dl className={className}>{children}</dl>;
};

DescriptionListComponent.Label = Label;
DescriptionListComponent.Value = Value;

export const DescriptionList = DescriptionListComponent;
