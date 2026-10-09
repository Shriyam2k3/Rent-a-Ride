export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateRentalDays(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Reset time to ensure accurate calendar day calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Confirmed",
      };
    case "pending":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Pending",
      };
    case "completed":
      return {
        bg: "bg-teal-50 text-teal-700 border-teal-200",
        label: "Completed",
      };
    case "cancelled":
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        label: "Cancelled",
      };
    case "paid":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Paid",
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-700 border-slate-200",
        label: status,
      };
  }
}
