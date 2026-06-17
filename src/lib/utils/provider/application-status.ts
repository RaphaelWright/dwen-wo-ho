export const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "PENDING":
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};
