import { ActorSubclass, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from "react";
import { createActor, canisterId } from "../../declarations/zweeter";
import { _SERVICE } from "../../declarations/zweeter/zweeter.did";
import { clear, get, remove, set } from "local-storage";

type UseAuthClientProps = {};
export function useAuthClient(props?: UseAuthClientProps) {
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [actor, setActor] = useState<ActorSubclass<_SERVICE>>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [actorName, setName] = useState<string>(null);

  const login = () => {
    authClient?.login({
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : process.env.LOCAL_II_CANISTER,
      onSuccess: () => {
        initActor();
        setIsAuthenticated(true);
        setTimeout(() => {
          setHasLoggedIn(true);
        }, 100);
      },
    });
  };

  const initActor = async () => {
    const identity = await authClient?.getIdentity();
    const actor = createActor(canisterId as string, {
      agentOptions: {
        identity
      },
    });
    setActor(actor);
    const user = await actor?.getUser();
    if (user[0]) {
      setName(user[0].name);
    } else setName("");
  };

  const logout = () => {
    clear();
    setIsAuthenticated(false);
    setActor(undefined);
    setHasLoggedIn(false);
    setName(null);
  };

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated();
      setAuthClient(client);
      setIsAuthenticated(true);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      initActor();
      setTimeout(() => {
        setHasLoggedIn(true);
      }, 100);
    }
  }, [isAuthenticated]);

  return {
    authClient,
    setAuthClient,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    actor,
    hasLoggedIn,
    actorName,
    setName,
  };
}
