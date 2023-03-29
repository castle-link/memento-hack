export const MEMENTO_MULTISEND_ABI = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_admin',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'admin',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'authorized',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'value',
						type: 'uint256',
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes',
					},
				],
				internalType: 'struct MementoMultisend.Transaction[]',
				name: 'transactions',
				type: 'tuple[]',
			},
		],
		name: 'multisend',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'authorizedAddress',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: '_authorized',
				type: 'bool',
			},
		],
		name: 'setAuthorized',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const MEMENTO_MULTICALL_ABI = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_admin',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_multicall3Address',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'admin',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'aggregate',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256',
			},
			{
				internalType: 'bytes[]',
				name: 'returnData',
				type: 'bytes[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'allowFailure',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call3[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'aggregate3',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'allowFailure',
						type: 'bool',
					},
					{
						internalType: 'uint256',
						name: 'value',
						type: 'uint256',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call3Value[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'aggregate3Value',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'authorized',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'blockAndAggregate',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256',
			},
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32',
			},
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getBasefee',
		outputs: [
			{
				internalType: 'uint256',
				name: 'basefee',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256',
			},
		],
		name: 'getBlockHash',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getBlockNumber',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getChainId',
		outputs: [
			{
				internalType: 'uint256',
				name: 'chainid',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getCurrentBlockCoinbase',
		outputs: [
			{
				internalType: 'address',
				name: 'coinbase',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getCurrentBlockDifficulty',
		outputs: [
			{
				internalType: 'uint256',
				name: 'difficulty',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getCurrentBlockGasLimit',
		outputs: [
			{
				internalType: 'uint256',
				name: 'gaslimit',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getCurrentBlockTimestamp',
		outputs: [
			{
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'addr',
				type: 'address',
			},
		],
		name: 'getEthBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: 'balance',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLastBlockHash',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'multicall3',
		outputs: [
			{
				internalType: 'contract Multicall3',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'multicall3Address',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'authorizedAddress',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: '_authorized',
				type: 'bool',
			},
		],
		name: 'setAuthorized',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bool',
				name: 'requireSuccess',
				type: 'bool',
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'tryAggregate',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bool',
				name: 'requireSuccess',
				type: 'bool',
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'tryBlockAndAggregate',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256',
			},
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32',
			},
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'allowFailure',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call3[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'useAggregate3',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address',
					},
					{
						internalType: 'bool',
						name: 'allowFailure',
						type: 'bool',
					},
					{
						internalType: 'uint256',
						name: 'value',
						type: 'uint256',
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Call3Value[]',
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'useAggregate3Value',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool',
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes',
					},
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
]
export const MEMENTO_ABI = [
	{
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				internalType: 'string',
				name: '_baseURI',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: '_startTime',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_admin',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'DoesNotExist',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'ApprovalForAll',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [],
		name: 'admin',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'baseURI',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_newStartTime',
				type: 'uint256',
			},
		],
		name: 'changeStartTime',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'getApproved',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'isApprovedForAll',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_to',
				type: 'address',
			},
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'ownerOf',
		outputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes4',
				name: 'interfaceId',
				type: 'bytes4',
			},
		],
		name: 'supportsInterface',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'tokenURI',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_newAdmin',
				type: 'address',
			},
		],
		name: 'updateAdmin',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_updatedBaseURI',
				type: 'string',
			},
		],
		name: 'updateBaseURI',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const MEMENTO_FACTORY_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'createdBy',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'collectionAddress',
				type: 'address',
			},
		],
		name: 'CollectionCreated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'baseURI',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: 'startTime',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'admin',
				type: 'address',
			},
		],
		name: 'createERC721Collection',
		outputs: [
			{
				internalType: 'contract MementoERC721',
				name: 'collection',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const MEMENTO_FACTORY_WITH_END_TIME_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'createdBy',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'collectionAddress',
				type: 'address',
			},
		],
		name: 'CollectionCreated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'baseURI',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: 'startTime',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'admin',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'endTime',
				type: 'uint256',
			},
		],
		name: 'createCollectionWithEndTime',
		outputs: [
			{
				internalType: 'contract MementoERC721WithEndTime',
				name: 'collection',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const MEMENTO_FACTORY_WITH_MAX_SUPPLY_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'createdBy',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'collectionAddress',
				type: 'address',
			},
		],
		name: 'CollectionCreated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'baseURI',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: 'startTime',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'admin',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'maxSupply',
				type: 'uint256',
			},
		],
		name: 'createCollectionWithMaxSupply',
		outputs: [
			{
				internalType: 'contract MementoERC721WithMaxSupply',
				name: 'collection',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const MEMENTO_FACTORY_WITH_MAX_SUPPLY_AND_END_TIME_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'createdBy',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'collectionAddress',
				type: 'address',
			},
		],
		name: 'CollectionCreated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'baseURI',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: 'startTime',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'admin',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'endTime',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'maxSupply',
				type: 'uint256',
			},
		],
		name: 'createERC721WithEndTimeAndMaxSupply',
		outputs: [
			{
				internalType: 'contract MementoERC721WithEndTimeAndMaxSupply',
				name: 'collection',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const C_CREATE2_SAFE_FACTORY_ABI = [
	{
		inputs: [
			{
				internalType: 'contract GnosisSafeProxyFactory',
				name: '_proxyFactory',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_singleton',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: '_owners',
				type: 'address[]',
			},
			{
				internalType: 'uint256',
				name: '_threshold',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
			{
				internalType: 'address',
				name: 'fallbackHandler',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'paymentToken',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'payment',
				type: 'uint256',
			},
			{
				internalType: 'address payable',
				name: 'paymentReceiver',
				type: 'address',
			},
			{
				internalType: 'string',
				name: 'salt',
				type: 'string',
			},
		],
		name: 'createAccount',
		outputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: '_owners',
				type: 'address[]',
			},
			{
				internalType: 'uint256',
				name: '_threshold',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
			{
				internalType: 'address',
				name: 'fallbackHandler',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'paymentToken',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'payment',
				type: 'uint256',
			},
			{
				internalType: 'address payable',
				name: 'paymentReceiver',
				type: 'address',
			},
		],
		name: 'createInitializerData',
		outputs: [
			{
				internalType: 'bytes',
				name: 'initializerData',
				type: 'bytes',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: '_owners',
				type: 'address[]',
			},
			{
				internalType: 'uint256',
				name: '_threshold',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
			{
				internalType: 'address',
				name: 'fallbackHandler',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'paymentToken',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'payment',
				type: 'uint256',
			},
			{
				internalType: 'address payable',
				name: 'paymentReceiver',
				type: 'address',
			},
			{
				internalType: 'string',
				name: 'salt',
				type: 'string',
			},
		],
		name: 'getDeploymentAddress',
		outputs: [
			{
				internalType: 'address',
				name: 'wallet',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'proxyFactory',
		outputs: [
			{
				internalType: 'contract GnosisSafeProxyFactory',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'singleton',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'source',
				type: 'string',
			},
		],
		name: 'stringToBytes32',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'result',
				type: 'bytes32',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
]
export const C_MEMENTO_ABI = [
	{
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				internalType: 'string',
				name: '_baseURI',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: '_startTime',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_admin',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'DoesNotExist',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'ApprovalForAll',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [],
		name: 'admin',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'baseURI',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_newStartTime',
				type: 'uint256',
			},
		],
		name: 'changeStartTime',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'getApproved',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'isApprovedForAll',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_to',
				type: 'address',
			},
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'ownerOf',
		outputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
			{
				internalType: 'bytes',
				name: 'data',
				type: 'bytes',
			},
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'operator',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'approved',
				type: 'bool',
			},
		],
		name: 'setApprovalForAll',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes4',
				name: 'interfaceId',
				type: 'bytes4',
			},
		],
		name: 'supportsInterface',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'tokenURI',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'id',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_newAdmin',
				type: 'address',
			},
		],
		name: 'updateAdmin',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_updatedBaseURI',
				type: 'string',
			},
		],
		name: 'updateBaseURI',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
