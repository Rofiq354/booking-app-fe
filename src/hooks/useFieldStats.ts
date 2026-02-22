import { useState, useEffect } from "react";
import api from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface LastBooking {
  time: string;
  fieldName: string;
  userName: string;
  timeRelative: string;
}

interface FieldStats {
  slotsToday: number;
  lastBooking: LastBooking | null;
  globalRating: string;
  avatars: { label: string }[];
  totalPlayers: number;
  loading: boolean;
}

export const useFieldStats = () => {
  // 2. Gunakan interface tersebut di useState
  const [stats, setStats] = useState<FieldStats>({
    slotsToday: 0,
    lastBooking: null,
    globalRating: "0.0",
    avatars: [],
    totalPlayers: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/hero");
        const d = res.data.data;

        setStats({
          slotsToday: d.slotsToday,
          globalRating: d.globalRating,
          avatars: d.avatars,
          totalPlayers: d.totalPlayers,
          lastBooking: d.lastBooking
            ? {
                time: d.lastBooking.time,
                fieldName: d.lastBooking.fieldName,
                userName: d.lastBooking.userName,
                timeRelative: formatDistanceToNow(
                  new Date(d.lastBooking.time),
                  { addSuffix: true, locale: id },
                ),
              }
            : null,
          loading: false,
        });
      } catch (error) {
        console.error(error);
        setStats((p) => ({ ...p, loading: false }));
      }
    };
    fetchStats();
  }, []);

  return stats;
};
