import { JSX, useMemo } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export type Variant = "info" | "success" | "error" | "warning";

export const statusIconMap: Record<Variant, JSX.Element> = {
  info: <Info className="h-6 w-6" />,
  success: <CheckCircle2 className="h-6 w-6" />,
  error: <XCircle className="h-6 w-6" />,
  warning: <AlertTriangle className="h-6 w-6" />,
};

type BasicNotificationProps =
  | {
      title: string;
      description: string;
      variant: Variant;
      icon?: never;
    }
  | {
      title: string;
      description: string;
      icon?: JSX.Element;
      variant?: never;
    };

export const BasicNotificationBody = ({
  title,
  description,
  ...props
}: BasicNotificationProps) => {
  const icon = useMemo(() => {
    if ("variant" in props) {
      return statusIconMap[props.variant ?? "info"];
    }
    return props.icon ?? statusIconMap.info;
  }, [props]);

  return (
    <div className="flex items-center justify-between gap-4 px-2">
      <div className="flex flex-col">
        <span className="text-primary-foreground font-semibold">{title}</span>
        <span className="text-sm">{description}</span>
      </div>
      {icon}
    </div>
  );
};
