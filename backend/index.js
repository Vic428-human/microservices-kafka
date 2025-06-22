import express from "express";
import cors from "cors";
import { processCreditCardPayment, generateCreditCardPaymentInfo, createOrder, pay, sendEmail, logAnalytics } from "./db.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.post("/order", authMiddleware, async (req, res) => {
  const { cart } = req.body;
  const userId = req.userId;
  const paymentInfo = await generateCreditCardPaymentInfo(cart, userId);
  await logAnalytics({ cart, userId }, "第一階段（生成信用卡付款資訊）");
  console.log('第一階段（生成信用卡付款資訊） ==>', paymentInfo);

  const updatedPaymentInfo = await processCreditCardPayment(paymentInfo);
  await logAnalytics({ cart, userId }, "模擬呼叫第三方支付平台確認扣款成功");
  console.log('第二階段（付款）：模擬呼叫第三方支付平台確認扣款成功 ==>', updatedPaymentInfo);
  // const paymentResult = await pay(cart, userId);
  // await logAnalytics({ cart, userId }, "Payment successful");
  // const orderId = await createOrder(cart, userId);
  // await logAnalytics({ orderId, userId }, "Order created");
  // const emailResult = await sendEmail(orderId, userId);
  // await logAnalytics({ orderId, userId, emailResult }, "Email sent");

  // return res.json({ orderId, paymentResult, emailResult });
  
  // 看到每一階段支付的資訊
  return res.json({paymentInfo, updatedPaymentInfo});
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
