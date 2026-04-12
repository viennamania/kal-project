import { getContract } from "thirdweb";
import type { DeployERC20ContractOptions, ERC20ContractParams } from "thirdweb/deploys";
import { upload } from "thirdweb/storage";
// @ts-expect-error thirdweb does not export this internal helper, but the file exists in the installed package.
import { deployViaAutoFactory } from "../node_modules/thirdweb/dist/esm/contract/deployment/deploy-via-autofactory.js";
// @ts-expect-error thirdweb does not export this internal helper, but the file exists in the installed package.
import { getOrDeployInfraContract } from "../node_modules/thirdweb/dist/esm/contract/deployment/utils/bootstrap.js";
// @ts-expect-error thirdweb does not export this internal helper, but the file exists in the installed package.
import { initialize as initTokenERC20 } from "../node_modules/thirdweb/dist/esm/extensions/prebuilts/__generated__/TokenERC20/write/initialize.js";

const STABLE_CLONE_FACTORY_VERSION = "0.0.2";

type DeployTokenWithStableInfraOptions = Omit<DeployERC20ContractOptions, "type"> & {
  params: ERC20ContractParams;
};

export async function deployTokenWithStableInfra(
  options: DeployTokenWithStableInfraOptions
) {
  const { account, chain, client, params, publisher } = options;

  // thirdweb's latest TWCloneFactory metadata on BSC currently points to a gone bytecode URI.
  // Pinning the factory to 0.0.2 keeps the deploy flow working until upstream metadata is fixed.
  const forwarder = await getOrDeployInfraContract({
    account,
    chain,
    client,
    contractId: "Forwarder",
    publisher
  });

  const cloneFactoryContract = await getOrDeployInfraContract({
    account,
    chain,
    client,
    constructorParams: {
      _trustedForwarder: forwarder.address
    },
    contractId: "TWCloneFactory",
    publisher,
    version: STABLE_CLONE_FACTORY_VERSION
  });

  const implementationContract = await getOrDeployInfraContract({
    account,
    chain,
    client,
    contractId: "TokenERC20",
    publisher
  });

  const contractURI =
    params.contractURI ||
    (await upload({
      client,
      files: [
        {
          description: params.description,
          external_link: params.external_link,
          image: params.image,
          name: params.name,
          social_urls: params.social_urls,
          symbol: params.symbol
        }
      ]
    })) ||
    "";

  const initializeTransaction = initTokenERC20({
    contract: getContract({
      address: implementationContract.address,
      chain,
      client
    }),
    contractURI,
    defaultAdmin: params.defaultAdmin || account.address,
    name: params.name || "",
    platformFeeBps: params.platformFeeBps || 0n,
    platformFeeRecipient: params.platformFeeRecipient || account.address,
    primarySaleRecipient: params.saleRecipient || account.address,
    symbol: params.symbol || "",
    trustedForwarders: params.trustedForwarders || []
  });

  return deployViaAutoFactory({
    account,
    chain,
    client,
    cloneFactoryContract,
    initializeTransaction
  });
}
