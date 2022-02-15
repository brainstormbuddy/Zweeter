import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../../declarations/zweeter";
export default async function handleAuthenticated(authClient: AuthClient) {
    const whoami_actor = createActor(canisterId as string, {
      agentOptions: {
        identity: authClient?.getIdentity(),
      },
    });
    return whoami_actor;
}