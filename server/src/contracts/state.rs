use cosmwasm_std::Addr;
use cw_storage_plus::Map;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Bet {
    pub user: Addr,
    pub amount: Uint128,
    pub prediction: String,
}

pub const BETS: Map<&Addr, Bet> = Map::new("bets");
