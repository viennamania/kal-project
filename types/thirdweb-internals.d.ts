declare module "../node_modules/thirdweb/dist/esm/contract/deployment/deploy-via-autofactory.js" {
  export function deployViaAutoFactory(options: Record<string, unknown>): Promise<string>;
}

declare module "../node_modules/thirdweb/dist/esm/contract/deployment/utils/bootstrap.js" {
  export function getOrDeployInfraContract(
    options: Record<string, unknown>
  ): Promise<{ address: string }>;
}

declare module "../node_modules/thirdweb/dist/esm/extensions/prebuilts/__generated__/TokenERC20/write/initialize.js" {
  export function initialize(options: Record<string, unknown>): unknown;
}
