import Rinkeby_OCEAN_OPFPools from 'metadata/pools/Rinkeby_OCEAN_OPFPools.csv'
import Rinkeby_PSDN_H20TeamPools from 'metadata/pools/Rinkeby_PSDN_H20TeamPools.csv'
import Ropsten_OCEAN_OPFPools from 'metadata/pools/Ropsten_OCEAN_OPFPools.csv'
import Ropsten_PSDN_H20TeamPools from 'metadata/pools/Ropsten_PSDN_H20TeamPools.csv'
require("dotenv").config();

export const pools = {
    "Rinkeby_OCEAN_OPFPools": Rinkeby_OCEAN_OPFPools,
    "Rinkeby_PSDN_H20TeamPools": Rinkeby_PSDN_H20TeamPools,
    "Ropsten_OCEAN_OPFPools": Ropsten_OCEAN_OPFPools,
    "Ropsten_PSDN_H20TeamPools": Ropsten_PSDN_H20TeamPools,
}
