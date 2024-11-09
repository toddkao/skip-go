import { convertHumanReadableAmountToCryptoAmount } from "@/utils/crypto";
import { RouteResponse, RouteConfig, RouteRequest } from "@skip-go/client";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { errorAtom } from "./errorPage";
import { currentPageAtom, Routes } from "./router";
import { skipClient } from "./skipClient";
import {
  sourceAssetAtom,
  destinationAssetAtom,
  swapDirectionAtom,
  debouncedSourceAssetAmountAtom,
  debouncedDestinationAssetAmountAtom,
  isInvertingSwapAtom,
  debouncedSourceAssetAmountValueInitializedAtom,
  debouncedDestinationAssetAmountValueInitializedAtom,
} from "./swapPage";
import { atomEffect } from "jotai-effect";
import { WidgetRouteConfig } from "@/widget/Widget";

export const initializeDebounceValuesEffect = atomEffect((get, set) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const debouncedSourceAssetInitialized = get(debouncedSourceAssetAmountValueInitializedAtom);
  const debouncedDestinationAssetInitialized = get(debouncedDestinationAssetAmountValueInitializedAtom);

  if (sourceAsset?.amount && !debouncedSourceAssetInitialized) {
    set(debouncedSourceAssetAmountAtom, sourceAsset.amount);
  }

  if (destinationAsset?.amount && !debouncedDestinationAssetInitialized) {
    set(debouncedDestinationAssetAmountAtom, destinationAsset.amount);
  }
});

const skipRouteRequestAtom = atom<RouteRequest | undefined>((get) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const direction = get(swapDirectionAtom);
  const sourceAssetAmount = get(debouncedSourceAssetAmountAtom);
  const destinationAssetAmount = get(debouncedDestinationAssetAmountAtom);

  get(initializeDebounceValuesEffect);

  if (
    !sourceAsset?.chainID ||
    !sourceAsset.denom ||
    !destinationAsset?.chainID ||
    !destinationAsset.denom
  ) {
    return undefined;
  }
  const amount =
    direction === "swap-in"
      ? {
        amountIn: convertHumanReadableAmountToCryptoAmount(
          sourceAssetAmount ?? "0",
          sourceAsset.decimals
        ),
      }
      : {
        amountOut: convertHumanReadableAmountToCryptoAmount(
          destinationAssetAmount ?? "0",
          destinationAsset.decimals
        ),
      };

  return {
    ...amount,
    sourceAssetChainID: sourceAsset.chainID,
    sourceAssetDenom: sourceAsset.denom,
    destAssetChainID: destinationAsset.chainID,
    destAssetDenom: destinationAsset.denom,
  };
});

type CaughtRouteError = {
  isError: boolean;
  error: unknown;
};

export const routeConfigAtom = atom<WidgetRouteConfig>({
  experimentalFeatures: ["hyperlane"],
  allowMultiTx: true,
  allowUnsafe: true,
  smartSwapOptions: {
    splitRoutes: true,
    evmSwaps: true,
  },
});

export const convertWidgetRouteConfigToClientRouteConfig = (params: WidgetRouteConfig): RouteConfig => {
  return {
    ...params,
    swapVenues: params.swapVenues?.map((venue) => ({
      ...venue,
      chainID: venue.chainId,
    })),
    swapVenue: params.swapVenue && {
      ...params.swapVenue,
      chainID: params.swapVenue.chainId,
    },
  };
}

export const convertClientRouteConfigToWidgetRouteConfig = (params: RouteConfig): WidgetRouteConfig => {
  return {
    ...params,
    swapVenues: params.swapVenues?.map((venue) => ({
      ...venue,
      chainId: venue.chainID,
    })),
    swapVenue: params.swapVenue && {
      ...params.swapVenue,
      chainId: params.swapVenue.chainID,
    },
  };
}

export const _skipRouteAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const params = get(skipRouteRequestAtom);
  const currentPage = get(currentPageAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);
  const error = get(errorAtom);
  const skipRouteConfig = get(routeConfigAtom);

  const queryEnabled =
    params !== undefined &&
    (Number(params.amountIn) > 0 || Number(params.amountOut) > 0) &&
    !isInvertingSwap &&
    currentPage === Routes.SwapPage &&
    error === undefined;

  return {
    queryKey: ["skipRoute", params],
    queryFn: async (): Promise<CaughtRouteError | RouteResponse> => {
      if (!params) {
        throw new Error("No route request provided");
      }
      try {
        const _skipRouteConfig = convertWidgetRouteConfigToClientRouteConfig(skipRouteConfig);
        const response = await skip.route({
          ...params,
          smartRelay: true,
          ..._skipRouteConfig,
        });
        return response;
      } catch (error) {
        return {
          isError: true,
          error,
        };
      }
    },
    retry: 1,
    enabled: queryEnabled,
    refetchInterval: 1000 * 30,
  };
});

export const skipRouteAtom = atom((get) => {
  const { data, isError, error, isLoading } = get(_skipRouteAtom);
  const caughtError = data as CaughtRouteError;
  const routeResponse = data as RouteResponse;
  if (caughtError?.isError) {
    return {
      data: undefined,
      isError: true,
      error: caughtError.error as Error,
      isLoading: false,
    };
  }
  return {
    data: routeResponse,
    isError,
    error,
    isLoading,
  };
});