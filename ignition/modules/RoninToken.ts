import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RoninTokenModule = buildModule("RoninTokenModule", (m) => {  
    const token = m.contract("RoninToken", []);
    return { token };
  });

  export default RoninTokenModule;