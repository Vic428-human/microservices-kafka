import { v4 as uuidv4 } from "uuid";


// 第一階段（生成信用卡付款資訊）
export const generateCreditCardPaymentInfo = async (cart, userId) => {
  // console.log('第一階段（生成信用卡付款資訊） ==>', cart, userId);
  const curPrice =  cart[0].price;
  const currency =  cart[0].name;
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);

  // 假設已經把付款資訊存在DB中，模擬生成信用卡付款資訊，提供給下一支funcion使用
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        userId, // 使用者ID
        currency, // 貨幣類型 
        price: curPrice,  // 當下價格
        paymentUnit: "USD", // 假設支付單位為美元
        paymentMethod: "credit_card", // 付款方式
        totalAmount, // 總金額
        status: "pending", // 尚未付款
        createdAt: new Date() // 建立時間
      });
    }, 1000);
  });

  return promise;
};

// 第二階段（付款）：模擬呼叫第三方支付平台確認扣款成功
export const processCreditCardPayment = (paymentInfo) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 假設第三方支付平台回傳成功 : 在實際情況中，這裡會呼叫第三方支付API進行付款處理
      // 這裡模擬付款成功的情況
      const isPaymentSuccessful = true;

      if (isPaymentSuccessful) {
        console.log("=====  💳 信用卡支付成功 =====");
        const updatedPaymentInfo = {
          ...paymentInfo,
          status: "paid",
          paidAt: new Date(),
        };
        resolve(updatedPaymentInfo);
      } else {
        reject(new Error("❌  信用卡支付失敗 "));
      }
    }, 1000);
  });
};


export const pay = async (cart, userId) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("success");
    }, 3000);
  });

  return promise;
};

export const createOrder = async (cart, userId) => {
  const id = uuidv4();

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(id);
    }, 3000);
  });

  return promise;
};

export const sendEmail = async (orderId, userId, emailResult) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("success");
      // reject(new Error("Email failed"))
    }, 3000);
  });

  return promise;
};

export const logAnalytics = async (data, message) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("當前步驟: ", message);
      resolve("success");
    }, 1000);
  });

  return promise;
};