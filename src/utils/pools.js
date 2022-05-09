import ETHMainnet_OCEAN_OPFPools from 'metadata/pools/EthMainnet_OCEAN_OPF.csv'
import ETHMainnet_PSDN_H20TeamPools from 'metadata/pools/EthMainnet_PSDN_H2OTeam.csv'
require("dotenv").config();

export const pools = {
    "ETHMainnet_OCEAN_OPFPools": ETHMainnet_OCEAN_OPFPools,
    "ETHMainnet_PSDN_H20TeamPools": ETHMainnet_PSDN_H20TeamPools,
}
