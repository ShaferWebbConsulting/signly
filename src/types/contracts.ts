import { type ContractStatus, type SignatureType, type SignerRole, type SignerStatus } from "@prisma/client";

export type ContractVariable = {
  id: string;
  key: string;
  value: string;
};

export type ParticipantFormValue = {
  id?: string;
  name: string;
  email: string;
  role: SignerRole;
  signingOrder: number;
  status?: SignerStatus;
};

export type SignaturePayload = {
  type: SignatureType;
  data: string;
};

export type ContractSummary = {
  id: string;
  title: string;
  description: string | null;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
  finalizedAt: Date | null;
  participantsCount?: number;
};
