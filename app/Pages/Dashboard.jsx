"use client";
import { Carousel } from "antd";

import Header from "../components/Header";
export default function Dashboard() {
  return (
    <>
      <Header />
      <div>
        <Carousel arrows autoplay>
          <div>
            <img src="/assets/carousel/1.jpg" width="100%" />
          </div>

          <div>
            <img src="/assets/carousel/3.jpg" width="100%" />
          </div>
          <div>
            <img src="/assets/carousel/4.jpg" width="100%" />
          </div>
          <div>
            <img src="/assets/carousel/5.jpg" width="100%" />
          </div>
        </Carousel>
      </div>
    </>
  );
}
