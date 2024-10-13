export interface IPromotionsOffer {
  id?: string;
  offers: PromotionsTitle[];
}

export interface PromotionsTitle {
  id?: string;
  promotionsTitleId: string;
  promotionsTitle: IPromotionsOffer;
}
