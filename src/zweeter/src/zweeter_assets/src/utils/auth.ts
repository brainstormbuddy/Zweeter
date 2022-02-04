import { canisterId, createActor } from "../../../declarations/whoami";
import { AuthClient } from "@dfinity/auth-client";
export default async function handleAuthenticated(authClient: AuthClient) {
    const identity = await authClient.getIdentity();
    const whoami_actor = createActor(
        canisterId as string,
        {
        agentOptions: {
            identity,
        },
        }
    );
    return whoami_actor;
}