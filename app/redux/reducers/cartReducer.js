let defaultState = {
  selectedItems: {
    items: [],
    restaurantName: "",
    total: 0,
  },
};

let cartReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      let newState = { ...state }; //a copy of the original state

      //If checkbox value is true ADD
      if (action.payload.checkboxValue) {
        console.log("ADD TO CART");

        newState.selectedItems = {
          items: [...newState.selectedItems.items, action.payload],
          restaurantName: action.payload.restaurantName,
        };
      } else {
        //If checkbox value is false REMOVE
        console.log("REMOVE FROM CART");

        newState.selectedItems = {
          items: [
            ...newState.selectedItems.items.filter(
              (item) => item.title !== action.payload.title
            ),
          ],
          restaurantName: action.payload.restaurantName,
        };
      }
      console.log(newState, "👉"); //:right to create the emoji
      return newState;
    }

    default:
      return state;
  }
};

export default cartReducer;
