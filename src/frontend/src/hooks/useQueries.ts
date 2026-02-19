import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PromotionalOffer, AppliedOffer, Operator } from '@/backend';

export function useBackendHealth() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      if (!actor) return { status: 'disconnected' };
      return { status: 'connected' };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAvailableOffers(operator: Operator | null, rechargeAmount: number | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PromotionalOffer[]>({
    queryKey: ['offers', operator, rechargeAmount],
    queryFn: async () => {
      if (!actor || !operator || !rechargeAmount) return [];
      return actor.getAvailableOffers(operator, BigInt(rechargeAmount));
    },
    enabled: !!actor && !isFetching && !!operator && !!rechargeAmount,
  });
}

export function useApplyOffer() {
  const { actor } = useActor();

  return useMutation<AppliedOffer | null, Error, { offerId: bigint; rechargeAmount: number }>({
    mutationFn: async ({ offerId, rechargeAmount }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.applyOffer(offerId, BigInt(rechargeAmount));
    },
  });
}
