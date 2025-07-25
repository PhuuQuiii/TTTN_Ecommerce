import jwt from "expo-jwt";


// export const SERVER_BASE_URL = "http://192.168.67.44:3001";
// export const BASE_URL = "http://192.168.67.44:3001";
// export const BASE_URL = "http://192.168.99.37";

// export const SERVER_BASE_URL = "http://10.0.2.2:3001";
// export const BASE_URL = "http://10.0.2.2:3001";

// export const SERVER_BASE_URL = "http://172.20.10.2:3001";
// export const BASE_URL = "http://172.20.10.2:3001";

// export const SERVER_BASE_URL = "http://192.168.2.34:3001";
export const SERVER_BASE_URL = "https://backend-ecommerce-theta-plum.vercel.app";
// export const BASE_URL = "http://192.168.2.34";
export const BASE_URL = "https://backend-ecommerce-theta-plum.vercel.app";

export const getChildCategories = (allCategories, parentCategory) => {
  let newParentCate = [];
  parentCategory.forEach((parentCate) => {
    let parentCategoryElements = { ...parentCate };
    let childCate = [];
    allCategories.forEach((allCate) => {
      if (allCate.parent === parentCate._id) {
        childCate.push(allCate);
      }
    });
    parentCategoryElements.childCate = childCate;
    newParentCate.push(parentCategoryElements);
  });
  return newParentCate;
};

export const nameWithTripleDots = (title = "") => {
  let newtitle = title;
  const splitted = newtitle.split(" ").join("");
  if (splitted.length > 15) {
    const slicedTitle = newtitle.slice(0, 15) + "...";

    return slicedTitle;
  }

  return title;
};

export const isTokenExpired = (token) => {
  if (token) {
    const { exp } = jwt.decode(token, "console.log('signin')");

    if (exp < (new Date().getTime() + 1) / 1000) {
      return true;
    }
    return false;
  }
  return false;
};

export const decodeToken = (token) => {
  const {_id} = jwt.decode(token, "console.log('signin')");
  return _id;
}

export const getDiscountedAmount = (amount, rate) => {
  return Math.ceil(amount - (rate/100)*amount)
  // 120 - 50/100*120
}