import { ActorSubclass } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from "react";
import { createActor, canisterId } from "../../declarations/zweeter";
import {
  createActor as createInvoiceActor,
  canisterId as invoiceCanisterId,
} from "../../declarations/invoice";
import { _SERVICE } from "../../declarations/zweeter/zweeter.did";
import { _SERVICE as _INVOICESERVICE } from "../../declarations/invoice/invoice.did";
import { clear } from "local-storage";
import { Principal } from "@dfinity/principal";
const sha256 = require("sha256");
const Identity = require("@dfinity/identity");
const { Secp256k1KeyIdentity } = Identity;

type UseAuthClientProps = {};
export function useAuthClient(props?: UseAuthClientProps) {
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [actor, setActor] = useState<ActorSubclass<_SERVICE>>();
  const [principal, setPrincipal] = useState<Principal>();
  const [invoiceActor, setInvoiceActor] =
    useState<ActorSubclass<_INVOICESERVICE>>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [actorName, setName] = useState<string>(null);
  const [accountId, setAccountId] = useState<string>(null);

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
    setInvoiceActor(invoiceActor);

    // const accId = await invoiceActor.get_account_id();

    let identifier = await invoiceActor.get_account_identifier({
      token: {
        symbol: "ICP",
      },
      principal: identity.getPrincipal(),
    });
    if ("ok" in identifier) {
      if ("text" in identifier.ok.accountIdentifier) {
        setAccountId(identifier.ok.accountIdentifier.text);
        console.log("ACCOUNT ID: " + identifier.ok.accountIdentifier.text);
      }
    }

    const balance = await invoiceActor.get_balance({
      token: {
        symbol: "ICP",
      },
    });
    if ("ok" in balance) {
      let amount = balance.ok.balance;
      console.log("ACCOUNT HAS: " + amount);
    }
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
    setPrincipal(undefined);
    setHasLoggedIn(false);
    setName(null);
    authClient?.logout();
  };

  const parseIdentity = () => {
    const rawKey: string =
      "MHQCAQEEIIgP2w7Pg+EWpG0Yalpe+8R94INVyYwcdFKeG6C/RbXBoAcGBSuBBAAKoUQDQgAEZolyMLd30sXBvi2HIkf4pBxhPbNlPP9Z6lwC7G71LDowWlgitZd9gzJLNUk14qi4xqPd8ILnEdCcPE+MAxvLig==";

    const rawBuffer = Uint8Array.from(rawKey as any).buffer;

    const privKey = Uint8Array.from(sha256(rawBuffer, { asBytes: true }));

    // Initialize an identity from the secret key
    return Secp256k1KeyIdentity.fromSecretKey(Uint8Array.from(privKey).buffer);
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
    accountId,
    setAccountId,
  };
}
