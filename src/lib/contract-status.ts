import { ContractStatus } from "@prisma/client";

const transitions: Record<ContractStatus, ContractStatus[]> = {
  DRAFT: ["SENT", "ARCHIVED"],
  SENT: ["VIEWED", "SIGNED", "FINALIZED", "ARCHIVED"],
  VIEWED: ["SIGNED", "FINALIZED", "ARCHIVED"],
  SIGNED: ["FINALIZED", "ARCHIVED"],
  FINALIZED: ["ARCHIVED"],
  ARCHIVED: [],
};

export function canTransitionContract(
  from: ContractStatus,
  to: ContractStatus,
) {
  return from === to || transitions[from].includes(to);
}

export function isEditableContract(status: ContractStatus) {
  return status === "DRAFT";
}

export function getContractStatusLabel(status: ContractStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function deriveContractProgress(status: ContractStatus) {
  switch (status) {
    case "DRAFT":
      return "Drafting";
    case "SENT":
      return "Awaiting views";
    case "VIEWED":
      return "In review";
    case "SIGNED":
      return "Awaiting finalization";
    case "FINALIZED":
      return "Locked";
    case "ARCHIVED":
      return "Archived";
  }
}
