import { PricingTable } from "@clerk/nextjs";
import Header from "../_components/Header";

const Pricing = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col mt-10 max-w-3xl mx-auto">
        <h2 className="font-bold text-center text-3xl my-5">Pricing</h2>
        <PricingTable />
      </div>
    </>
  );
};

export default Pricing;
