/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { ERC777 } from "../ERC777";

export class ERC777__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    defaultOperators: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC777> {
    return super.deploy(
      name,
      symbol,
      defaultOperators,
      overrides || {}
    ) as Promise<ERC777>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    defaultOperators: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name,
      symbol,
      defaultOperators,
      overrides || {}
    );
  }
  attach(address: string): ERC777 {
    return super.attach(address) as ERC777;
  }
  connect(signer: Signer): ERC777__factory {
    return super.connect(signer) as ERC777__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC777 {
    return new Contract(address, _abi, signerOrProvider) as ERC777;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "defaultOperators",
        type: "address[]",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenHolder",
        type: "address",
      },
    ],
    name: "AuthorizedOperator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "Burned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "Minted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenHolder",
        type: "address",
      },
    ],
    name: "RevokedOperator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "Sent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "authorizeOperator",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "tokenHolder",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "defaultOperators",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "granularity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenHolder",
        type: "address",
      },
    ],
    name: "isOperatorFor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "operatorBurn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "operatorData",
        type: "bytes",
      },
    ],
    name: "operatorSend",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "revokeOperator",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "send",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200239238038062002392833981810160405260608110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82516401000000008111828201881017156200008957600080fd5b82525081516020918201929091019080838360005b83811015620000b85781810151838201526020016200009e565b50505050905090810190601f168015620000e65780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200010a57600080fd5b9083019060208201858111156200012057600080fd5b82516401000000008111828201881017156200013b57600080fd5b82525081516020918201929091019080838360005b838110156200016a57818101518382015260200162000150565b50505050905090810190601f168015620001985780820380516001836020036101000a031916815260200191505b5060405260200180516040519392919084640100000000821115620001bc57600080fd5b908301906020820185811115620001d257600080fd5b8251866020820283011164010000000082111715620001f057600080fd5b82525081516020918201928201910280838360005b838110156200021f57818101518382015260200162000205565b50505050919091016040525050845162000243925060029150602086019062000406565b5081516200025990600390602085019062000406565b5080516200026f9060049060208401906200048b565b5060005b600454811015620002cf57600160056000600484815481106200029257fe5b6000918252602080832091909101546001600160a01b031683528201929092526040019020805460ff191691151591909117905560010162000273565b50604080516a22a9219b9b9baa37b5b2b760a91b8152815190819003600b0181206329965a1d60e01b82523060048301819052602483019190915260448201529051731820a4b7618bde71dce8cdc73aab6c95905fad24916329965a1d91606480830192600092919082900301818387803b1580156200034e57600080fd5b505af115801562000363573d6000803e3d6000fd5b5050604080516922a92199182a37b5b2b760b11b8152815190819003600a0181206329965a1d60e01b82523060048301819052602483019190915260448201529051731820a4b7618bde71dce8cdc73aab6c95905fad2493506329965a1d9250606480830192600092919082900301818387803b158015620003e457600080fd5b505af1158015620003f9573d6000803e3d6000fd5b5050505050505062000538565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200044957805160ff191683800117855562000479565b8280016001018555821562000479579182015b82811115620004795782518255916020019190600101906200045c565b5062000487929150620004f1565b5090565b828054828255906000526020600020908101928215620004e3579160200282015b82811115620004e357825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190620004ac565b506200048792915062000511565b6200050e91905b80821115620004875760008155600101620004f8565b90565b6200050e91905b80821115620004875780546001600160a01b031916815560010162000518565b611e4a80620005486000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c8063959b8c3f116100a2578063d95b637111610071578063d95b63711461052a578063dd62ed3e14610558578063fad8b32a14610586578063fc673c4f146105ac578063fe9d9303146106ea57610116565b8063959b8c3f1461041757806395d89b411461043d5780639bd9bbc614610445578063a9059cbb146104fe57610116565b806323b872dd116100e957806323b872dd1461024a578063313ce56714610280578063556f0dc71461029e57806362ad1b83146102a657806370a08231146103f157610116565b806306e485381461011b57806306fdde0314610173578063095ea7b3146101f057806318160ddd14610230575b600080fd5b610123610795565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561015f578181015183820152602001610147565b505050509050019250505060405180910390f35b61017b6107f7565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101b557818101518382015260200161019d565b50505050905090810190601f1680156101e25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61021c6004803603604081101561020657600080fd5b506001600160a01b038135169060200135610881565b604080519115158252519081900360200190f35b6102386108a3565b60408051918252519081900360200190f35b61021c6004803603606081101561026057600080fd5b506001600160a01b038135811691602081013590911690604001356108a9565b610288610a2c565b6040805160ff9092168252519081900360200190f35b610238610a31565b6103ef600480360360a08110156102bc57600080fd5b6001600160a01b03823581169260208101359091169160408201359190810190608081016060820135600160201b8111156102f657600080fd5b82018360208201111561030857600080fd5b803590602001918460018302840111600160201b8311171561032957600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050600160201b81111561037b57600080fd5b82018360208201111561038d57600080fd5b803590602001918460018302840111600160201b831117156103ae57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610a36945050505050565b005b6102386004803603602081101561040757600080fd5b50356001600160a01b0316610aa0565b6103ef6004803603602081101561042d57600080fd5b50356001600160a01b0316610abb565b61017b610c07565b6103ef6004803603606081101561045b57600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b81111561048a57600080fd5b82018360208201111561049c57600080fd5b803590602001918460018302840111600160201b831117156104bd57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610c68945050505050565b61021c6004803603604081101561051457600080fd5b506001600160a01b038135169060200135610c9a565b61021c6004803603604081101561054057600080fd5b506001600160a01b0381358116916020013516610d73565b6102386004803603604081101561056e57600080fd5b506001600160a01b0381358116916020013516610e15565b6103ef6004803603602081101561059c57600080fd5b50356001600160a01b0316610e40565b6103ef600480360360808110156105c257600080fd5b6001600160a01b0382351691602081013591810190606081016040820135600160201b8111156105f157600080fd5b82018360208201111561060357600080fd5b803590602001918460018302840111600160201b8311171561062457600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050600160201b81111561067657600080fd5b82018360208201111561068857600080fd5b803590602001918460018302840111600160201b831117156106a957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610f8c945050505050565b6103ef6004803603604081101561070057600080fd5b81359190810190604081016020820135600160201b81111561072157600080fd5b82018360208201111561073357600080fd5b803590602001918460018302840111600160201b8311171561075457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610ff2945050505050565b606060048054806020026020016040519081016040528092919081815260200182805480156107ed57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116107cf575b5050505050905090565b60028054604080516020601f60001961010060018716150201909416859004938401819004810282018101909252828152606093909290918301828280156107ed5780601f10610855576101008083540402835291602001916107ed565b820191906000526020600020905b81548152906001019060200180831161086357509395945050505050565b60008061088c611020565b9050610899818585611024565b5060019392505050565b60015490565b60006001600160a01b0383166108f05760405162461bcd60e51b8152600401808060200182810382526024815260200180611d316024913960400191505060405180910390fd5b6001600160a01b0384166109355760405162461bcd60e51b8152600401808060200182810382526026815260200180611daa6026913960400191505060405180910390fd5b600061093f611020565b905061096d8186868660405180602001604052806000815250604051806020016040528060008152506110cb565b610999818686866040518060200160405280600081525060405180602001604052806000815250611313565b6109f385826109ee86604051806060016040528060298152602001611d81602991396001600160a01b03808c166000908152600860209081526040808320938b1683529290522054919063ffffffff61152c16565b611024565b610a2181868686604051806020016040528060008152506040518060200160405280600081525060006115c3565b506001949350505050565b601290565b600190565b610a47610a41611020565b86610d73565b610a825760405162461bcd60e51b815260040180806020018281038252602c815260200180611d55602c913960400191505060405180910390fd5b610a99610a8d611020565b86868686866001611863565b5050505050565b6001600160a01b031660009081526020819052604090205490565b806001600160a01b0316610acd611020565b6001600160a01b03161415610b135760405162461bcd60e51b8152600401808060200182810382526024815260200180611c9f6024913960400191505060405180910390fd5b6001600160a01b03811660009081526005602052604090205460ff1615610b765760076000610b40611020565b6001600160a01b03908116825260208083019390935260409182016000908120918516815292529020805460ff19169055610bbd565b600160066000610b84611020565b6001600160a01b03908116825260208083019390935260409182016000908120918616815292529020805460ff19169115159190911790555b610bc5611020565b6001600160a01b0316816001600160a01b03167ff4caeb2d6ca8932a215a353d0703c326ec2d81fc68170f320eb2ab49e9df61f960405160405180910390a350565b60038054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156107ed5780601f10610855576101008083540402835291602001916107ed565b610c95610c73611020565b610c7b611020565b858585604051806020016040528060008152506001611863565b505050565b60006001600160a01b038316610ce15760405162461bcd60e51b8152600401808060200182810382526024815260200180611d316024913960400191505060405180910390fd5b6000610ceb611020565b9050610d198182868660405180602001604052806000815250604051806020016040528060008152506110cb565b610d45818286866040518060200160405280600081525060405180602001604052806000815250611313565b61089981828686604051806020016040528060008152506040518060200160405280600081525060006115c3565b6000816001600160a01b0316836001600160a01b03161480610dde57506001600160a01b03831660009081526005602052604090205460ff168015610dde57506001600160a01b0380831660009081526007602090815260408083209387168352929052205460ff16155b80610e0e57506001600160a01b0380831660009081526006602090815260408083209387168352929052205460ff165b9392505050565b6001600160a01b03918216600090815260086020908152604080832093909416825291909152205490565b610e48611020565b6001600160a01b0316816001600160a01b03161415610e985760405162461bcd60e51b8152600401808060200182810382526021815260200180611cc36021913960400191505060405180910390fd5b6001600160a01b03811660009081526005602052604090205460ff1615610f0457600160076000610ec7611020565b6001600160a01b03908116825260208083019390935260409182016000908120918616815292529020805460ff1916911515919091179055610f42565b60066000610f10611020565b6001600160a01b03908116825260208083019390935260409182016000908120918516815292529020805460ff191690555b610f4a611020565b6001600160a01b0316816001600160a01b03167f50546e66e5f44d728365dc3908c63bc5cfeeab470722c1677e3073a6ac294aa160405160405180910390a350565b610f9d610f97611020565b85610d73565b610fd85760405162461bcd60e51b815260040180806020018281038252602c815260200180611d55602c913960400191505060405180910390fd5b610fec610fe3611020565b8585858561192e565b50505050565b61101c610ffd611020565b611005611020565b84846040518060200160405280600081525061192e565b5050565b3390565b6001600160a01b0382166110695760405162461bcd60e51b8152600401808060200182810382526023815260200180611df36023913960400191505060405180910390fd5b6001600160a01b03808416600081815260086020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6040805163555ddc6560e11b81526001600160a01b03871660048201527f29ddb589b1fb5fc7cf394961c1adf5f8c6454761adf795e67fe149f658abe89560248201529051600091731820a4b7618bde71dce8cdc73aab6c95905fad249163aabbb8ca91604480820192602092909190829003018186803b15801561114f57600080fd5b505afa158015611163573d6000803e3d6000fd5b505050506040513d602081101561117957600080fd5b505190506001600160a01b0381161561130a57806001600160a01b03166375ab97828888888888886040518763ffffffff1660e01b815260040180876001600160a01b03166001600160a01b03168152602001866001600160a01b03166001600160a01b03168152602001856001600160a01b03166001600160a01b031681526020018481526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561123f578181015183820152602001611227565b50505050905090810190601f16801561126c5780820380516001836020036101000a031916815260200191505b50838103825284518152845160209182019186019080838360005b8381101561129f578181015183820152602001611287565b50505050905090810190601f1680156112cc5780820380516001836020036101000a031916815260200191505b5098505050505050505050600060405180830381600087803b1580156112f157600080fd5b505af1158015611305573d6000803e3d6000fd5b505050505b50505050505050565b61135683604051806060016040528060278152602001611c56602791396001600160a01b038816600090815260208190526040902054919063ffffffff61152c16565b6001600160a01b03808716600090815260208190526040808220939093559086168152205461138b908463ffffffff611b5b16565b600080866001600160a01b03166001600160a01b0316815260200190815260200160002081905550836001600160a01b0316856001600160a01b0316876001600160a01b03167f06b541ddaa720db2b10a4d0cdac39b8d360425fc073085fac19bc82614677987868686604051808481526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561143c578181015183820152602001611424565b50505050905090810190601f1680156114695780820380516001836020036101000a031916815260200191505b50838103825284518152845160209182019186019080838360005b8381101561149c578181015183820152602001611484565b50505050905090810190601f1680156114c95780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a4836001600160a01b0316856001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3505050505050565b600081848411156115bb5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611580578181015183820152602001611568565b50505050905090810190601f1680156115ad5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b6040805163555ddc6560e11b81526001600160a01b03871660048201527fb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b60248201529051600091731820a4b7618bde71dce8cdc73aab6c95905fad249163aabbb8ca91604480820192602092909190829003018186803b15801561164757600080fd5b505afa15801561165b573d6000803e3d6000fd5b505050506040513d602081101561167157600080fd5b505190506001600160a01b0381161561180557806001600160a01b03166223de298989898989896040518763ffffffff1660e01b815260040180876001600160a01b03166001600160a01b03168152602001866001600160a01b03166001600160a01b03168152602001856001600160a01b03166001600160a01b031681526020018481526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561173657818101518382015260200161171e565b50505050905090810190601f1680156117635780820380516001836020036101000a031916815260200191505b50838103825284518152845160209182019186019080838360005b8381101561179657818101518382015260200161177e565b50505050905090810190601f1680156117c35780820380516001836020036101000a031916815260200191505b5098505050505050505050600060405180830381600087803b1580156117e857600080fd5b505af11580156117fc573d6000803e3d6000fd5b50505050611859565b81156118595761181d866001600160a01b0316611bb5565b156118595760405162461bcd60e51b815260040180806020018281038252604d815260200180611ce4604d913960600191505060405180910390fd5b5050505050505050565b6001600160a01b0386166118a85760405162461bcd60e51b8152600401808060200182810382526022815260200180611c346022913960400191505060405180910390fd5b6001600160a01b038516611903576040805162461bcd60e51b815260206004820181905260248201527f4552433737373a2073656e6420746f20746865207a65726f2061646472657373604482015290519081900360640190fd5b6119118787878787876110cb565b61191f878787878787611313565b61130a878787878787876115c3565b6001600160a01b0384166119735760405162461bcd60e51b8152600401808060200182810382526022815260200180611c7d6022913960400191505060405180910390fd5b611982858560008686866110cb565b6119c583604051806060016040528060238152602001611dd0602391396001600160a01b038716600090815260208190526040902054919063ffffffff61152c16565b6001600160a01b0385166000908152602081905260409020556001546119f1908463ffffffff611bf116565b600181905550836001600160a01b0316856001600160a01b03167fa78a9be3a7b862d26933ad85fb11d80ef66b8f972d7cbba06621d583943a4098858585604051808481526020018060200180602001838103835285818151815260200191508051906020019080838360005b83811015611a76578181015183820152602001611a5e565b50505050905090810190601f168015611aa35780820380516001836020036101000a031916815260200191505b50838103825284518152845160209182019186019080838360005b83811015611ad6578181015183820152602001611abe565b50505050905090810190601f168015611b035780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a36040805184815290516000916001600160a01b038716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9181900360200190a35050505050565b600082820183811015610e0e576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b6000813f7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470818114801590611be957508115155b949350505050565b6000610e0e83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525061152c56fe4552433737373a2073656e642066726f6d20746865207a65726f20616464726573734552433737373a207472616e7366657220616d6f756e7420657863656564732062616c616e63654552433737373a206275726e2066726f6d20746865207a65726f20616464726573734552433737373a20617574686f72697a696e672073656c66206173206f70657261746f724552433737373a207265766f6b696e672073656c66206173206f70657261746f724552433737373a20746f6b656e20726563697069656e7420636f6e747261637420686173206e6f20696d706c656d656e74657220666f7220455243373737546f6b656e73526563697069656e744552433737373a207472616e7366657220746f20746865207a65726f20616464726573734552433737373a2063616c6c6572206973206e6f7420616e206f70657261746f7220666f7220686f6c6465724552433737373a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e63654552433737373a207472616e736665722066726f6d20746865207a65726f20616464726573734552433737373a206275726e20616d6f756e7420657863656564732062616c616e63654552433737373a20617070726f766520746f20746865207a65726f2061646472657373a265627a7a723158208c1bc4f779f353ddfc0be45b9957abc61149c8055303dc4b68f76adf17816f4664736f6c63430005100032";