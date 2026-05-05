import { useState } from "react";
import Tabs from "../components/jualbeli/Tabs";
import StepCard from "../components/jualbeli/StepCard";
import Gallery from "../components/jualbeli/Gallery";
import { tabData } from "../components/data/jualBeliData";

export default function JualBeli() {
    const [activeTab, setActiveTab] = useState("jual");

    const data = tabData[activeTab];

    return (
        <>
            <section className="text-center py-20 bg-gray-50">
                <h1 className="text-4xl font-bold">
                    Solusi Laptop Lama Kamu <br />
                    <span className="text-primary">Jadi Cuan di Solit 03</span>
                </h1>
            </section>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <StepCard
                title={data.title}
                desc={data.desc}
                steps={data.steps}
            />

            <div className="text-center mb-10">
                <button className="border border-primary px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition">
                    Hubungi Admin
                </button>
            </div>

            <Gallery images={data.images} />
        </>
    );
}