import { defaultAbiCoder } from '@ethersproject/abi';
import { getCreate2Address } from '@ethersproject/address';
import { keccak256 } from '@ethersproject/solidity';
import { Token } from '@alagunoff/uniswap-sdk-core';
import { FeeAmount } from '../constants';

export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  poolInitCodeHash
}: {
  factoryAddress: string;
  tokenA: Token;
  tokenB: Token;
  fee: FeeAmount;
  poolInitCodeHash: string;
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks
  return getCreate2Address(
    factoryAddress,
    keccak256(
      ['bytes'],
      [
        defaultAbiCoder.encode(
          ['address', 'address', 'uint24'],
          [token0.address, token1.address, fee]
        )
      ]
    ),
    poolInitCodeHash
  );
}