export const S_SINGLETON_ABI = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'AddedOwner',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'approvedHash',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'ApproveHash',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'handler',
				type: 'address',
			},
		],
		name: 'ChangedFallbackHandler',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'guard',
				type: 'address',
			},
		],
		name: 'ChangedGuard',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'threshold',
				type: 'uint256',
			},
		],
		name: 'ChangedThreshold',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'module',
				type: 'address',
			},
		],
		name: 'DisabledModule',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'module',
				type: 'address',
			},
		],
		name: 'EnabledModule',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'txHash',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'payment',
				type: 'uint256',
			},
		],
		name: 'ExecutionFailure',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'module',
				type: 'address',
			},
		],
		name: 'ExecutionFromModuleFailure',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'module',
				type: 'address',
			},
		],
		name: 'ExecutionFromModuleSuccess',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'txHash',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'payment',
				type: 'uint256',
			},
		],
		name: 'ExecutionSuccess',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
		],
		name: 'RemovedOwner',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'SafeReceived',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'initiator',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address[]',
				name: 'owners',
				type: 'address[]',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'threshold',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'initializer',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'fallbackHandler',
				type: 'address',
			},
		],
		name: 'SafeSetup',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'msgHash',
				type: 'bytes32',
			},
		],
		name: 'SignMsg',
		type: 'event',
	},
	{ stateMutability: 'nonpayable', type: 'fallback' },
	{
		inputs: [],
		name: 'VERSION',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'uint256', name: '_threshold', type: 'uint256' },
		],
		name: 'addOwnerWithThreshold',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'hashToApprove', type: 'bytes32' },
		],
		name: 'approveHash',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '', type: 'address' },
			{ internalType: 'bytes32', name: '', type: 'bytes32' },
		],
		name: 'approvedHashes',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_threshold', type: 'uint256' }],
		name: 'changeThreshold',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'dataHash', type: 'bytes32' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{ internalType: 'bytes', name: 'signatures', type: 'bytes' },
			{
				internalType: 'uint256',
				name: 'requiredSignatures',
				type: 'uint256',
			},
		],
		name: 'checkNSignatures',
		outputs: [],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'dataHash', type: 'bytes32' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{ internalType: 'bytes', name: 'signatures', type: 'bytes' },
		],
		name: 'checkSignatures',
		outputs: [],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'prevModule', type: 'address' },
			{ internalType: 'address', name: 'module', type: 'address' },
		],
		name: 'disableModule',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'domainSeparator',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
		name: 'enableModule',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{
				internalType: 'enum Enum.Operation',
				name: 'operation',
				type: 'uint8',
			},
			{ internalType: 'uint256', name: 'safeTxGas', type: 'uint256' },
			{ internalType: 'uint256', name: 'baseGas', type: 'uint256' },
			{ internalType: 'uint256', name: 'gasPrice', type: 'uint256' },
			{ internalType: 'address', name: 'gasToken', type: 'address' },
			{
				internalType: 'address',
				name: 'refundReceiver',
				type: 'address',
			},
			{ internalType: 'uint256', name: '_nonce', type: 'uint256' },
		],
		name: 'encodeTransactionData',
		outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{
				internalType: 'enum Enum.Operation',
				name: 'operation',
				type: 'uint8',
			},
			{ internalType: 'uint256', name: 'safeTxGas', type: 'uint256' },
			{ internalType: 'uint256', name: 'baseGas', type: 'uint256' },
			{ internalType: 'uint256', name: 'gasPrice', type: 'uint256' },
			{ internalType: 'address', name: 'gasToken', type: 'address' },
			{
				internalType: 'address payable',
				name: 'refundReceiver',
				type: 'address',
			},
			{ internalType: 'bytes', name: 'signatures', type: 'bytes' },
		],
		name: 'execTransaction',
		outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{
				internalType: 'enum Enum.Operation',
				name: 'operation',
				type: 'uint8',
			},
		],
		name: 'execTransactionFromModule',
		outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{
				internalType: 'enum Enum.Operation',
				name: 'operation',
				type: 'uint8',
			},
		],
		name: 'execTransactionFromModuleReturnData',
		outputs: [
			{ internalType: 'bool', name: 'success', type: 'bool' },
			{ internalType: 'bytes', name: 'returnData', type: 'bytes' },
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getChainId',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'start', type: 'address' },
			{ internalType: 'uint256', name: 'pageSize', type: 'uint256' },
		],
		name: 'getModulesPaginated',
		outputs: [
			{ internalType: 'address[]', name: 'array', type: 'address[]' },
			{ internalType: 'address', name: 'next', type: 'address' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getOwners',
		outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: 'offset', type: 'uint256' },
			{ internalType: 'uint256', name: 'length', type: 'uint256' },
		],
		name: 'getStorageAt',
		outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getThreshold',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{
				internalType: 'enum Enum.Operation',
				name: 'operation',
				type: 'uint8',
			},
			{ internalType: 'uint256', name: 'safeTxGas', type: 'uint256' },
			{ internalType: 'uint256', name: 'baseGas', type: 'uint256' },
			{ internalType: 'uint256', name: 'gasPrice', type: 'uint256' },
			{ internalType: 'address', name: 'gasToken', type: 'address' },
			{
				internalType: 'address',
				name: 'refundReceiver',
				type: 'address',
			},
			{ internalType: 'uint256', name: '_nonce', type: 'uint256' },
		],
		name: 'getTransactionHash',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
		name: 'isModuleEnabled',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'isOwner',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'nonce',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'prevOwner', type: 'address' },
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'uint256', name: '_threshold', type: 'uint256' },
		],
		name: 'removeOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{
				internalType: 'enum Enum.Operation',
				name: 'operation',
				type: 'uint8',
			},
		],
		name: 'requiredTxGas',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'handler', type: 'address' }],
		name: 'setFallbackHandler',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'guard', type: 'address' }],
		name: 'setGuard',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address[]', name: '_owners', type: 'address[]' },
			{ internalType: 'uint256', name: '_threshold', type: 'uint256' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'bytes', name: 'data', type: 'bytes' },
			{
				internalType: 'address',
				name: 'fallbackHandler',
				type: 'address',
			},
			{ internalType: 'address', name: 'paymentToken', type: 'address' },
			{ internalType: 'uint256', name: 'payment', type: 'uint256' },
			{
				internalType: 'address payable',
				name: 'paymentReceiver',
				type: 'address',
			},
		],
		name: 'setup',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		name: 'signedMessages',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'targetContract',
				type: 'address',
			},
			{ internalType: 'bytes', name: 'calldataPayload', type: 'bytes' },
		],
		name: 'simulateAndRevert',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'prevOwner', type: 'address' },
			{ internalType: 'address', name: 'oldOwner', type: 'address' },
			{ internalType: 'address', name: 'newOwner', type: 'address' },
		],
		name: 'swapOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ stateMutability: 'payable', type: 'receive' },
]
export const S_WALLET_FACTORY_ABI = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'singleton',
				type: 'address',
			},
			{
				internalType: 'contract EIP4337Manager',
				name: 'aaModule',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'salt',
				type: 'uint256',
			},
		],
		name: 'deployWallet',
		outputs: [
			{
				internalType: 'contract SafeProxy4337',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'singleton',
				type: 'address',
			},
			{
				internalType: 'contract EIP4337Manager',
				name: 'aaModule',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'salt',
				type: 'uint256',
			},
		],
		name: 'getDeploymentAddress',
		outputs: [
			{
				internalType: 'address',
				name: 'wallet',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]
export const C_TOKEN_FACTORY_ABI = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				internalType: 'string',
				name: '_baseURI',
				type: 'string',
			},
		],
		name: 'launchToken',
		outputs: [
			{
				internalType: 'contract Token',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
