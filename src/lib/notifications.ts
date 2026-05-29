export function logSigningInvitation(payload: { email: string; link: string; contractId: string }) {
  process.stdout.write(`${JSON.stringify({ type: "signing_invitation", ...payload })}
`);
}
