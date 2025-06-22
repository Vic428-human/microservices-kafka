"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle, Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Pay = ({ cart }) => {
  const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  const { isPending, isError, mutate, data } = useMutation({
    mutationFn: async (cart) => {
      const startTime = Date.now();
      const response = await axios.post("http://localhost:8000/order", {
        cart,
      });
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      console.log('response ==>', response.data);
      return { ...response, duration };
    },
  });

  // 狀態：是否同意條款
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-blue-50 flex flex-col items-center justify-center gap-4 py-8 rounded-xl shadow">
      <div className="flex flex-col gap-10 w-full items-center text-center">
        <div className="w-full">
          <h1 className="font-bold text-lg mb-2 text-blue-900">購買加密貨幣結帳</h1>
          <p className="text-sm text-gray-600 mb-4">
            請確認下方資訊，完成購買流程。
          </p>
          <div className="border rounded-lg p-4 bg-white flex flex-col items-center text-center">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-2 justify-center">
                <Image src={item.image} alt={item.name} width={32} height={32} className="rounded" />
                <div className="flex flex-col items-center text-center">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-xs text-gray-500">現價：${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-8 mt-6 justify-center">
            <span className="font-thin tracking-wider">總金額</span>
            <span className="text-xl font-bold tracking-widest text-blue-700">${total}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="terms" className="text-center">
            我已閱讀並同意
            <span className="text-blue-400">服務條款</span>
          </label>
        </div>
        <div className="flex items-center gap-2 text-gray-500 justify-center">
          <span className="font-semibold text-sm">付款方式：</span>
          <Image src="/visa.png" alt="card" width={30} height={20} />
          <span className="font-semibold text-xs">**** 3567</span>
          <span className="text-xs text-blue-400">(更換)</span>
        </div>
        <button
          disabled={isPending || !agreed}
          className={`px-5 py-3 text-white rounded-full flex items-center gap-4 w-max cursor-pointer transition-all duration-300 mx-auto
            ${isPending || !agreed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"}
          `}
          onClick={() => mutate(cart)}
        >
          <span className="tracking-wider text-sm">立即購買</span>
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </button>
        {data && (
          <div className="text-green-500 text-sm flex items-center gap-2 justify-center">
            <CheckCircle className="text-green-500" />
            <span>
              購買成功，耗時{" "}
              <span
                className={`font-bold ${
                  data?.duration > 5 ? "text-red-500" : "text-green-500"
                }`}
              >
                {data?.duration}
              </span>{" "}
              秒
            </span>
          </div>
        )}
        {isError && <span className="text-red-500 text-center">交易失敗，請重試！</span>}
      </div>
    </div>
  );
};

export default Pay;
