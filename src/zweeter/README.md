# zweeter

Zweeter is a tweeter clone implemented on the internet computer. The project utilizes the power of the motoko programming language to create canister code that accommodates the data model for the app. It includes a specific version of the internet identity (whose git repository can be found [here](https://github.com/dfinity/internet-identity)). 
The internet identity has been cloned and included in this project deliberately so that a dev can simply fork this complete repository and expect that everything works out of the box. HOWEVER, it should be noted, that the latest version of the Internet Identity can probably have breaking changes compared to the one being used in this project. 

## Prerequisites

Building and running this project locally requires the installation of the following packages:
- Node.js along with npm (v16 LTS is needed, tested with v16.13.2. There are problems reported with v17).
- dfx console tool (here is info on how to get it [here](https://smartcontracts.org/docs/developers-guide/install-upgrade-remove.html)) 
- Execute npm install to locally install all necessary node packages (you need to do this both in src/zweeter as well as in src/internet-identity folders)

## Build and run locally

**BEFORE you can actually build the internet-identity package** please refer [here](https://github.com/dfinity/internet-identity#dependencies) to install all its dependencies! Remember, the scripts **DO NOT TAKE CARE OF THAT.**

There are scripts created and committed in the repository to help you bootstrap the build and deployment of the project.
The initial step is to run npm install and have it locally install all necessary node packages for the application to function properly. Then, he install-local.sh script cleans everything up creating a vanilla environment for you to start working. It starts the dfx environment for you, initializes the internet identity **(BE CAREFUL, it renders all existing local identities useless!)**, it deploys the ledger canister locally and funds the MINTER and the DEFAULT account with ICP tokens. Finally it builds and deploys the rest of the canisters necessary for the project, such as the invoice and the zweeter canister, along with the zweeter_assets (frontend application) canister.
Finally you can start the local instance of the frontend via the npm start command and visit the page on `http://localhost:8080`.

```bash
cd ./src/internet-identity
npm install
cd ..
cd ./src/zweeter
npm install
sh install-local.sh
npm start
```

## Updating canister code and doing dev iterations without losing existing internet identities

There is a second script that supports doing developer iterations (rebuilding and redeploying updated canister code without cleaning up existing internet identities). This script takes for granted that the dfx tool is already running and the internet identity is already deployed locally (which basically happens when you execute the `install-local.sh` for the first time).

```bash
cd ./src/zweeter
sh update-local.sh
npm start
```

## Funding local accounts with ICP and using the tipping functionality

The zweeter app supports using the invoice canister and the ledger canister locally so that zweeter users can send tips in ICP to users that have created zweets. For this to function properly, the default account id of the current principal needs to have been funded with ICP on the local ledger canister. (This step is not necessary in production as there the account id can be funded only externally). The local script `fund-account-id.sh` can be used to transfer funds from the minter or default account towards the account of the currently logged-in principal, so that the latter can use that funds for tipping.

```bash
cd ./src/zweeter
dfx identity use minter
sh fund-account-id.sh <ACCOUNT_ID> <AMOUNT>
```

The `ACCOUNT_ID` can be seen in the GUI of the zweeter application under the `MY ACCOUNT` section. The `<AMOUNT>` is expressed in e8s and describes the amount that the funded account should receive.

Keep in mind that when tipping, a total of 110.000 e8s gets transferred to the creator of the corresponding zweet. In reality though, only 100.000 actually arrives at the destination since 10.000 is used for the transaction fee.
