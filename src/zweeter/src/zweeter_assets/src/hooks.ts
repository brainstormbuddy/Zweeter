import { ActorSubclass } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from "react";
import { createActor, canisterId } from "../../declarations/zweeter";
import {
  createActor as createInvoiceActor,
  canisterId as invoiceCanisterId,
} from "../../invoice_canister/test/e2e/src/declarations/invoice";
import { _SERVICE } from "../../declarations/zweeter/zweeter.did";
import { _SERVICE as _INVOICESERVICE } from "../../invoice_canister/test/e2e/src/declarations/invoice/invoice.did";
import { clear } from "local-storage";

type UseAuthClientProps = {};
export function useAuthClient(props?: UseAuthClientProps) {
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [actor, setActor] = useState<ActorSubclass<_SERVICE>>();
  const [invoiceActor, setInvoiceActor] =
    useState<ActorSubclass<_INVOICESERVICE>>();
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
        identity,
      },
    });
    setActor(actor);
    setUser(actor);
    const invoiceActor = createInvoiceActor(invoiceCanisterId as string, {
      agentOptions: {
        identity,
      },
    });
    console.log(invoiceActor);
    setInvoiceActor(invoiceActor);
  };

  const setUser = async (actor) => {
    setHasLoggedIn(true);
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
    authClient?.logout();
  };

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated();
      setAuthClient(client);
      setIsAuthenticated(isAuthenticated);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      initActor();
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
    invoiceActor,
    hasLoggedIn,
    actorName,
    setName,
  };
}
