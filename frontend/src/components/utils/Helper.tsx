import dayjs from "dayjs";

interface Item {
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
}

export const formatDate = (item: Item): string => {
  const formattedDate = item.createdAt
    ? dayjs(item.createdAt).format("YY-MM-DD-hh:mm")
    : item.created_at
    ? dayjs(item.created_at).format("YY-MM-DD-hh:mm")
    : "N/A";

  return formattedDate;
};

