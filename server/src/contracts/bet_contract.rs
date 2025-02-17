use cosmwasm_std::{entry_point, DepsMut, Env, MessageInfo, Response, StdResult, Uint128};
use crate::state::{Bet, BETS};
use crate::msg::{BetMsg, ExecuteMsg};

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::PlaceBet { amount, prediction } => place_bet(deps, info, amount, prediction),
    }
}

pub fn place_bet(
    deps: DepsMut,
    info: MessageInfo,
    amount: Uint128,
    prediction: String,
) -> StdResult<Response> {
    let bet = Bet {
        user: info.sender.clone(),
        amount,
        prediction,
    };

    BETS.save(deps.storage, info.sender.clone(), &bet)?;

    Ok(Response::new()
        .add_attribute("action", "place_bet")
        .add_attribute("user", info.sender)
        .add_attribute("amount", amount.to_string())
        .add_attribute("prediction", prediction))
}
