import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";

actor {
  type Operator = Text;
  type OfferId = Nat;

  type DiscountType = {
    #percentage;
    #cashback;
  };

  type PromotionalOffer = {
    offerId : OfferId;
    title : Text;
    description : Text;
    discountType : DiscountType;
    discountValue : Nat;
    applicableOperators : [Operator];
    minRechargeAmount : Nat;
    maxDiscountCap : ?Nat;
    validityStart : Time.Time;
    validityEnd : Time.Time;
    active : Bool;
  };

  let offerStorage = Map.empty<OfferId, PromotionalOffer>();
  var nextOfferId : OfferId = 1;

  func compareOffersByDiscount(a : PromotionalOffer, b : PromotionalOffer) : Order.Order {
    Nat.compare(b.discountValue, a.discountValue);
  };

  public shared ({ caller }) func createOffer(
    title : Text,
    description : Text,
    discountType : DiscountType,
    discountValue : Nat,
    applicableOperators : [Operator],
    minRechargeAmount : Nat,
    maxDiscountCap : ?Nat,
    validityStart : Time.Time,
    validityEnd : Time.Time,
  ) : async OfferId {
    let offerId = nextOfferId;
    nextOfferId += 1;

    let newOffer : PromotionalOffer = {
      offerId;
      title;
      description;
      discountType;
      discountValue;
      applicableOperators;
      minRechargeAmount;
      maxDiscountCap;
      validityStart;
      validityEnd;
      active = true;
    };

    offerStorage.add(offerId, newOffer);
    offerId;
  };

  public shared ({ caller }) func toggleOfferStatus(offerId : OfferId, isActive : Bool) : async Bool {
    switch (offerStorage.get(offerId)) {
      case (null) { false };
      case (?offer) {
        let updatedOffer = { offer with active = isActive };
        offerStorage.add(offerId, updatedOffer);
        true;
      };
    };
  };

  public query ({ caller }) func getAvailableOffers(operator : Operator, rechargeAmount : Nat) : async [PromotionalOffer] {
    let currentTime = Time.now();

    let validOffers = offerStorage.values().toArray().filter(
      func(offer) {
        offer.active and
        currentTime >= offer.validityStart and
        currentTime <= offer.validityEnd and
        offer.minRechargeAmount <= rechargeAmount and
        offer.applicableOperators.find(func(o) { o == operator }) != null
      }
    );

    validOffers.sort(
      compareOffersByDiscount
    );
  };

  type AppliedOffer = {
    offer : PromotionalOffer;
    originalAmount : Nat;
    discount : Nat;
    finalAmount : Nat;
  };

  public query ({ caller }) func applyOffer(offerId : OfferId, rechargeAmount : Nat) : async ?AppliedOffer {
    let currentTime = Time.now();

    switch (offerStorage.get(offerId)) {
      case (null) { null };
      case (?offer) {
        if (
          not offer.active or
          currentTime < offer.validityStart or
          currentTime > offer.validityEnd or
          offer.minRechargeAmount > rechargeAmount
        ) {
          return null;
        };

        var discount = switch (offer.discountType) {
          case (#percentage) {
            (rechargeAmount * offer.discountValue) / 100;
          };
          case (#cashback) { offer.discountValue };
        };

        discount := switch (offer.maxDiscountCap) {
          case (null) { discount };
          case (?cap) {
            if (discount > cap) { cap } else {
              discount;
            };
          };
        };

        let appliedOffer : AppliedOffer = {
          offer;
          originalAmount = rechargeAmount;
          discount;
          finalAmount = if (rechargeAmount > discount) {
            rechargeAmount - discount;
          } else { 0 };
        };

        ?appliedOffer;
      };
    };
  };

  public shared ({ caller }) func updateOfferValidity(offerId : OfferId, newStart : Time.Time, newEnd : Time.Time) : async Bool {
    switch (offerStorage.get(offerId)) {
      case (null) { false };
      case (?offer) {
        let updatedOffer = {
          offer with
          validityStart = newStart;
          validityEnd = newEnd;
        };
        offerStorage.add(offerId, updatedOffer);
        true;
      };
    };
  };

  public query ({ caller }) func getAllOffers() : async [PromotionalOffer] {
    offerStorage.values().toArray();
  };

  public query ({ caller }) func getOffer(offerId : OfferId) : async ?PromotionalOffer {
    offerStorage.get(offerId);
  };
};
