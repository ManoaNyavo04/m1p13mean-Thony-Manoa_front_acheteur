export interface Product {
  _id: string;
  nomProduit: string;
  prix: number;
  boutique: string;
  nombre: number;
  quantity?: number;
  categorie: {
    _id: string;
    categorie: string;
    __v: number;
  };
}

export interface PaymentInfoData {
  address: string;
  cardNumber: number;
  expirationDate: number;
  cvv: number;
  nameOnCard: string;
}
