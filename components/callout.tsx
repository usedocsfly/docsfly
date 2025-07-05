import { AlertTriangle, CircleCheck, InfoIcon } from "lucide-react";
import { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
  type?: "info" | "warning" | "error" | "success";
  title?: string;
}

export function Callout({ children, type = "info", title }: CalloutProps) {
  const icons = {
    info: <InfoIcon className="mt-0.5 shrink-0 text-blue-500" size={16} />,
    warning: (
      <AlertTriangle className="mt-0.5 shrink-0 text-yellow-500" size={16} />
    ),
    error: (
      <AlertTriangle className="mt-0.5 shrink-0 text-red-500" size={16} />
    ),
    success: (
      <CircleCheck className="mt-0.5 shrink-0 text-green-500" size={16} />
    ),
  };

  return (
    <div className="rounded-md border px-4 pt-3">
      <div className="flex gap-3">
        {icons[type]}
        <div className="grow space-y-1">
          <p className="text-sm font-medium">
            {title || type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
          <p className="text-sm">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
