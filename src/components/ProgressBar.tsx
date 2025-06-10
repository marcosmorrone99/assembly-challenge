type Props = {
  progress: number;
  status: "idle" | "preparing" | "downloading" | "complete" | "error";
};

export function ProgressBar({ progress, status }: Props) {
  const getColor = () => {
    switch (status) {
      case "downloading":
        return "bg-blue-500";
      case "complete":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "preparing":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  if (status === "idle") return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${getColor()}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
