import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface PromotionalOffer {
    validityEnd: Time;
    title: string;
    active: boolean;
    discountValue: bigint;
    discountType: DiscountType;
    description: string;
    minRechargeAmount: bigint;
    validityStart: Time;
    maxDiscountCap?: bigint;
    applicableOperators: Array<Operator>;
    offerId: OfferId;
}
export type Operator = string;
export type OfferId = bigint;
export interface AppliedOffer {
    originalAmount: bigint;
    finalAmount: bigint;
    offer: PromotionalOffer;
    discount: bigint;
}
export enum DiscountType {
    percentage = "percentage",
    cashback = "cashback"
}
export interface backendInterface {
    applyOffer(offerId: OfferId, rechargeAmount: bigint): Promise<AppliedOffer | null>;
    createOffer(title: string, description: string, discountType: DiscountType, discountValue: bigint, applicableOperators: Array<Operator>, minRechargeAmount: bigint, maxDiscountCap: bigint | null, validityStart: Time, validityEnd: Time): Promise<OfferId>;
    getAllOffers(): Promise<Array<PromotionalOffer>>;
    getAvailableOffers(operator: Operator, rechargeAmount: bigint): Promise<Array<PromotionalOffer>>;
    getOffer(offerId: OfferId): Promise<PromotionalOffer | null>;
    toggleOfferStatus(offerId: OfferId, isActive: boolean): Promise<boolean>;
    updateOfferValidity(offerId: OfferId, newStart: Time, newEnd: Time): Promise<boolean>;
}
