"use client"
import Pay from "@/components/Pay";
import { Minus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        // 格式化成 cart 的格式
        const formatted = [{
          id: json.id || 3,
          name: `${json.name} (${json.symbol.toUpperCase()})`,
          price: json.market_data.current_price.usd,
          image: json.image.large,
          description: json.description?.en || "",
        }];
        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤：{error}</div>;
  if (!data) return null;

  return (
    <div className="mb-16">
      <h1 className="text-2xl font-bold">穩定幣現價</h1>
      <div></div>
      <div className="flex flex-col lg:flex-row justify-between gap-16 mt-16">
        <div className="flex flex-col gap-16 w-full lg:w-2/3">
          {data.map((item) => (
            <div key={item.id} className="flex gap-4">
              {item.image && (
                <div
                  className="relative"
                  style={{
                    width: 100,
                    height: 100,
                    minWidth: 100,
                    minHeight: 100,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    sizes="100px"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    ${item.price.toFixed(2)}
                  </h2>
                  <div className="flex items-center gap-1 bg-red-100 rounded-md p-1">
                    <Minus className="w-2 h-2 text-red-300" />
                    <span className="text-[10px] text-red-300">Remove</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <Pay cart={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
