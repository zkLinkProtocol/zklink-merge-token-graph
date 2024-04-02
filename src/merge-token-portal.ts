import {
  DepositToMerge as DepositToMergeEvent,
  WithdrawFromMerge as WithdrawFromMergeEvent
} from "../generated/mergeTokenPortal/mergeTokenPortal";
import {
  DepositToMerge,
  WithdrawFromMerge
} from "../generated/schema";
import { Balance, TotalBalance } from "../generated/schema";
import { BigInt, Bytes, crypto } from "@graphprotocol/graph-ts";

const BIGINT_ZERO = BigInt.fromI32(0);
export function handleDepositToMerge(event: DepositToMergeEvent): void {
  let entity = new DepositToMerge(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sourceToken = event.params.sourceToken
  entity.mergeToken = event.params.mergeToken
  entity.sender = event.params.sender
  entity.amount = event.params.amount  
  entity.receiver = event.params.receiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  const totalBalance = loadOrCreateTotalBalance(entity.sourceToken, entity.mergeToken);
  totalBalance.sourceToken = entity.sourceToken;
  totalBalance.mergeToken = entity.mergeToken;
  const balance = loadOrCreateBalance(entity.sourceToken, entity.mergeToken, entity.blockTimestamp, totalBalance.totalBalance);
  balance.sourceToken = entity.sourceToken;
  balance.mergeToken = entity.mergeToken;
  balance.balance = balance.balance.plus(entity.amount);
  totalBalance.totalBalance = totalBalance.totalBalance.plus(entity.amount);
  balance.save();
  entity.save();
  totalBalance.save();
  }

export function handleWithdrawFromMerge(event: WithdrawFromMergeEvent): void {
  let entity = new WithdrawFromMerge(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sourceToken = event.params.sourceToken
  entity.mergeToken = event.params.mergeToken
  entity.sender = event.params.sender
  entity.amount = event.params.amount
  entity.receiver = event.params.receiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  const totalBalance = loadOrCreateTotalBalance(entity.sourceToken, entity.mergeToken);
  totalBalance.sourceToken = entity.sourceToken;
  totalBalance.mergeToken = entity.mergeToken;
  const balance = loadOrCreateBalance(entity.sourceToken, entity.mergeToken, entity.blockTimestamp, totalBalance.totalBalance);
  balance.sourceToken = entity.sourceToken;
  balance.mergeToken = entity.mergeToken;
  balance.balance = balance.balance.div(entity.amount);
  totalBalance.totalBalance = totalBalance.totalBalance.div(entity.amount);
  balance.save();
  entity.save();
  totalBalance.save();
}

export function loadOrCreateBalance(sourceToken: Bytes, mergeToken: Bytes, blockTimestamp: BigInt, initBalance: BigInt): Balance {
  sourceToken = toLowerCase(sourceToken);
  mergeToken = toLowerCase(mergeToken);
  const id = Bytes.fromByteArray(
    crypto.keccak256(sourceToken.concat(mergeToken).concat(Bytes.fromByteArray(Bytes.fromBigInt(blockTimestamp))))
  );
  let balance = Balance.load(id);
  //balance == null && initClass == BigInt.fromString("1")
  if (!balance) {
    balance = new Balance(id);
    balance.sourceToken = sourceToken;
    balance.balance = initBalance;
    balance.mergeToken = mergeToken;
    balance.blockTimestamp = blockTimestamp;
    balance.save();
  } 
  //return <Balance> balance;
  return balance;
}

export function loadOrCreateTotalBalance(sourceToken: Bytes, mergeToken: Bytes): TotalBalance {
  sourceToken = toLowerCase(sourceToken);
  mergeToken = toLowerCase(mergeToken);
  const id = Bytes.fromByteArray(
    crypto.keccak256(sourceToken.concat(mergeToken))
  );
  let totalBalance = TotalBalance.load(id);

  if (!totalBalance) {
    totalBalance = new TotalBalance(id);
    totalBalance.sourceToken = sourceToken;
    totalBalance.totalBalance = BIGINT_ZERO;
    totalBalance.mergeToken = mergeToken;
    totalBalance.save();
  }
  return totalBalance;
}

export function toLowerCase(address: Bytes): Bytes {
  return Bytes.fromHexString(address.toHexString().toLowerCase());
}


