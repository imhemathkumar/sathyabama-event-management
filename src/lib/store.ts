import type { NewODRequest, ODRequest } from "@/lib/types";
import { create } from "zustand";

interface ODStore {
  requests: ODRequest[]
  addRequest: (request: NewODRequest, student: { name: string; id: string }) => void
  updateRequestStatus: (id: string, status: "Approved" | "Rejected") => void
}

export const useODStore = create<ODStore>((set) => ({
 requests: [],
  addRequest: (request, student) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          id: `OD-${String(state.requests.length + 1).padStart(3, "0")}`,
          student,
          ...request,
          status: "Pending",
        },
      ],
    })),
  updateRequestStatus: (id, status) =>
    set((state) => ({
      requests: state.requests.map((request) => (request.id === id ? { ...request, status } : request)),
    })),
}))
