# dfx stop

# #clean up
# cd ..
# rm -rf */.dfx

# cd zweeter
# dfx start --background

# # instantiate II
# cd ..
# cd internet-identity
# II_ENV=development dfx deploy --no-wallet --argument '(null)'

# cd ..
# cd zweeter

# dfx identity new minter
# dfx identity use minter
# export MINT_ACC=$(dfx ledger account-id)

# dfx identity use default
# export LEDGER_ACC=$(dfx ledger account-id)
# export TEST_ACC="cd60093cef12e11d7b8e791448023348103855f682041e93f7d0be451f48118b"

# # Use private api for install
# rm src/ledger/ledger.did
# cp src/ledger/ledger.private.did src/ledger/ledger.did

# dfx deploy ledger --argument '(record {minting_account = "'${MINT_ACC}'"; initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000 } }; record { "'${TEST_ACC}'"; record { e8s=100_000_000_000 } }; }; send_whitelist = vec {}})'

# # Replace with public api
# rm src/ledger/ledger.did
# cp src/ledger/ledger.public.did src/ledger/ledger.did

dfx deploy invoice_mock
dfx deploy invoice
dfx deploy zweeter
dfx deploy zweeter_assets

# dfx canister call ledger transfer '(record {memo=0; amount=record {e8s=110000:nat64}; fee=record {e8s=10000:nat64}; to='$XXX'})'
# dfx canister call ledger transfer '(record {memo=0; amount=record {e8s=110000:nat64}; fee=record {e8s=10000:nat64}; to="dfef5e6f5cfb277ab83f181a30346552bcfe359d92c3f834d912bbe9f02a4ceb"})'
# dfx canister call ledger account_balance '(record { account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$LEDGER_ACC'")]) + "}")')' })'

# export XXX='vec{223;239;94;111;92;251;39;122;184;63;24;26;48;52;101;82;188;254;53;157;146;195;248;52;217;18;187;233;240;42;76;235}'
# $(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$LOGIN_ACC'")]) + "}")')