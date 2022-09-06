import { useState, useContext } from 'react';
import Web3 from 'web3';

import { AssetsContext } from '../../contexts/AssetsContext';
import {
  AssetTransferContext,
  assetTransferInitialContext,
} from '../../contexts/AssetTransferContext';
import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import { LSPType } from '../../interfaces/lsps';
import {
  transferLSP7Asset,
  transferLSP8Asset,
  transferLSP8AssetFromVault,
  transferLSP7AssetFromVault,
} from '../../utils/transferAsset';
import AddressInput from '../AddressInput';
import { AiOutlineClose } from 'react-icons/ai';

interface Transfer {
  assetType: LSPType;
  receiverAddress: string;
  tokenId?: string;
  amount?: number;
  isReceiverUniversalProfile: boolean;
  contractAddress: string;
}

enum ReceiverType {
  External = 'External',
  Internal = 'Internal',
}

enum TransactionStatus {
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
  None = 'none',
}

const AssetTransferModal: React.FC = () => {
  const [transfer, setTransfer] = useState<Transfer>({
    assetType: LSPType.Unknown,
    receiverAddress: '',
    isReceiverUniversalProfile: false,
    contractAddress: '',
  });
  const [receiverType, setReceiverType] = useState<ReceiverType>(
    ReceiverType.Internal,
  );
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.None,
  );
  const [transactionHash, setTransactionHash] = useState<string>('');

  const { setAssetTransferInfos, assetTransferInfos } =
    useContext(AssetTransferContext);
  const { walletAddress } = useContext(WalletAddressContext);
  const {
    vaultsAssets,
    setVaultsAssets,
    lsp7Assets,
    setLsp7Assets,
    lsp8Assets,
    setLsp8Assets,
  } = useContext(AssetsContext);

  // const updateGlobalContext = () => {
  //   //update sender array
  //   //if assetTransferInfos.vault address is not empty, it means that the asset is in a vault
  //   //if asset type is lsp8 remove from array
  //   //if asset type is lsp7, update amount
  //   if (assetTransferInfos.vaultAddress) {
  //     const vault = vaultsAssets.find(
  //       (vault) => vault.vaultAddress === assetTransferInfos.vaultAddress,
  //     );
  //     if (vault) {
  //       if (assetTransferInfos.assetType === LSPType.LSP7) {
  //         const asset = vault.lsp7Assets.find(
  //           (asset) => asset.address === assetTransferInfos.assetAddress,
  //         );
  //         if (asset) {
  //           asset.amount -= assetTransferInfos.amount as number; //if lsp7, amount is defined
  //           //if amount is 0, remove from array
  //           if (asset.amount === 0) {
  //             vault.lsp7Assets = vault.lsp7Assets.filter(
  //               (asset) => asset.address !== assetTransferInfos.assetAddress,
  //             );
  //           }
  //         }
  //       } else {
  //         //filter asset from array
  //         vault.lsp8Assets = vault.lsp8Assets.filter(
  //           (asset) =>
  //             asset.collectionAddress !== assetTransferInfos.assetAddress,
  //         );
  //       }
  //     }
  //     //update setVaultsAssets
  //     setVaultsAssets(
  //       vaultsAssets.map((vault) =>
  //         vault.vaultAddress === assetTransferInfos.vaultAddress
  //           ? vault
  //           : vault,
  //       ),
  //     );
  //   }
  //   //if not vault look at type of asset and remove from array
  //   let tempLsp7Assets = lsp7Assets;
  //   if (assetTransferInfos.assetType === LSPType.LSP7) {
  //     tempLsp7Assets = tempLsp7Assets.filter(
  //       (asset) => asset.address !== assetTransferInfos.assetAddress,
  //     );
  //     setLsp7Assets(tempLsp7Assets);
  //   }
  //   let tempLsp8Assets = lsp8Assets;
  //   if (assetTransferInfos.assetType === LSPType.LSP8) {
  //     tempLsp8Assets = tempLsp8Assets.filter(
  //       (asset) => asset.collectionAddress !== assetTransferInfos.assetAddress,
  //     );
  //     setLsp8Assets(tempLsp8Assets);
  //   }
  // };

  const handleTransaction = async (intiatedTransfer: any) => {
    setTransactionStatus(TransactionStatus.Pending);
    const transferStatus = await intiatedTransfer;
    if (transferStatus.status) {
      setTransactionStatus(TransactionStatus.Success);
      setTransactionHash(transferStatus.transactionHash);
      // updateGlobalContext();
    } else {
      setTransactionStatus(TransactionStatus.Error);
      setTransactionHash(transferStatus.transactionHash);
    }
  };

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { ethereum } = window;

    if (!ethereum) {
      return;
    }
    const web3 = new Web3(ethereum);

    if (assetTransferInfos.assetType === LSPType.LSP7) {
      if (!transfer.amount) {
        return;
      }
      try {
        if (assetTransferInfos.vaultAddress) {
          const initiateTransfer = transferLSP7AssetFromVault(
            assetTransferInfos.assetAddress,
            walletAddress,
            transfer.receiverAddress,
            transfer.isReceiverUniversalProfile,
            transfer.amount,
            web3,
            assetTransferInfos.vaultAddress,
          );
          await handleTransaction(initiateTransfer);
        } else {
          const initiateTransfer = transferLSP7Asset(
            assetTransferInfos.assetAddress,
            walletAddress,
            transfer.receiverAddress,
            transfer.isReceiverUniversalProfile,
            transfer.amount,
            web3,
          );
          await handleTransaction(initiateTransfer);
        }
      } catch (err: any) {
        console.log(err);
        if (err.code === 4001) {
          setTransactionStatus(TransactionStatus.None);
        }
      }
      return;
    }

    if (assetTransferInfos.assetType === LSPType.LSP8) {
      if (!assetTransferInfos.tokenId) {
        return;
      }
      try {
        if (assetTransferInfos.vaultAddress) {
          const initiateTransfer = transferLSP8AssetFromVault(
            assetTransferInfos.assetAddress,
            walletAddress,
            transfer.receiverAddress,
            transfer.isReceiverUniversalProfile,
            assetTransferInfos.tokenId,
            web3,
            assetTransferInfos.vaultAddress,
          );
          await handleTransaction(initiateTransfer);
        } else {
          const initiateTransfer = transferLSP8Asset(
            assetTransferInfos.assetAddress,
            walletAddress,
            transfer.receiverAddress,
            transfer.isReceiverUniversalProfile,
            assetTransferInfos.tokenId,
            web3,
          );
          await handleTransaction(initiateTransfer);
        }
      } catch (err: any) {
        console.log(err);
        if (err.code === 4001) {
          setTransactionStatus(TransactionStatus.None);
        }
      }
    }
  };

  const transactionStatusStyle = (transactionStatus: TransactionStatus) =>
    transactionStatus === TransactionStatus.Success
      ? 'text-green-400'
      : 'text-red-400';

  const renderTransactionStatus = () => (
    <div className="flex flex-col items-center justify-center mt-12">
      <div className="text-2xl font-bold mb-4">
        Transaction {transactionStatus}
      </div>
      {transactionStatus !== TransactionStatus.Pending && (
        <div className="text-2xl font-bold mb-4">
          <a
            className={`${transactionStatusStyle(transactionStatus)} text-sm`}
            href={`https://explorer.execution.l16.lukso.network/tx/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Blockscout
          </a>
        </div>
      )}
    </div>
  );

  const renderAmountInput = () => (
    <div className="flex flex-col mb-5">
      <input
        className="w-[200px]  outline-none bg-darkGray focus:outline-none px-3 text-gray-400 focus:shadow-outline rounded-lg py-2 px-4 block w-full appearance-none "
        type="number"
        name="amount"
        placeholder="Enter an Amount"
        id="amount"
        value={transfer.amount}
        onChange={(e) =>
          setTransfer({ ...transfer, amount: parseInt(e.target.value) })
        }
      />
    </div>
  );

  const renderTransferForm = () => (
    <form onSubmit={handleTransfer}>
      <div className="mb-6 mt-10 text-2xl font-bold">Receiver</div>
      <div className="flex mb-5 justify-around">
        <div
          className={`${
            receiverType === ReceiverType.Internal && 'text-blue-400'
          }
        cursor-pointer px-8 py-2
        `}
          onClick={() => setReceiverType(ReceiverType.Internal)}
        >
          Internal Receiver
        </div>
        <div
          className={`${
            receiverType === ReceiverType.External && 'text-blue-400'
          }
        cursor-pointer px-8 py-2
        `}
          onClick={() => setReceiverType(ReceiverType.External)}
        >
          External Receiver
        </div>
      </div>
      {receiverType === ReceiverType.Internal &&
        renderInternalReceiverAddresses()}
      {receiverType === ReceiverType.External && (
        <AddressInput
          onChange={(updatedAddress) => {
            setTransfer({
              ...transfer,
              receiverAddress: updatedAddress.address,
              isReceiverUniversalProfile: updatedAddress.isUniversalProfile,
            });
          }}
          inputAddress=""
        />
      )}
      <div className="mt-10 absolute right-6 bottom-10 flex flex-col items-end">
        {assetTransferInfos.assetType === LSPType.LSP7 && renderAmountInput()}
        <button
          type="submit"
          className=" w-[120px] h-10 bg-red-400 rounded-lg text-white"
        >
          Send
        </button>
      </div>
    </form>
  );

  const renderInternalReceiverAddresses = () => {
    const internalAddresses = [
      ...vaultsAssets.map((vault) => vault.vaultAddress),
      walletAddress,
    ].filter((address) => address !== assetTransferInfos.ownerAddress);

    const uniqueAddresses = internalAddresses.filter(
      (address, index) => internalAddresses.indexOf(address) === index,
    );
    return (
      <select
        className="w-full h-10 px-3 text-base placeholder-gray-600 rounded-lg appearance-none focus:shadow-outline bg-darkGray text-white leading-normal"
        value={transfer.receiverAddress}
        onChange={(e) => {
          setTransfer({
            ...transfer,
            receiverAddress: e.target.value,
          });
        }}
      >
        {uniqueAddresses.map((address) => (
          <option key={address} value={address}>
            {address}
          </option>
        ))}
      </select>
    );
  };

  const renderAssetUI = () => (
    <>
      <div className="mb-6 text-2xl font-bold">Asset to send</div>
      <div className="flex h-40">
        <img
          className="w-25 h-25 mr-12 rounded-lg"
          src={assetTransferInfos.img}
          alt={`${assetTransferInfos.assetAddress}-image`}
        />
        {assetTransferInfos.assetType === LSPType.LSP7 && (
          <div>Amount: {assetTransferInfos.amount}</div>
        )}
        {assetTransferInfos.assetType === LSPType.LSP8 && (
          <div>
            <span className="font-bold">Token ID: </span>#
            {assetTransferInfos.tokenId && parseInt(assetTransferInfos.tokenId)}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="relative">
      <div className="fix top-0 left-0 w-screen h-screen fixed bg-darkGray opacity-75"></div>
      <div className="w-[500px] h-[700px] fixed top-[calc(50%-350px)] left-[calc(50%-130px)] p-4 bg-black opacity-100 pt-20 px-8">
        <div
          className="absolute top-4 right-4"
          onClick={() =>
            setAssetTransferInfos(
              assetTransferInitialContext.assetTransferInfos,
            )
          }
        >
          <AiOutlineClose className="text-white text-2xl cursor-pointer" />
        </div>
        {renderAssetUI()}
        {transactionStatus === TransactionStatus.None
          ? renderTransferForm()
          : renderTransactionStatus()}
      </div>
    </div>
  );
};

export default AssetTransferModal;
