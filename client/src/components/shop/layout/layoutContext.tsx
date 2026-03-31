export interface LayoutState {
  navberHamburger: boolean;
  loginSignupModal: boolean;
  loginSignupError: string;
  cartModal: boolean;
  cartProduct: any; 
  singleProductDetail: any;
  inCart: any;
  cartTotalCost: any;
  orderSuccess: boolean;
  loading: boolean;
}

export type LayoutAction =
  | { type: 'hamburgerToggle'; payload: boolean }
  | { type: 'loginSignupModalToggle'; payload: boolean }
  | { type: 'cartModalToggle'; payload: boolean }
  | { type: 'cartProduct'; payload: any }
  | { type: 'singleProductDetail'; payload: any }
  | { type: 'inCart'; payload: any }
  | { type: 'cartTotalCost'; payload: any }
  | { type: 'loginSignupError'; payload: "" }
  | { type: 'orderSuccess'; payload: boolean }
  | { type: 'loading'; payload: boolean };

export const layoutState: LayoutState = {
  navberHamburger: false,
  loginSignupModal: false,
  loginSignupError: "",
  cartModal: false,
  cartProduct: null,
  singleProductDetail: null,
  inCart: null,
  cartTotalCost: null,
  orderSuccess: false,
  loading: false,
};

export const layoutReducer = (state: LayoutState, action: LayoutAction): LayoutState => {
  switch (action.type) {
    case "hamburgerToggle":
      return {
        ...state,
        navberHamburger: action.payload,
      };
    case "loginSignupModalToggle":
      return {
        ...state,
        loginSignupModal: action.payload,
      };
    case "cartModalToggle":
      return {
        ...state,
        cartModal: action.payload,
      };
    case "cartProduct":
      return {
        ...state,
        cartProduct: action.payload,
      };
    case "singleProductDetail":
      return {
        ...state,
        singleProductDetail: action.payload,
      };
    case "inCart":
      return {
        ...state,
        inCart: action.payload,
      };
    case "cartTotalCost":
      return {
        ...state,
        cartTotalCost: action.payload,
      };
    case "loginSignupError":
      return {
        ...state,
        loginSignupError: action.payload,
      };
    case "orderSuccess":
      return {
        ...state,
        orderSuccess: action.payload,
      };
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

