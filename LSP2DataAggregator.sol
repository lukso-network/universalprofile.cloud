// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import {
    IERC725Y
} from "@erc725/smart-contracts/contracts/interfaces/IERC725Y.sol";
import {
    LSP8IdentifiableDigitalAssetCore
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAssetCore.sol";

contract LSP2FetcherWithMulticall3 {
    struct Call {
        address target;
        bytes callData;
    }

    struct Call3 {
        address target;
        bool allowFailure;
        bytes callData;
    }

    struct Call3Value {
        address target;
        bool allowFailure;
        uint256 value;
        bytes callData;
    }

    struct Result {
        bool success;
        bytes returnData;
    }

    struct Result4 {
        bool success;
        uint256 totalLength;
        bytes returnData;
    }

    struct SliceResult {
        uint256 totalLength;
        uint256 offet;
        bytes returnData;
    }

    /// @notice Backwards-compatible call aggregation with Multicall
    /// @param calls An array of Call structs
    /// @return returnData An array of bytes containing the responses
    function aggregate(
        Call[] memory calls
    ) public payable returns (bytes[] memory returnData) {
        uint256 length = calls.length;
        returnData = new bytes[](length);
        Call memory call;
        for (uint256 i = 0; i < length; ) {
            bool success;
            call = calls[i];
            if (call.target == address(0)) call.target = address(this);
            (success, returnData[i]) = call.target.call(call.callData);
            require(success, "Multicall3: call failed");
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Backwards-compatible with Multicall2
    /// @notice Aggregate calls without requiring success
    /// @param requireSuccess If true, require all calls to succeed
    /// @param calls An array of Call structs
    /// @return returnData An array of Result structs
    function tryAggregate(
        bool requireSuccess,
        Call[] memory calls
    ) public payable returns (Result[] memory returnData) {
        uint256 length = calls.length;
        returnData = new Result[](length);
        Call memory call;
        for (uint256 i = 0; i < length; ) {
            Result memory result = returnData[i];
            call = calls[i];
            if (call.target == address(0)) call.target = address(this);
            (result.success, result.returnData) = call.target.call(
                call.callData
            );
            if (requireSuccess)
                require(result.success, "Multicall3: call failed");
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Aggregate calls, ensuring each returns success if required
    /// @param calls An array of Call3 structs
    /// @return returnData An array of Result structs
    function aggregate3(
        Call3[] memory calls
    ) public payable returns (Result[] memory returnData) {
        uint256 length = calls.length;
        returnData = new Result[](length);
        Call3 memory calli;
        for (uint256 i = 0; i < length; ) {
            Result memory result = returnData[i];
            calli = calls[i];
            if (calli.target == address(0)) calli.target = address(this);
            (result.success, result.returnData) = calli.target.call(
                calli.callData
            );
            if (!calli.allowFailure) {
                
                require(result.success, "Multicall3: call failed");
            }
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Aggregate calls, ensuring each returns success if required
    /// @param calls An array of Call3 structs
    /// @param limit The maximum length of total return data
    /// @return returnData An array of Result structs
    function aggregate4(
        Call3[] memory calls,
        uint256 limit
    ) public payable returns (Result4[] memory returnData) {
        uint256 length = calls.length;
        returnData = new Result4[](length);
        Call3 memory calli;
        for (uint256 i = 0; i < length; ) {
            Result4 memory result = returnData[i];
            calli = calls[i];
            if (calli.target == address(0)) calli.target = address(this);
            bytes memory callResult;
            (result.success, callResult) = calli.target.call(
                calli.callData
            );
            if (!calli.allowFailure) {
                require(result.success, "Multicall4: call failed");
            }
            if (result.success) {
                result.totalLength = callResult.length;
                if (limit == 0) {
                    // don't output
                    delete callResult;
                } else if (result.totalLength > limit) {
                    bytes memory slice = new bytes(limit);
                    for (uint256 j = 0; j < limit; j++) {
                        slice[j] = callResult[j];
                    }
                    result.returnData = slice;
                    delete slice;
                    delete callResult;
                    unchecked {
                        limit -= result.returnData.length;
                    }
                } else {
                    result.returnData = callResult;
                    delete callResult;
                    unchecked {
                        limit -= result.returnData.length;
                    }
                }
            }
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Returns the block hash for the given block number
    /// @param blockNumber The block number
    function getBlockHash(
        uint256 blockNumber
    ) public view returns (bytes32 blockHash) {
        blockHash = blockhash(blockNumber);
    }

    /// @notice Returns the block number
    function getBlockNumber() public view returns (uint256 blockNumber) {
        blockNumber = block.number;
    }

    /// @notice Returns the block coinbase
    function getCurrentBlockCoinbase() public view returns (address coinbase) {
        coinbase = block.coinbase;
    }

    /// @notice Returns the block difficulty
    function getCurrentBlockDifficulty()
        public
        view
        returns (uint256 difficulty)
    {
        difficulty = block.prevrandao;
    }

    /// @notice Returns the block gas limit
    function getCurrentBlockGasLimit() public view returns (uint256 gaslimit) {
        gaslimit = block.gaslimit;
    }

    /// @notice Returns the block timestamp
    function getCurrentBlockTimestamp()
        public
        view
        returns (uint256 timestamp)
    {
        timestamp = block.timestamp;
    }

    /// @notice Returns the (ETH) balance of a given address
    function getEthBalance(address addr) public view returns (uint256 balance) {
        balance = addr.balance;
    }

    /// @notice Returns the block hash of the last block
    function getLastBlockHash() public view returns (bytes32 blockHash) {
        unchecked {
            blockHash = blockhash(block.number - 1);
        }
    }

    /// @notice Returns the chain id
    function getChainId() public view returns (uint256 chainid) {
        chainid = block.chainid;
    }

    function fetchArrayLengthCount(
        address _contract,
        bytes32 dataKey
    ) public view returns (uint128) {
        return uint128(bytes16(IERC725Y(_contract).getData(dataKey)));
    }

    /// @notice getDataSlice call, returns all or a slice of the data
    /// @param _contract The contract address
    /// @param dataKey The data key
    /// @param offset The offset within the data
    /// @param maxLength length of data
    function getDataSlice(
        address _contract,
        bytes32 dataKey,
        uint256 offset,
        uint256 maxLength
    ) public view returns (SliceResult memory) {
        bytes memory data = IERC725Y(_contract).getData(dataKey);
        uint256 length = data.length;
        if (offset >= length) {
            return SliceResult(0, 0, "");
        }
        uint256 remaining = length - offset;
        if (remaining > maxLength) {
            remaining = maxLength;
        }
        bytes memory slice = new bytes(remaining);
        for (uint256 i = 0; i < remaining; i++) {
            slice[i] = data[offset + i];
        }
        return SliceResult(length, offset, slice);
    }

    /// @notice getDataSlice call, returns all or a slice of the data
    /// @param _contract The contract address
    /// @param dataKey The data key
    /// @param offset The offset within the data
    /// @param maxLength length of data
    function getDataForTokenIdSlice(
        address _contract,
        bytes32 tokenId,
        bytes32 dataKey,
        uint256 offset,
        uint256 maxLength
    ) public view returns (SliceResult memory) {
        bytes memory data = LSP8IdentifiableDigitalAssetCore(_contract).getDataForTokenId(tokenId, dataKey);
        uint256 length = data.length;
        if (offset >= length) {
            return SliceResult(0, 0, "");
        }
        uint256 remaining = length - offset;
        if (remaining > maxLength) {
            remaining = maxLength;
        }
        bytes memory slice = new bytes(remaining);
        for (uint256 i = 0; i < remaining; i++) {
            slice[i] = data[offset + i];
        }
        return SliceResult(length, offset, slice);
    }

    function fetchElements(
        address _contract,
        bytes32 dataKey,
        uint128 count
    ) public view returns (bytes[] memory) {
        bytes[] memory returnedValues = new bytes[](count);

        for (uint128 i = 0; i < count; i++) {
            bytes32 key = LSP2Utils.generateArrayElementKeyAtIndex(dataKey, i);

            bytes memory element = IERC725Y(_contract).getData(key);
            returnedValues[i] = element;
        }

        return returnedValues;
    }

    function fetchArrayWithElements(
        address _contract,
        bytes32 dataKey
    ) public view returns (bytes[] memory) {
        uint128 count = fetchArrayLengthCount(_contract, dataKey);
        return fetchElements(_contract, dataKey, count);
    }

    function fetchElementMapKey(
        address _contract,
        bytes10 dataKeyPrefix,
        bytes memory element
    ) public view returns (bytes memory) {
        bytes32 key = LSP2Utils.generateMappingWithGroupingKey(
            dataKeyPrefix,
            bytes20(element)
        );
        return IERC725Y(_contract).getData(key);
    }

    function fetchElementMapKeys(
        address _contract,
        bytes10 dataKeyPrefix,
        bytes[] memory elements
    ) public view returns (bytes[] memory) {
        bytes[] memory returnedMapValues = new bytes[](elements.length);

        for (uint128 i = 0; i < elements.length; i++) {
            bytes32 key = LSP2Utils.generateMappingWithGroupingKey(
                dataKeyPrefix,
                bytes20(elements[i])
            );
            bytes memory returnedMap = IERC725Y(_contract).getData(key);
            returnedMapValues[i] = returnedMap;
        }

        return returnedMapValues;
    }

    function fetchArrayWithMapKeys(
        address _contract,
        bytes32 dataKey,
        bytes10 mapKeyPrefix
    ) public view returns (bytes[] memory, bytes[] memory) {
        bytes[] memory elements = fetchArrayWithElements(_contract, dataKey);
        bytes[] memory mapKeys = fetchElementMapKeys(
            _contract,
            mapKeyPrefix,
            elements
        );
        return (elements, mapKeys);
    }

    function batchCalls(
        bytes[] calldata data
    ) public virtual returns (bytes[] memory results) {
        results = new bytes[](data.length);
        for (uint256 i; i < data.length; ) {
            (bool success, bytes memory result) = address(this).delegatecall(
                data[i]
            );

            if (!success) {
                // Look for revert reason and bubble it up if present
                if (result.length != 0) {
                    // The easiest way to bubble the revert reason is using memory via assembly
                    // solhint-disable no-inline-assembly
                    /// @solidity memory-safe-assembly
                    assembly {
                        let returndata_size := mload(result)
                        revert(add(32, result), returndata_size)
                    }
                } else {
                    revert("LSP2Fetcher: batchCalls reverted");
                }
            }

            results[i] = result;

            unchecked {
                ++i;
            }
        }
    }

    function fetchLSP6ArrayWithMapKeys(
        address _contract
    ) public view returns (bytes[] memory, bytes[] memory) {
        bytes[] memory elements = fetchArrayWithElements(
            _contract,
            0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3
        );
        bytes[] memory mapKeys = fetchElementMapKeys(
            _contract,
            0x4b80742de2bf82acb363,
            elements
        );
        return (elements, mapKeys);
    }

    function fetchLSP5ArrayWithMapKeys(
        address _contract
    ) public view returns (bytes[] memory, bytes[] memory) {
        bytes[] memory elements = fetchArrayWithElements(
            _contract,
            0x6460ee3c0aac563ccbf76d6e1d07bada78e3a9514e6382b736ed3f478ab7b90b
        );
        bytes[] memory mapKeys = fetchElementMapKeys(
            _contract,
            0x812c4334633eb816c80d,
            elements
        );
        return (elements, mapKeys);
    }

    function fetchLSP4ArrayWithMapKeys(
        address _contract
    ) public view returns (bytes[] memory, bytes[] memory) {
        bytes[] memory elements = fetchArrayWithElements(
            _contract,
            0x114bd03b3a46d48759680d81ebb2b414fda7d030a7105a851867accf1c2352e7
        );
        bytes[] memory mapKeys = fetchElementMapKeys(
            _contract,
            0x6de85eaf5d982b4e5da0,
            elements
        );
        return (elements, mapKeys);
    }
}

/**
 * @title LSP2 Utility library.
 * @author Jean Cavallera <CJ42>, Yamen Merhi <YamenMerhi>, Daniel Afteni <B00ste>
 * @dev LSP2Utils is a library of utility functions that can be used to encode data key of different key type
 * defined on the LSP2 standard.
 * Based on LSP2 ERC725Y JSON Schema standard.
 */
library LSP2Utils {
    /**
     * @dev Generates a data key of keyType Singleton by hashing the string `keyName`. As:
     *
     * ```
     * keccak256("keyName")
     * ```
     *
     * @param keyName The string to hash to generate a Singleton data key.
     *
     * @return The generated `bytes32` data key of key type Singleton.
     */
    function generateSingletonKey(
        string memory keyName
    ) internal pure returns (bytes32) {
        return keccak256(bytes(keyName));
    }

    /**
     * @dev Generates a data key of keyType Array by hashing `arrayKeyName`. As:
     *
     * ```
     * keccak256("arrayKeyName[]")
     * ```
     *
     * @param arrayKeyName The string that will be used to generate a data key of key type Array.
     *
     * @return The generated `bytes32` data key of key type Array.
     *
     * @custom:requirements
     * - The `keyName` must include at the end of the string the square brackets `"[]"`.
     */
    function generateArrayKey(
        string memory arrayKeyName
    ) internal pure returns (bytes32) {
        bytes memory dataKey = bytes(arrayKeyName);
        require(dataKey.length >= 2, "MUST be longer than 2 characters");
        require(
            dataKey[dataKey.length - 2] == 0x5b && // "[" in utf8 encoded
                dataKey[dataKey.length - 1] == 0x5d, // "]" in utf8
            "Missing empty square brackets '[]' at the end of the key name"
        );

        return keccak256(dataKey);
    }

    /**
     * @dev Generates an Array data key at a specific `index` by concatenating together the first 16 bytes of `arrayKey`
     * with the 16 bytes of `index`. As:
     *
     * ```
     * arrayKey[index]
     * ```
     *
     * @param arrayKey The Array data key from which to generate the Array data key at a specific `index`.
     * @param index The index number in the `arrayKey`.
     *
     * @return The generated `bytes32` data key of key type Array at a specific `index`.
     */
    function generateArrayElementKeyAtIndex(
        bytes32 arrayKey,
        uint128 index
    ) internal pure returns (bytes32) {
        bytes memory elementInArray = bytes.concat(
            bytes16(arrayKey),
            bytes16(index)
        );
        return bytes32(elementInArray);
    }

    /**
     * @dev Generates a data key of key type Mapping that map `firstWord` to `lastWord`. This is done by hashing two strings words `firstWord` and `lastWord`. As:
     *
     * ```
     * bytes10(firstWordHash):0000:bytes20(lastWordHash)
     * ```
     *
     * @param firstWord The word to retrieve the first 10 bytes of its hash.
     * @param lastWord The word to retrieve the first 10 bytes of its hash.
     *
     * @return The generated `bytes32` data key of key type Mapping that map `firstWord` to a specific `lastWord`.
     */
    function generateMappingKey(
        string memory firstWord,
        string memory lastWord
    ) internal pure returns (bytes32) {
        bytes32 firstWordHash = keccak256(bytes(firstWord));
        bytes32 lastWordHash = keccak256(bytes(lastWord));

        bytes memory temporaryBytes = bytes.concat(
            bytes10(firstWordHash),
            bytes2(0),
            bytes20(lastWordHash)
        );

        return bytes32(temporaryBytes);
    }

    /**
     * @dev Generates a data key of key type Mapping that map `firstWord` to an address `addr`.
     * This is done by hashing the string word `firstWord` and concatenating its first 10 bytes with `addr`. As:
     *
     * ```
     * bytes10(firstWordHash):0000:<address>
     * ```
     *
     * @param firstWord The word to retrieve the first 10 bytes of its hash.
     * @param addr An address to map `firstWord` to.
     *
     * @return The generated `bytes32` data key of key type Mapping that map `firstWord` to a specific address `addr`.
     */
    function generateMappingKey(
        string memory firstWord,
        address addr
    ) internal pure returns (bytes32) {
        bytes32 firstWordHash = keccak256(bytes(firstWord));

        bytes memory temporaryBytes = bytes.concat(
            bytes10(firstWordHash),
            bytes2(0),
            bytes20(addr)
        );

        return bytes32(temporaryBytes);
    }

    /**
     * @dev Generate a data key of key type Mapping that map a 10 bytes `keyPrefix` to a `bytes20Value`. As:
     *
     * ```
     * keyPrefix:bytes20Value
     * ```
     *
     * @param keyPrefix The first part of the data key of key type Mapping.
     * @param bytes20Value The second part of the data key of key type Mapping.
     *
     * @return The generated `bytes32` data key of key type Mapping that map a `keyPrefix` to a specific `bytes20Value`.
     */
    function generateMappingKey(
        bytes10 keyPrefix,
        bytes20 bytes20Value
    ) internal pure returns (bytes32) {
        bytes memory generatedKey = bytes.concat(
            keyPrefix,
            bytes2(0),
            bytes20Value
        );
        return bytes32(generatedKey);
    }

    /**
     * @dev Generate a data key of key type MappingWithGrouping by using two strings `firstWord`
     * mapped to a `secondWord` mapped itself to a specific address `addr`. As:
     *
     * ```
     * bytes6(keccak256("firstWord")):bytes4(keccak256("secondWord")):0000:<address>
     * ```
     *
     * @param firstWord The word to retrieve the first 6 bytes of its hash.
     * @param secondWord The word to retrieve the first 4 bytes of its hash.
     * @param addr The address that makes the last part of the MappingWithGrouping.
     *
     * @return The generated `bytes32` data key of key type MappingWithGrouping that map a `firstWord` to a `secondWord` to a specific address `addr`.
     */
    function generateMappingWithGroupingKey(
        string memory firstWord,
        string memory secondWord,
        address addr
    ) internal pure returns (bytes32) {
        bytes32 firstWordHash = keccak256(bytes(firstWord));
        bytes32 secondWordHash = keccak256(bytes(secondWord));

        bytes memory temporaryBytes = bytes.concat(
            bytes6(firstWordHash),
            bytes4(secondWordHash),
            bytes2(0),
            bytes20(addr)
        );

        return bytes32(temporaryBytes);
    }

    /**
     * @dev Generate a data key of key type MappingWithGrouping that map a `keyPrefix` to an other `mapPrefix` to a specific `subMapKey`. As:
     *
     * ```
     * keyPrefix:mapPrefix:0000:subMapKey
     * ```
     *
     * @param keyPrefix The first part (6 bytes) of the data key of keyType MappingWithGrouping.
     * @param mapPrefix The second part (4 bytes) of the data key of keyType MappingWithGrouping.
     * @param subMapKey The last part (bytes20) of the data key of keyType MappingWithGrouping.
     *
     * @return The generated `bytes32` data key of key type MappingWithGrouping that map a `keyPrefix` to a `mapPrefix` to a specific `subMapKey`.
     */
    function generateMappingWithGroupingKey(
        bytes6 keyPrefix,
        bytes4 mapPrefix,
        bytes20 subMapKey
    ) internal pure returns (bytes32) {
        bytes memory generatedKey = bytes.concat(
            keyPrefix,
            mapPrefix,
            bytes2(0),
            subMapKey
        );
        return bytes32(generatedKey);
    }

    /**
     * @dev Generate a data key of key type MappingWithGrouping that map a 10 bytes `keyPrefix` to a specific `bytes20Value`. As:
     *
     * @param keyPrefix The first part of the data key of keyType MappingWithGrouping.
     * @param bytes20Value The last of the data key of keyType MappingWithGrouping.
     *
     * @return The generated `bytes32` data key of key type MappingWithGrouping that map a `keyPrefix`
     * (containing the first and second mapped word) to a specific `bytes20Value`.
     */
    function generateMappingWithGroupingKey(
        bytes10 keyPrefix,
        bytes20 bytes20Value
    ) internal pure returns (bytes32) {
        bytes memory generatedKey = bytes.concat(
            keyPrefix,
            bytes2(0),
            bytes20Value
        );
        return bytes32(generatedKey);
    }

    /**
     * @dev Generate a JSONURL value content.
     * @param hashFunction The function used to hash the JSON file.
     * @param json Bytes value of the JSON file.
     * @param url The URL where the JSON file is hosted.
     */
    function generateJSONURLValue(
        string memory hashFunction,
        string memory json,
        string memory url
    ) internal pure returns (bytes memory) {
        bytes32 hashFunctionDigest = keccak256(bytes(hashFunction));
        bytes32 jsonDigest = keccak256(bytes(json));

        return abi.encodePacked(bytes4(hashFunctionDigest), jsonDigest, url);
    }

    /**
     * @dev Generate a ASSETURL value content.
     *
     * @param hashFunction The function used to hash the JSON file.
     * @param assetBytes Bytes value of the JSON file.
     * @param url The URL where the JSON file is hosted.
     *
     * @return The encoded value as an `ASSETURL`.
     */
    function generateASSETURLValue(
        string memory hashFunction,
        string memory assetBytes,
        string memory url
    ) internal pure returns (bytes memory) {
        bytes32 hashFunctionDigest = keccak256(bytes(hashFunction));
        bytes32 jsonDigest = keccak256(bytes(assetBytes));

        return abi.encodePacked(bytes4(hashFunctionDigest), jsonDigest, url);
    }

    /**
     * @dev Verify if `data` is a valid array of value encoded as a `CompactBytesArray` according to the LSP2 `CompactBytesArray` valueType specification.
     *
     * @param compactBytesArray The bytes value to verify.
     *
     * @return `true` if the `data` is correctly encoded CompactBytesArray, `false` otherwise.
     */
    function isCompactBytesArray(
        bytes memory compactBytesArray
    ) internal pure returns (bool) {
        /**
         * Pointer will always land on these values:
         *
         * ↓↓↓↓
         * 0003 a00000
         * 0005 fff83a0011
         * 0020 aa0000000000000000000000000000000000000000000000000000000000cafe
         * 0012 bb000000000000000000000000000000beef
         * 0019 cc00000000000000000000000000000000000000000000deed
         * ↑↑↑↑
         *
         * The pointer can only land on the length of the following bytes value.
         */
        uint256 pointer = 0;

        /**
         * Check each length byte and make sure that when you reach the last length byte.
         * Make sure that the last length describes exactly the last bytes value and you do not get out of bounds.
         */
        while (pointer < compactBytesArray.length) {
            if (pointer + 1 >= compactBytesArray.length) return false;
            uint256 elementLength = uint16(
                bytes2(
                    abi.encodePacked(
                        compactBytesArray[pointer],
                        compactBytesArray[pointer + 1]
                    )
                )
            );
            pointer += elementLength + 2;
        }
        if (pointer == compactBytesArray.length) return true;
        return false;
    }

    /**
     * @dev Validates if the bytes `arrayLength` are exactly 16 bytes long, and are of the exact size of an LSP2 Array length value
     *
     * @param arrayLength Plain bytes that should be validated.
     *
     * @return `true` if the value is 16 bytes long, `false` otherwise.
     */
    function isValidLSP2ArrayLengthValue(
        bytes memory arrayLength
    ) internal pure returns (bool) {
        if (arrayLength.length == 16) {
            return true;
        }
        return false;
    }

    /**
     * @dev Generates Data Key/Value pairs for removing the last element from an LSP2 Array and a mapping Data Key.
     *
     * @param arrayKey The Data Key of Key Type Array.
     * @param newArrayLength The new Array Length for the `arrayKey`.
     * @param removedElementIndexKey The Data Key of Key Type Array Index for the removed element.
     * @param removedElementMapKey The Data Key of a mapping to be removed.
     */
    function removeLastElementFromArrayAndMap(
        bytes32 arrayKey,
        uint128 newArrayLength,
        bytes32 removedElementIndexKey,
        bytes32 removedElementMapKey
    )
        internal
        pure
        returns (bytes32[] memory dataKeys, bytes[] memory dataValues)
    {
        dataKeys = new bytes32[](3);
        dataValues = new bytes[](3);

        // store the number of received assets decremented by 1
        dataKeys[0] = arrayKey;
        dataValues[0] = abi.encodePacked(newArrayLength);

        // remove the data value for the map key of the element
        dataKeys[1] = removedElementMapKey;
        dataValues[1] = "";

        // remove the data value for the map key of the element
        dataKeys[2] = removedElementIndexKey;
        dataValues[2] = "";
    }

    /**
     * @dev Generates Data Key/Value pairs for removing an element from an LSP2 Array and a mapping Data Key.
     *
     * @custom:info The function assumes that the Data Value stored under the mapping Data Key is of length 20 where the last 16 bytes are the index of the element in the array.
     *
     * @param erc725YContract The ERC725Y contract.
     * @param arrayKey The Data Key of Key Type Array.
     * @param newArrayLength The new Array Length for the `arrayKey`.
     * @param removedElementIndexKey The Data Key of Key Type Array Index for the removed element.
     * @param removedElementIndex the index of the removed element.
     * @param removedElementMapKey The Data Key of a mapping to be removed.
     */
    function removeElementFromArrayAndMap(
        IERC725Y erc725YContract,
        bytes32 arrayKey,
        uint128 newArrayLength,
        bytes32 removedElementIndexKey,
        uint128 removedElementIndex,
        bytes32 removedElementMapKey
    )
        internal
        view
        returns (bytes32[] memory dataKeys, bytes[] memory dataValues)
    {
        dataKeys = new bytes32[](5);
        dataValues = new bytes[](5);

        // store the number of received assets decremented by 1
        dataKeys[0] = arrayKey;
        dataValues[0] = abi.encodePacked(newArrayLength);

        // remove the data value for the map key of the element
        dataKeys[1] = removedElementMapKey;
        dataValues[1] = "";

        // Generate the key of the last element in the array
        bytes32 lastElementIndexKey = LSP2Utils.generateArrayElementKeyAtIndex(
            arrayKey,
            newArrayLength
        );

        // Get the data value from the key of the last element in the array
        bytes20 lastElementIndexValue = bytes20(
            erc725YContract.getData(lastElementIndexKey)
        );

        // Set data value of the last element instead of the element from the array that will be removed
        dataKeys[2] = removedElementIndexKey;
        dataValues[2] = bytes.concat(lastElementIndexValue);

        // Remove the data value for the swapped array element
        dataKeys[3] = lastElementIndexKey;
        dataValues[3] = "";

        // Generate mapping key for the swapped array element
        bytes32 lastElementMapKey = LSP2Utils.generateMappingKey(
            bytes10(removedElementMapKey),
            lastElementIndexValue
        );

        // Generate the mapping value for the swapped array element
        bytes memory lastElementMapValue = abi.encodePacked(
            bytes4(erc725YContract.getData(lastElementMapKey)),
            removedElementIndex
        );

        // Update the map value of the swapped array element to the new index
        dataKeys[4] = lastElementMapKey;
        dataValues[4] = lastElementMapValue;
    }
}
