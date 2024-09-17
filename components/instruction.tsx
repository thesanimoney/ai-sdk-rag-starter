import Features from "@/components/Feature";
import TechnicalDetailsCard from "@/components/tech-details";

function Instruction() {
    return <>
        <div className={'flex flex-row justify-between mb-2 items-center'}>
            <Features/>
        </div>
        <div>
            <TechnicalDetailsCard/>
        </div>
    </>
}

export default Instruction;